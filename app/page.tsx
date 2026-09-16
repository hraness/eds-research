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
    "Venue-level patterns from forums, support groups, and patient organizations — never individual posters.",
  historical:
    "Pre-nosology case descriptions, performer-era records, and documented folk management.",
  registry:
    "Patient registries, trial registrations, and rare-disease reference rails.",
  gray: "Preprints, theses, and working papers ahead of peer review.",
};

export async function generateMetadata(): Promise<Metadata> {
  const corpus = await loadCorpus();
  const title = `${site.indexTitle}: ${corpus.records.length} sourced records`;
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
    ({ corroboration }) => corroboration === "convergent",
  );
  const featuredByPriority = [
    corpus.records.find(({ id }) => id === "mgmt-lidocaine-resistance"),
    ...featured.filter(({ id }) => id !== "mgmt-lidocaine-resistance"),
  ].filter((record) => record !== undefined);

  const strataCounts = new Map<string, number>();
  for (const record of corpus.records) {
    for (const { stratum } of record.evidence) {
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
        An independent, source-linked index of what is known — and what is still
        being worked out — about the Ehlers-Danlos syndromes. Every record names
        its evidence, its stratum, its subtype scope, and its diagnostic era.
      </p>
      <div className="notice">
        <strong>Not medical advice.</strong> This index documents evidence and
        provenance. It does not diagnose, recommend, or discourage any course of
        care. Historical and folk records describe what was done, not what
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
          <span className="stat__n">{subtypes.length}</span>
          <span className="stat__label">subtypes</span>
        </span>
        <span className="stat">
          <span className="stat__n">{research.questions.length}</span>
          <span className="stat__label">open questions</span>
        </span>
        <span className="stat">
          <span className="stat__n">{research.monitors.length}</span>
          <span className="stat__label">live monitors</span>
        </span>
      </div>

      <section className="section">
        <h2 className="section-title">Five strata of evidence</h2>
        <p className="section-sub">
          Rare-disease knowledge does not live in one place. This index files
          every source under one of five strata and never collapses them into a
          single score — a forum pattern and a randomized trial are both real
          evidence, and they are not the same kind of real.
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
                {strataCounts.get(stratum) ?? 0} attestations
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
                All thirteen 2017-classification types plus HSD — genes,
                inheritance, prevalence, and what distinguishes each.
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
                Management and treatment records — clinical, community-reported,
                and folk — with evidence tier and risk made explicit.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/community")}>
              <p className="card__title">Community knowledge</p>
              <p className="card__body">
                Venue-level signals from forums and support groups, filed as
                reports — with the venues named and individuals never.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/sources")}>
              <p className="card__title">Source catalog</p>
              <p className="card__body">
                Every cited source with its stratum, tier, publisher, and
                stable identifier.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/research")}>
              <p className="card__title">Research program</p>
              <p className="card__body">
                Discovery monitors, open questions, collections, and the
                append-only run ledger.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/methodology")}>
              <p className="card__title">Methodology</p>
              <p className="card__body">
                The full research methodology: strata, tiers, corroboration,
                criteria eras, review lifecycle, and publication policy.
              </p>
            </a>
          </li>
          <li className="card">
            <a className="card__link" href={publicSitePath("/data")}>
              <p className="card__title">Data</p>
              <p className="card__body">
                The open YAML corpus behind every page — downloadable,
                diffable, auditable.
              </p>
            </a>
          </li>
        </ul>
      </section>

      <section className="section">
        <h2 className="section-title">Cross-stratum convergences</h2>
        <p className="section-sub">
          Records where independent strata agree — the pattern a rare-disease
          index exists to surface. The lidocaine record is the reference case:
          patients reported anesthetic failure for decades before a randomized
          trial confirmed it.
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
