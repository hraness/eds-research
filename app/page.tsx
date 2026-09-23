import { loadCorpus, loadResearch, loadSubtypes } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { JsonLdScript } from "@hraness/web-discovery/json-ld";
import type { Metadata } from "next";

import { STRATUM_LABELS } from "./display";
import { RecordItem } from "./record-view";
import { collectionPageJsonLd } from "./seo";
import { absoluteSiteUrl, publicSitePath, site, socialMetadata } from "./site";

export const dynamic = "force-static";

const STRATUM_ORDER = [
  "clinical",
  "community",
  "historical",
  "registry",
  "gray",
] as const;

const STRATUM_SUMMARIES: Record<string, string> = {
  clinical:
    "Peer-reviewed literature, trials, guidelines, and consensus statements.",
  community:
    "Patterns reported across forums, support groups, and patient organizations. The index names the venue, never the person.",
  historical:
    "Case reports from before EDS was formally classified, accounts of 19th-century performers, and folk treatments.",
  registry:
    "Patient registries, trial registrations, and rare-disease reference databases such as Orphanet and GARD.",
  gray: "Preprints, theses, and working papers that have not been peer reviewed.",
};

export function generateMetadata(): Metadata {
  const title = `${site.indexTitle}: sourced evidence on the Ehlers-Danlos syndromes`;
  return {
    title,
    description: site.description,
    alternates: { canonical: absoluteSiteUrl("/") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${title} | ${site.domain}`, site.description, "/"),
  };
}

export default async function Home() {
  const [research, corpus, subtypes] = await Promise.all([
    loadResearch(),
    loadCorpus(),
    loadSubtypes(),
  ]);

  const featured = corpus.records.filter(
    ({ corroboration, status }) =>
      corroboration === "convergent" &&
      status !== "contested" &&
      status !== "refuted",
  );
  const featuredByPriority = [
    corpus.records.find(({ id }) => id === "mgmt-lidocaine-resistance"),
    ...featured.filter(({ id }) => id !== "mgmt-lidocaine-resistance"),
  ].filter((record) => record !== undefined);

  const edsTypeCount = subtypes.filter(
    ({ classification }) => classification === "eds-2017",
  ).length;

  const strataCounts = new Map<string, number>();
  for (const record of corpus.records) {
    for (const stratum of new Set(record.evidence.map((e) => e.stratum))) {
      strataCounts.set(stratum, (strataCounts.get(stratum) ?? 0) + 1);
    }
  }

  return (
    <>
      <JsonLdScript
        data={collectionPageJsonLd(
          corpus.records.map(({ id, title }) => ({ id, title })),
          { description: site.description, path: "/", title: site.indexTitle },
        )}
        id="eds-research-index-structured-data"
      />
      <h1 className="page-title">EDS Research Index</h1>
      <p className="page-lede">
        An independent index of research on the Ehlers-Danlos syndromes (EDS),
        covering what is known and what is still unsettled. Each record links
        its sources, says what kind of evidence they are, and names the EDS
        types and the diagnostic criteria it applies to.
      </p>
      <div className="notice">
        <strong>Not medical advice.</strong> This index describes the evidence
        and where it comes from. It does not diagnose, recommend, or discourage
        any course of care. Historical and folk records describe what was done, not what
        works.
      </div>

      <div className="stat-row">
        <span className="stat">
          <span className="stat__n">{corpus.records.length}</span>
          <span className="stat__label">records</span>
        </span>
        <span className="stat">
          <span className="stat__n">{research.sources.length}</span>
          <span className="stat__label">sources</span>
        </span>
        <span className="stat">
          <span className="stat__n">{edsTypeCount}</span>
          <span className="stat__label">EDS types, plus HSD</span>
        </span>
        <span className="stat">
          <span className="stat__n">{research.questions.length}</span>
          <span className="stat__label">open questions</span>
        </span>
        <span className="stat">
          <span className="stat__n">{research.monitors.length}</span>
          <span className="stat__label">search monitors</span>
        </span>
      </div>

      <section className="section">
        <h2 className="section-title">Five kinds of evidence</h2>
        <p className="section-sub">
          Knowledge about rare diseases is scattered. The index files each
          source under one of five kinds of evidence and grades it on that
          kind&apos;s own scale, so a pattern seen in patient forums is never
          scored against a randomized trial.
        </p>
        <ul className="card-grid">
          {STRATUM_ORDER.map((stratum) => (
            <li className="card" key={stratum}>
              <p className="card__title">
                <span className={`badge badge--stratum-${stratum}`}>
                  {STRATUM_LABELS[stratum]}
                </span>
              </p>
              <p className="card__body">{STRATUM_SUMMARIES[stratum]}</p>
              <p className="card__meta">
                Cited in {strataCounts.get(stratum) ?? 0} records
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Browse the index</h2>
        <ul className="card-grid">
          <li className="card">
            <a className="card__link" href={publicSitePath("/subtypes")}>
              <p className="card__title">Subtypes</p>
              <p className="card__body">
                The thirteen types in the 2017 classification, plus HSD: genes,
                inheritance, prevalence, and what sets each apart.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/timeline")}>
              <p className="card__title">Timeline</p>
              <p className="card__body">
                From van Meek&apos;ren&apos;s 1682 report through Berlin,
                Villefranche, and the 2017 International Classification to
                KLK15.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/practices")}>
              <p className="card__title">Practices</p>
              <p className="card__body">
                Treatments and management approaches, from clinical guidance to
                patient-reported and folk practice, with the evidence level and
                any known risk.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/community")}>
              <p className="card__title">Community knowledge</p>
              <p className="card__body">
                Patterns reported in forums and support groups, filed as patient
                reports. Venues are named; individuals are not.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/sources")}>
              <p className="card__title">Source catalog</p>
              <p className="card__body">
                Every cited source with its kind of evidence, evidence level,
                publisher, and permanent ID.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/research")}>
              <p className="card__title">Research program</p>
              <p className="card__body">
                Open questions, the searches the index uses to find new evidence,
                and a log of every change to the data.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/methodology")}>
              <p className="card__title">Methodology</p>
              <p className="card__body">
                How sources are sorted and graded, how settled each claim is, and
                when records are reviewed.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/data")}>
              <p className="card__title">Data</p>
              <p className="card__body">
                Every record and source as plain YAML files you can download and
                check.
              </p>
            </a>
          </li>
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Where kinds of evidence agree</h2>
        <p className="section-sub">
          Records where independent studies or reports from more than one kind
          of evidence point the same way. Local anesthetics are the clearest
          case: patients reported that they failed, surveys measured how often,
          and a randomized trial published in 2026 found that fewer people
          with EDS were still numb 15 and 30 minutes after a lidocaine
          injection.
        </p>
        <ul className="record-list">
          {featuredByPriority.slice(0, 6).map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Categories</h2>
        <ul className="card-grid">
          {corpus.categories.map((category) => (
            <li className="card" key={category.id}>
              <a
                className="card__link"
                href={publicSitePath(`/topics/${category.id}`)}
              >
                <p className="card__title">{category.label}</p>
                <p className="card__body">{category.description}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
