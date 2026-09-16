import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

import {
  EdsFileSchema,
  SubtypeFileSchema,
  type EdsCategory,
  type EdsRecord,
  type SubtypeRecord,
} from "./eds-schema";
import {
  CommunityVenueCatalogSchema,
  OpenQuestionLedgerSchema,
  PublicationPolicySchema,
  ResearchCollectionCatalogSchema,
  ResearchMonitorCatalogSchema,
  ResearchRunLedgerSchema,
  ResearchSourceCatalogSchema,
  type CommunityVenue,
  type OpenQuestion,
  type PublicationPolicy,
  type ResearchCollection,
  type ResearchMonitor,
  type ResearchRun,
  type ResearchSource,
} from "./research-schema";

const PROJECT_DIRECTORY = dirname(dirname(fileURLToPath(import.meta.url)));
const PUBLIC_DIRECTORY = join(PROJECT_DIRECTORY, "public");
const CORPUS_DIRECTORY = join(PUBLIC_DIRECTORY, "eds-corpus");
const RESEARCH_DIRECTORY = join(PUBLIC_DIRECTORY, "research");

async function parseYamlFile(path: string): Promise<unknown> {
  return parse(await readFile(path, "utf8")) as unknown;
}

export interface ResolvedRecord extends Omit<EdsRecord, "evidence"> {
  readonly categoryId: EdsCategory["id"];
  readonly categoryLabel: string;
  readonly evidence: ReadonlyArray<
    EdsRecord["evidence"][number] & { readonly sources: readonly ResearchSource[] }
  >;
  readonly venueNames: readonly string[];
}

export interface EdsCorpus {
  readonly categories: readonly EdsCategory[];
  readonly records: readonly ResolvedRecord[];
}

export interface EdsResearch {
  readonly sources: readonly ResearchSource[];
  readonly sourceById: ReadonlyMap<string, ResearchSource>;
  readonly venues: readonly CommunityVenue[];
  readonly venueById: ReadonlyMap<string, CommunityVenue>;
  readonly monitors: readonly ResearchMonitor[];
  readonly runs: readonly ResearchRun[];
  readonly questions: readonly OpenQuestion[];
  readonly collections: readonly ResearchCollection[];
  readonly publicationPolicy: PublicationPolicy;
}

export class CorpusIntegrityError extends Error {
  constructor(readonly problems: readonly string[]) {
    super(`Corpus integrity failed:\n${problems.map((p) => `- ${p}`).join("\n")}`);
    this.name = "CorpusIntegrityError";
  }
}

export async function loadResearch(): Promise<EdsResearch> {
  const [sourcesRaw, venuesRaw, monitorsRaw, runsRaw, questionsRaw, collectionsRaw, policyRaw] =
    await Promise.all([
      parseYamlFile(join(RESEARCH_DIRECTORY, "sources.yml")),
      parseYamlFile(join(RESEARCH_DIRECTORY, "venues.yml")),
      parseYamlFile(join(RESEARCH_DIRECTORY, "monitors.yml")),
      parseYamlFile(join(RESEARCH_DIRECTORY, "runs.yml")),
      parseYamlFile(join(RESEARCH_DIRECTORY, "questions.yml")),
      parseYamlFile(join(RESEARCH_DIRECTORY, "collections.yml")),
      parseYamlFile(join(RESEARCH_DIRECTORY, "publication-policy.yml")),
    ]);

  const sourceCatalog = ResearchSourceCatalogSchema.parse(sourcesRaw);
  const venueCatalog = CommunityVenueCatalogSchema.parse(venuesRaw);
  const monitorCatalog = ResearchMonitorCatalogSchema.parse(monitorsRaw);
  const runLedger = ResearchRunLedgerSchema.parse(runsRaw);
  const questionLedger = OpenQuestionLedgerSchema.parse(questionsRaw);
  const collectionCatalog = ResearchCollectionCatalogSchema.parse(collectionsRaw);
  const publicationPolicy = PublicationPolicySchema.parse(policyRaw);

  const sourceById = new Map(sourceCatalog.sources.map((s) => [s.id, s]));
  const venueById = new Map(venueCatalog.venues.map((v) => [v.id, v]));

  const problems: string[] = [];
  for (const source of sourceCatalog.sources) {
    if (source.venue_id !== undefined && !venueById.has(source.venue_id)) {
      problems.push(`source ${source.id} references unknown venue ${source.venue_id}`);
    }
  }
  for (const monitor of monitorCatalog.monitors) {
    void monitor;
  }
  for (const run of runLedger.runs) {
    for (const monitorId of run.monitors_used ?? []) {
      if (!monitorCatalog.monitors.some((m) => m.id === monitorId)) {
        problems.push(`run ${run.id} references unknown monitor ${monitorId}`);
      }
    }
  }
  if (problems.length > 0) throw new CorpusIntegrityError(problems);

  return {
    sources: sourceCatalog.sources,
    sourceById,
    venues: venueCatalog.venues,
    venueById,
    monitors: monitorCatalog.monitors,
    runs: [...runLedger.runs].sort((a, b) => b.date.localeCompare(a.date)),
    questions: questionLedger.questions,
    collections: collectionCatalog.collections,
    publicationPolicy,
  };
}

