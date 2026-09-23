import { loadCorpus, loadResearch } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { RecordItem } from "../record-view";
import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Community knowledge";
const DESCRIPTION =
  "Patterns reported in EDS patient forums and organizations, filed as patient reports rather than clinical findings. Venues are named, individual posters never.";

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
        Patient communities sometimes notice problems before researchers study
        them. The index records patterns that recur across forums and patient
        organizations, names the venue rather than any person, and labels them
        as patient reports.
      </p>
      <div className="notice">
        <strong>Reports, not proof.</strong> These records describe what
        patients report. When clinical research later supports a pattern, as a
        2026 trial did for local anesthetic resistance, the record cites both.
      </div>

      <section className="section">
        <h2 className="section-title">Venues</h2>
        <p className="section-sub">
          Each venue is listed with who can read it and how it is moderated.
          Threads, usernames, and individual posters are never cataloged.
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
        <h2 className="section-title">Reported patterns</h2>
        <p className="section-sub">
          Patterns reported across venues. Each carries a date by which it will
          be reassessed.
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
