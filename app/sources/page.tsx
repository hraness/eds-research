import { loadResearch } from "@/lib/content";
import type { SourceStratum } from "@/lib/eds-schema";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { displayTier, STRATUM_LABELS } from "../display";
import { absoluteSiteUrl, site, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "EDS research sources by kind of evidence";
const DESCRIPTION =
  `Every source the ${site.name} cites, grouped by kind of evidence, with its evidence level, publisher, and permanent ID.`;

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/sources") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/sources"),
  };
}

const STRATUM_ORDER: readonly SourceStratum[] = [
  "clinical",
  "community",
  "historical",
  "registry",
  "gray",
];

export default async function SourcesPage() {
  const research = await loadResearch();

  return (
    <>
      <h1 className="page-title">Source catalog</h1>
      <p className="page-lede">
        {research.sources.length} sources, grouped by kind of evidence. Each
        entry links to the original and names its publisher and study design
        or source type.
      </p>
      {STRATUM_ORDER.map((stratum) => {
        const sources = research.sources.filter(
          (source) => source.stratum === stratum,
        );
        if (sources.length === 0) return null;
        return (
          <section className="section" key={stratum}>
            <h2 className="section-title">
              <span className={`badge badge--stratum-${stratum}`}>
                {STRATUM_LABELS[stratum]}
              </span>{" "}
              {sources.length} {sources.length === 1 ? "source" : "sources"}
            </h2>
            <ul className="source-list">
              {sources.map((source) => (
                <li key={source.id}>
                  <a href={source.url}>{source.title}</a>
                  <span className="source-list__meta">
                    {" "}
                    · {source.publisher} · {displayTier(source.tier)}
                    {source.published_at !== undefined
                      ? ` · ${source.published_at}`
                      : ""}
                    {source.access !== "public" ? ` · ${source.access}` : ""}
                  </span>
                  {source.note !== undefined && (
                    <span className="source-list__note">{source.note}</span>
                  )}
                  <span className="source-list__id">{source.id}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