export async function loadCorpus(research?: EdsResearch): Promise<EdsCorpus> {
  const resolved = research ?? (await loadResearch());
  const entries = await readdir(CORPUS_DIRECTORY, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".yml"))
    .map((entry) => entry.name)
    .sort();

  const categories: EdsCategory[] = [];
  const records: ResolvedRecord[] = [];
  const problems: string[] = [];
  const seenRecordIds = new Set<string>();

  for (const fileName of files) {
    if (fileName === "subtypes.yml") continue;
    const raw = await parseYamlFile(join(CORPUS_DIRECTORY, fileName));
    const parsed = EdsFileSchema.safeParse(raw);
    if (!parsed.success) {
      problems.push(
        `${fileName}: ${parsed.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ")}`,
      );
      continue;
    }
    const file = parsed.data;
    if (file.category.id !== fileName.replace(/\.yml$/u, "")) {
      problems.push(
        `${fileName}: category id ${file.category.id} must match the file name`,
      );
    }
    categories.push(file.category);
    for (const record of file.records) {
      if (seenRecordIds.has(record.id)) {
        problems.push(`${fileName}: record id ${record.id} is not globally unique`);
        continue;
      }
      seenRecordIds.add(record.id);
      const evidence = record.evidence.map((attestation) => {
        const sources: ResearchSource[] = [];
        for (const sourceId of attestation.source_ids) {
          const source = resolved.sourceById.get(sourceId);
          if (source === undefined) {
            problems.push(
              `${fileName}: record ${record.id} references unknown source ${sourceId}`,
            );
            continue;
          }
          if (source.stratum !== attestation.stratum) {
            problems.push(
              `${fileName}: record ${record.id} attests source ${sourceId} as ${attestation.stratum} but the source catalog files it under ${source.stratum}`,
            );
            continue;
          }
          sources.push(source);
        }
        return { ...attestation, sources };
      });
      const venueNames: string[] = [];
      for (const venueId of record.venues ?? []) {
        const venue = resolved.venueById.get(venueId);
        if (venue === undefined) {
          problems.push(
            `${fileName}: record ${record.id} references unknown venue ${venueId}`,
          );
          continue;
        }
        venueNames.push(venue.name);
      }
      records.push({
        ...record,
        categoryId: file.category.id,
        categoryLabel: file.category.label,
        evidence,
        venueNames,
      });
    }
  }

  if (problems.length > 0) throw new CorpusIntegrityError(problems);
  categories.sort((a, b) => a.order - b.order);
  return { categories, records };
}

export async function loadSubtypes(
  research?: EdsResearch,
): Promise<readonly SubtypeRecord[]> {
  const resolved = research ?? (await loadResearch());
  const raw = await parseYamlFile(join(CORPUS_DIRECTORY, "subtypes.yml"));
  const file = SubtypeFileSchema.parse(raw);
  const problems: string[] = [];
  for (const subtype of file.subtypes) {
    for (const sourceId of subtype.source_ids) {
      if (!resolved.sourceById.has(sourceId)) {
        problems.push(`subtype ${subtype.id} references unknown source ${sourceId}`);
      }
    }
  }
  if (problems.length > 0) throw new CorpusIntegrityError(problems);
  return file.subtypes;
}

export function recordsByCategory(corpus: EdsCorpus): Map<string, ResolvedRecord[]> {
  const map = new Map<string, ResolvedRecord[]>();
  for (const record of corpus.records) {
    const list = map.get(record.categoryId) ?? [];
    list.push(record);
    map.set(record.categoryId, list);
  }
  return map;
}

export function sortRecordsChronological(
  records: readonly ResolvedRecord[],
): ResolvedRecord[] {
  return [...records].sort((a, b) =>
    (a.date ?? "9999").localeCompare(b.date ?? "9999"),
  );
}

export function sortRecordsReverseChronological(
  records: readonly ResolvedRecord[],
): ResolvedRecord[] {
  return [...records].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
}
