import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { absoluteSiteUrl, publicSitePath, site, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Data";
const DESCRIPTION =
  "The open YAML corpus behind the EDS research index — sources, records, subtypes, monitors, questions, and the run ledger, downloadable and auditable.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/data") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/data"),
  };
}

const CORPUS_FILES = [
  "subtypes.yml",
  "historiography.yml",
  "diagnosis-and-classification.yml",
  "genetics.yml",
  "comorbidities.yml",
  "management.yml",
  "community-knowledge.yml",
  "folk-and-early-management.yml",
  "patient-experience.yml",
  "research-programs.yml",
] as const;

const RESEARCH_FILES = [
  "sources.yml",
  "venues.yml",
  "monitors.yml",
  "runs.yml",
  "questions.yml",
  "collections.yml",
  "publication-policy.yml",
] as const;

export default function DataPage() {
  return (
    <article className="prose">
      <h1 className="page-title">Data</h1>
      <p className="page-lede">
        {site.datasetDescription} Every file is plain YAML, validated against
        the published schema at build time. Nothing on this site exists that is
        not in these files.
      </p>

      <h2>Corpus</h2>
      <p>
        The research records — findings, practices, events, signals, and
        programs — plus the subtype registry.
      </p>
      <ul>
        {CORPUS_FILES.map((file) => (
          <li key={file}>
            <a href={publicSitePath(`/eds-corpus/${file}`)}>
              <code>/eds-corpus/{file}</code>
            </a>
          </li>
        ))}
      </ul>

      <h2>Research infrastructure</h2>
      <p>
        The source catalog, venue registry, discovery monitors, append-only run
        ledger, open questions, collections, and publication policy.
      </p>
      <ul>
        {RESEARCH_FILES.map((file) => (
          <li key={file}>
            <a href={publicSitePath(`/research/${file}`)}>
              <code>/research/{file}</code>
            </a>
          </li>
        ))}
      </ul>

      <h2>Provenance contract</h2>
      <p>
        Source identifiers are deterministic — derived from the canonical URL
        and publication date — so the same source always resolves to the same
        ID and duplicates fail validation. Record references, venue references,
        collection membership, and run admissions are all checked for
        referential integrity at build time; a broken reference fails the
        build, not the page.
      </p>
    </article>
  );
}
