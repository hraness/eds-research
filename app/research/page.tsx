import { loadCorpus, loadResearch } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { STRATUM_LABELS } from "../display";
import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Research program";
const DESCRIPTION =
  "The living research machinery behind the index: discovery monitors, open questions, curated collections, and the append-only run ledger.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/research") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/research"),
  };
}

export default async function ResearchPage() {
  const [research, corpus] = await Promise.all([loadResearch(), loadCorpus()]);
  const recordById = new Map(corpus.records.map((r) => [r.id, r]));

  return (
    <>
      <h1 className="page-title">Research program</h1>
      <p className="page-lede">
        The index is a running research program: declared monitors feed intake,
        intake is logged in an append-only ledger, and open questions track
        what the evidence has not settled.
      </p>

      <section className="section">
        <h2 className="section-title">Open questions</h2>
        <p className="section-sub">
          What the index is watching. Each names the strata it seeks evidence
          from.
        </p>
        <ul className="record-list">
          {research.questions.map((question) => (
            <li className="record-item" key={question.id}>
              <div className="record-item__head">
                <h3 className="record-item__title">{question.question}</h3>
                <span className="badge badge--kind">{question.status}</span>
              </div>
              <p className="record-item__summary">{question.why_open}</p>
              <p className="record-item__meta">
                seeks:{" "}
                {question.strata_sought
                  .map((s) => STRATUM_LABELS[s])
                  .join(", ")}{" "}
                · opened {question.opened_at} · reviewed{" "}
                {question.last_reviewed}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Collections</h2>
        <ul className="record-list">
          {research.collections.map((collection) => (
            <li className="record-item" key={collection.id}>
              <div className="record-item__head">
                <h3 className="record-item__title">{collection.label}</h3>
              </div>
              <p className="record-item__summary">{collection.description}</p>
              <p className="record-item__meta">
                {collection.record_ids
                  .map((id) => recordById.get(id)?.title ?? id)
                  .join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Discovery monitors</h2>
        <p className="section-sub">
          Declared, bounded inputs on fixed cadences — what the program watches
          and why.
        </p>
        <ul className="record-list">
          {research.monitors.map((monitor) => (
            <li className="record-item" key={monitor.id}>
              <div className="record-item__head">
                <h3 className="record-item__title">{monitor.label}</h3>
                <span className="badge badge--kind">
                  {monitor.active ? "active" : "paused"}
                </span>
              </div>
              <p className="record-item__summary">{monitor.purpose}</p>
              <p className="record-item__meta">
                {monitor.kind} · every {monitor.cadence_days}d · strata:{" "}
                {monitor.strata.map((s) => STRATUM_LABELS[s]).join(", ")}
                {monitor.last_checked !== undefined
                  ? ` · checked ${monitor.last_checked}`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Run ledger</h2>
        <p className="section-sub">
          Append-only intake log. Corrections add new entries; history is never
          rewritten.
        </p>
        <ul className="record-list">
          {research.runs.map((run) => (
            <li className="record-item" key={run.id}>
              <div className="record-item__head">
                <h3 className="record-item__title">{run.scope}</h3>
              </div>
              {run.notes !== undefined && (
                <p className="record-item__summary">{run.notes}</p>
              )}
              <p className="record-item__meta">
                {run.id} · {run.date} · strata:{" "}
                {run.strata.map((s) => STRATUM_LABELS[s]).join(", ")}
                {run.monitors_used !== undefined
                  ? ` · ${run.monitors_used.length} monitors`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
