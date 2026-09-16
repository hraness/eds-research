import { loadCorpus, sortRecordsChronological } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { displayDate, STATUS_LABELS } from "../display";
import { absoluteSiteUrl, publicSitePath, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Timeline";
const DESCRIPTION =
  "The Ehlers-Danlos concept across four centuries — from van Meek'ren's 1682 case report through the Berlin and Villefranche nosologies to the 2017 International Classification and the first hEDS gene.";

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
        The disease concept, not just the disease. Every event is tagged with
        the diagnostic-criteria era its sources worked under — a 1975 cohort and
        a 2020 hEDS cohort are not the same population.
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
                {STATUS_LABELS[event.status]} · {event.criteria_era}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
