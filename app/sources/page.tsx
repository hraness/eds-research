import { loadCorpus, loadResearch } from "@/lib/content";
import type { SourceStratum } from "@/lib/eds-schema";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { displayTier, STRATUM_LABELS } from "../display";
import { absoluteSiteUrl, publicSitePath, site, socialMetadata } from "../site";

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

/* The record the key uses to show how a record page groups its sources. */
const EXAMPLE_RECORD_ID = "dx-heds-remains-clinical";

function listInWords(items: readonly string[]): string {
  if (items.length <= 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

export default async function SourcesPage() {
  const research = await loadResearch();
  const corpus = await loadCorpus(research);
  const example = corpus.records.find((record) => record.id === EXAMPLE_RECORD_ID);
  if (example === undefined) {
    throw new Error(`The source key example record ${EXAMPLE_RECORD_ID} is missing.`);
  }
  const exampleStrata = STRATUM_ORDER.filter((stratum) =>
    example.evidence.some((attestation) => attestation.stratum === stratum),
  ).map((stratum) => STRATUM_LABELS[stratum]);

  return (
    <>
      <h1 className="page-title">Source catalog</h1>
      <p className="page-lede">
        {research.sources.length} sources, grouped by kind of evidence. Each
        entry links to the original and names its publisher and study design
        or source type.
      </p>
      <section aria-labelledby="source-key-title" className="section">
        <h2 className="section-title" id="source-key-title">
          How to read an entry
        </h2>
        <table className="meta-table">
          <tbody>
            <tr>
              <th scope="row">Kind of evidence</th>
              <td>
                The label in each group heading: clinical, community,
                historical, registry, or gray literature. The{" "}
                <a href={publicSitePath("/methodology")}>methodology</a>{" "}
                describes each kind.
              </td>
            </tr>
            <tr>
              <th scope="row">Evidence level</th>
              <td>
                The study design or source type after the publisher, such as
                cross-sectional study or cross-venue pattern. Each kind of
                evidence has its own scale, so compare levels only within one
                kind. A source has the same level in every record that cites
                it.
              </td>
            </tr>
            <tr>
              <th scope="row">Date and access</th>
              <td>
                The publication date when the catalog records one, and an
                access label such as paywalled or registration when the
                original is not openly available.
              </td>
            </tr>
            <tr>
              <th scope="row">Source ID</th>
              <td>
                The permanent ID under each entry, built from the source&apos;s
                URL and publication date. Records in the{" "}
                <a href={publicSitePath("/data")}>data files</a> cite sources
                by this ID.
              </td>
            </tr>
            <tr>
              <th scope="row">Last checked</th>
              <td>
                A date on each record page, taken from the record&apos;s{" "}
                <code>reviewed_at</code> field. It is not a clinical review.
                Every correction, including one made after that date, is listed
                in the change log on the{" "}
                <a href={publicSitePath("/research")}>research page</a>.
              </td>
            </tr>
          </tbody>
        </table>
        <p className="section-sub">
          A record page lists its sources under Evidence, with the same kind
          and level labels. For example, the record{" "}
          <a href={publicSitePath(`/records/${example.id}`)}>{example.title}</a>{" "}
          cites {listInWords(exampleStrata)} sources.
        </p>
      </section>
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
