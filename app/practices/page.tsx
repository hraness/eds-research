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
  "Management, treatment, and folk-practice records for the Ehlers-Danlos syndromes — each with its evidence tier, stratum, and risk annotation explicit.";

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
        What is done — and what was done — for EDS. Clinical management sits
        beside documented folk practice; the strata and statuses keep them
        distinct. Nothing here is a recommendation.
      </p>
      <div className="notice">
        <strong>Documented, not endorsed.</strong> Folk and historical practices
        are indexed as historical objects. A practice&apos;s presence records
        its provenance, never its efficacy.
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
