import { loadCorpus, loadResearch } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { RecordItem } from "../record-view";
import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Community knowledge";
const DESCRIPTION =
  "What EDS patient venues carry that the formal literature still lacks — indexed at venue level, filed as reports, never as clinical proof.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/community") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/community"),
  };
}

export default async function CommunityPage() {
  const [research, corpus] = await Promise.all([loadResearch(), loadCorpus()]);
  const signals = corpus.records.filter(({ kind }) => kind === "signal");

  return (
    <>
      <h1 className="page-title">Community knowledge</h1>
      <p className="page-lede">
        Patient communities accumulate dense lived-experience signal years
        before clinicians study it. This index admits that signal at venue level
        — patterns, not posters — and files it as community evidence, never as
        clinical proof.
      </p>
      <div className="notice">
        <strong>Reports, not proof.</strong> Community records describe what
        patients report. When a community signal is later confirmed by clinical
        research — as with local-anesthetic resistance — the record shows the
        whole arc.
      </div>

      <section className="section">
        <h2 className="section-title">Indexed venues</h2>
        <p className="section-sub">
          Venues are indexed with their access level and moderation model.
          Threads, handles, and individual posters are never cataloged.
        </p>
        <ul className="card-grid">
          {research.venues.map((venue) => (
            <li className="card" key={venue.id}>
              <p className="card__title">
                <a href={venue.url}>{venue.name}</a>
              </p>
              <p className="card__body">{venue.note ?? venue.host}</p>
              <p className="card__meta">
                {venue.kind} · {venue.access} · {venue.moderation} moderation
                {venue.scale_display !== undefined
                  ? ` · ${venue.scale_display}`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Community signals</h2>
        <p className="section-sub">
          Recurring patterns across venues, admitted under the publication
          policy as signals with mandatory reassessment dates.
        </p>
        <ul className="record-list">
          {signals.map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </ul>
      </section>
    </>
  );
}
