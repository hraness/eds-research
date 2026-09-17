import {
  loadCorpus,
  loadResearch,
  loadSubtypes,
  recordsByCategory,
} from "@/lib/content";
import type { MetadataRoute } from "next";

import { absoluteSiteUrl, type SitePath } from "./site";

function isoDay(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function latestOf(values: readonly string[]): string | undefined {
  return [...values].sort().at(-1);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [research, corpus, subtypes] = await Promise.all([
    loadResearch(),
    loadCorpus(),
    loadSubtypes(),
  ]);
  const categoryRecords = recordsByCategory(corpus);

  const corpusModified = latestOf([
    ...corpus.records.map((record) => record.reviewed_at),
    ...subtypes.map((subtype) => subtype.reviewed_at),
  ]);
  const researchModified = latestOf([
    ...research.runs.map((run) => run.date),
    ...research.questions.map((question) => question.last_reviewed),
    ...research.monitors.flatMap((monitor) =>
      monitor.last_checked === undefined ? [] : [monitor.last_checked],
    ),
  ]);
  const sourcesModified = latestOf(
    research.sources.flatMap((source) =>
      source.retrieved_at === undefined ? [] : [source.retrieved_at],
    ),
  );
  const kindModified = (kind: "practice" | "signal" | "event") =>
    latestOf(
      corpus.records
        .filter((record) => record.kind === kind)
        .map((record) => record.reviewed_at),
    );

  const entry = (
    path: SitePath,
    lastModified: string | undefined,
  ): MetadataRoute.Sitemap[number] => ({
    url: absoluteSiteUrl(path),
    ...(lastModified !== undefined && { lastModified: isoDay(lastModified) }),
  });

  return [
    entry("/", corpusModified),
    entry("/subtypes", latestOf(subtypes.map((s) => s.reviewed_at))),
    entry("/timeline", kindModified("event")),
    entry("/practices", kindModified("practice")),
    entry("/community", kindModified("signal")),
    entry("/sources", sourcesModified ?? researchModified),
    entry("/research", researchModified),
    entry(
      "/data",
      latestOf(
        [corpusModified, researchModified].filter(
          (value): value is string => value !== undefined,
        ),
      ),
    ),
    entry("/methodology", undefined),
    entry("/about", undefined),
    entry("/contact", undefined),
    entry("/privacy", undefined),
    ...corpus.categories.map(({ id }) =>
      entry(
        `/topics/${id}`,
        latestOf(
          (categoryRecords.get(id) ?? []).map((record) => record.reviewed_at),
        ),
      ),
    ),
    ...corpus.records.map(({ id, reviewed_at }) =>
      entry(`/records/${id}`, reviewed_at),
    ),
    ...subtypes.map(({ id, reviewed_at }) =>
      entry(`/subtypes/${id}`, reviewed_at),
    ),
  ];
}
