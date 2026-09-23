import { loadCorpus } from "@/lib/content";
import type { PracticeKind } from "@/lib/eds-schema";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { PRACTICE_KIND_LABELS } from "../display";
import { RecordItem } from "../record-view";
import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Practices";
const DESCRIPTION =
  "Care and management records for the Ehlers-Danlos syndromes, from physical therapy to historical folk practice, with the evidence level and any known risk.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/practices") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/practices"),
  };
}

const PRACTICE_KIND_ORDER: readonly PracticeKind[] = [
  "physical-therapy",
  "manual-therapy",
  "medication",
  "procedural",
  "device-aid",
  "diet-nutrition",
  "lifestyle-self-management",
  "psychological",
  "folk-practice",
];

export default async function PracticesPage() {
  const corpus = await loadCorpus();
  const practices = corpus.records.filter(({ kind }) => kind === "practice");

  const byKind = new Map<PracticeKind, typeof practices>();
  for (const record of practices) {
    if (record.practice_kind === undefined) continue;
    const list = byKind.get(record.practice_kind) ?? [];
    list.push(record);
    byKind.set(record.practice_kind, list);
  }

  return (
    <>
      <h1 className="page-title">Practices</h1>
      <p className="page-lede">
        How EDS is managed today and how it was managed in the past. Clinical
        guidance and historical folk practice appear on the same page, each
        labeled by the kind and strength of its evidence. Nothing here is a
        recommendation.
      </p>
      <div className="notice">
        <strong>Listed, not recommended.</strong> Folk and historical practices
        are included because people used them. Being listed says nothing about
        whether a practice works.
      </div>
      {PRACTICE_KIND_ORDER.map((practiceKind) => {
        const records = byKind.get(practiceKind);
        if (records === undefined || records.length === 0) return null;
        return (
          <section className="section" key={practiceKind}>
            <h2 className="section-title">
              {PRACTICE_KIND_LABELS[practiceKind]}
            </h2>
            <ul className="record-list">
              {records.map((record) => (
                <RecordItem key={record.id} record={record} />
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
