import { loadCorpus, loadResearch } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { STRATUM_LABELS } from "../display";
import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Research program";
const DESCRIPTION =
  "Open questions the EDS Research Index is tracking, the searches it uses to find new evidence, curated collections, and the log of every change to the data.";

const MONITOR_KIND_LABELS: Record<string, string> = {
  "literature-query": "literature search",
  "trial-registry": "trial registry",
  "guideline-watch": "guideline watch",
  "registry-watch": "registry watch",
  "preprint-watch": "preprint watch",
  "venue-scan": "venue scan",
  "org-feed": "organization feed",
};

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
        What the index is tracking: open questions, the searches it uses to
        find new evidence, and a log of every change to the data.
      </p>

      <section className="section">
        <h2 className="section-title">Open questions</h2>
        <p className="section-sub">
          Questions the evidence has not settled, with the kinds of evidence
          that could answer each.
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
                could be answered by:{" "}
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
        <h2 className="section-title">Searches for new evidence</h2>
        <p className="section-sub">
          Each search, what it looks for, how often it should run, and when it
          was last checked. Nothing runs these searches automatically.
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
                {MONITOR_KIND_LABELS[monitor.kind] ?? monitor.kind} · every{" "}
                {monitor.cadence_days} days · evidence:{" "}
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
        <h2 className="section-title">Change log</h2>
        <p className="section-sub">
          Every update to the data, oldest first. Corrections add a new entry;
          earlier entries are not edited.
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
              {run.corrections !== undefined && run.corrections.length > 0 && (
                <ul className="source-list">
                  {run.corrections.map((correction, index) => (
                    <li key={index}>
                      <strong>{correction.target}</strong>: {correction.change}
                      {correction.evidence !== undefined && (
                        <span className="source-list__meta">
                          {" "}
                          Evidence: {correction.evidence}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <p className="record-item__meta">
                {run.id} · {run.date} · evidence:{" "}
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
