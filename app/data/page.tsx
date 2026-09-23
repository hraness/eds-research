import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { CORPUS_FILES, RESEARCH_FILES } from "../data-files";
import { absoluteSiteUrl, publicSitePath, site, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Data";
const DESCRIPTION =
  "Download the YAML files behind the EDS Research Index: sources, records, subtypes, searches, open questions, and the log of changes.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/data") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/data"),
  };
}

export default function DataPage() {
  return (
    <article className="prose">
      <h1 className="page-title">Data</h1>
      <p className="page-lede">
        {site.datasetDescription} Each file is checked against the published
        schema when the site builds, and every record, source, and date on the
        site comes from these files.
      </p>

      <h2>Corpus</h2>
      <p>
        The research records (findings, practices, events, patient-reported
        patterns, and programs) and the subtype registry.
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

      <h2>Sources, searches, and the change log</h2>
      <p>
        The source catalog, venues, searches for new evidence, change log, open
        questions, collections, and publication policy.
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

      <h2>How the files stay consistent</h2>
      <p>
        Each source&apos;s ID is built from its URL and publication date, so
        the same source always gets the same ID and duplicates are caught. The
        build also checks that every record, venue, collection, and log entry
        points to something that exists, and that each record gives a source
        the same evidence level as the source catalog. A broken reference stops
        the build rather than breaking a page.
      </p>
    </article>
  );
}
