import { EDS_CORPUS_SCHEMA_VERSION } from "@/lib/eds-schema";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import {
  CORPUS_FILES,
  DATA_READ_EXAMPLE_COMMANDS,
  DATA_READ_EXAMPLE_LINE,
  RESEARCH_FILES,
} from "../data-files";
import { absoluteSiteUrl, GITHUB_REPOSITORY_URL, publicSitePath, site, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = `${site.name} data downloads (YAML)`;
const DESCRIPTION =
  `Download the YAML files behind the ${site.name}: sources, records, subtypes, searches, open questions, and the log of changes.`;

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

      <h2>Read a record file</h2>
      <p>
        Each corpus file other than <code>subtypes.yml</code> has a{" "}
        <code>category</code>, a list of <code>records</code>, and the schema
        version{" "}
        <code>{EDS_CORPUS_SCHEMA_VERSION}</code>. A record&apos;s{" "}
        <code>evidence</code> list names its sources by ID, grouped by kind of
        evidence and evidence level. This example reads the files with the{" "}
        <a href="https://www.npmjs.com/package/yaml">yaml package</a>, as this
        site does, and lists the history records with the title of each source
        they cite:
      </p>
      <pre>
        <code>{DATA_READ_EXAMPLE_COMMANDS.join("\n")}</code>
      </pre>
      <p>
        The output starts with{" "}
        <code>{EDS_CORPUS_SCHEMA_VERSION} historiography</code>, then prints one
        line per cited source: the record ID, its date and date precision, the
        kind of evidence, the evidence level, and the source title. One line
        reads:
      </p>
      <pre>
        <code>{DATA_READ_EXAMPLE_LINE}</code>
      </pre>
      <ul>
        <li>
          <code>subtypes</code> and <code>criteria_era</code>: the EDS types a
          record covers and the diagnostic criteria in force when its sources
          were written. Keep both with the claim.
        </li>
        <li>
          <code>evidence</code>: a list of entries, each with a kind of
          evidence (<code>stratum</code>), an evidence level
          (<code>tier</code>), and the <code>source_ids</code> behind it.
          Compare levels only within one kind of evidence.
        </li>
        <li>
          <code>status</code>: how settled the claim is, as the{" "}
          <a href={publicSitePath("/methodology")}>methodology</a> defines it.
        </li>
        <li>
          <code>date</code> and <code>date_precision</code>: dates are quoted
          text, such as <code>1682</code> or <code>-0400</code>, where a minus sign
          marks a year before the common era. The precision is{" "}
          <code>day</code>, <code>month</code>, <code>year</code>,{" "}
          <code>decade</code>, or <code>century</code>.
        </li>
        <li>
          <code>reviewed_at</code> and <code>reassess_by</code>: the Last
          checked and Reassess by dates on the record page. The{" "}
          <a href={publicSitePath("/sources")}>source catalog</a> explains Last
          checked.
        </li>
      </ul>
      <p>
        The{" "}
        <a href={`${GITHUB_REPOSITORY_URL}/blob/main/lib/eds-schema.ts`}>corpus
        schema</a> and{" "}
        <a href={`${GITHUB_REPOSITORY_URL}/blob/main/lib/research-schema.ts`}>research
        schema</a> define every field.
      </p>

      <h2>License</h2>
      <p>
        These files are licensed under{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
        Credit them as &ldquo;{site.name} ({site.domain}), CC BY
        4.0&rdquo; and say whether you changed them. The papers and reports
        they cite keep their own terms.
      </p>

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
