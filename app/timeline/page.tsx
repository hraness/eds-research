import { loadCorpus, sortRecordsChronological } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { CRITERIA_ERA_LABELS, displayDate, STATUS_LABELS } from "../display";
import { absoluteSiteUrl, publicSitePath, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Timeline";
const DESCRIPTION =
  "How the idea of Ehlers-Danlos syndrome took shape, from van Meek'ren's 1682 case report to the 2017 classification and KLK15, a candidate hEDS gene published in 2025.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/timeline") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/timeline"),
  };
}

export default async function TimelinePage() {
  const corpus = await loadCorpus();
  const events = sortRecordsChronological(
    corpus.records.filter(({ kind }) => kind === "event"),
  );

  return (
    <>
      <h1 className="page-title">Timeline</h1>
      <p className="page-lede">
        How the idea of EDS changed over time. Each event is tagged with the
        diagnostic criteria in force when its sources were written, because a
        1975 cohort and a 2020 hEDS cohort are not the same population.
      </p>
      <ol className="timeline">
        {events.map((event) => (
          <li className="timeline__item" key={event.id}>
            <span className="timeline__date">
              {displayDate(event.date, event.date_precision)}
            </span>
            <div className="timeline__body">
              <h2 className="timeline__title">
                <a href={publicSitePath(`/records/${event.id}`)}>
                  {event.title}
                </a>
              </h2>
              <p className="timeline__summary">{event.summary}</p>
              <p className="record-item__meta">
                {STATUS_LABELS[event.status]} ·{" "}
                {CRITERIA_ERA_LABELS[event.criteria_era]}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
