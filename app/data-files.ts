import { absoluteSiteUrl } from "./site";

/* The public YAML data files, in the order the data page lists them. */
export const CORPUS_FILES = [
  "subtypes.yml",
  "historiography.yml",
  "diagnosis-and-classification.yml",
  "genetics.yml",
  "comorbidities.yml",
  "management.yml",
  "community-knowledge.yml",
  "folk-and-early-management.yml",
  "patient-experience.yml",
  "research-programs.yml",
] as const;

export const RESEARCH_FILES = [
  "sources.yml",
  "venues.yml",
  "monitors.yml",
  "runs.yml",
  "questions.yml",
  "collections.yml",
  "publication-policy.yml",
] as const;

/* The data page's worked example: list the nonclinical history records and resolve each cited source. */
export const DATA_READ_EXAMPLE_FILE = "historiography.yml" satisfies (typeof CORPUS_FILES)[number];
export const DATA_READ_EXAMPLE_COMMANDS = [
  `curl --fail --location --remote-name ${absoluteSiteUrl(`/eds-corpus/${DATA_READ_EXAMPLE_FILE}`)}`,
  `curl --fail --location --remote-name ${absoluteSiteUrl("/research/sources.yml")}`,
  "bun add yaml",
  `bun -e 'import { parse } from "yaml"; const read = async (name) => parse(await Bun.file(name).text()); const corpus = await read("${DATA_READ_EXAMPLE_FILE}"); const sources = new Map((await read("sources.yml")).sources.map((source) => [source.id, source])); console.log(corpus.schema, corpus.category.id); for (const record of corpus.records) for (const evidence of record.evidence) for (const id of evidence.source_ids) console.log(record.id, record.date, record.date_precision, evidence.stratum, evidence.tier, sources.get(id)?.title ?? "unknown " + id);'`,
] as const;
export const DATA_READ_EXAMPLE_LINE =
  "hist-van-meekren-1682 1682 year historical retrospective-account Ehlers-Danlos syndrome: a historical review";
