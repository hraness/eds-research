import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";
import { productMessaging } from "../product-messaging";

import {
  absoluteSiteUrl,
  GITHUB_REPOSITORY_URL,
  publicSitePath,
  site,
  socialMetadata,
} from "../site";

export const dynamic = "force-static";

const TITLE = "About";
const DESCRIPTION =
  `Who publishes the ${site.name}, why it exists, and the rules it follows for weighing clinical, patient, and historical evidence.`;

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/about") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/about"),
  };
}

export default function AboutPage() {
  return (
    <article className="prose">
      <h1 className="page-title">About</h1>
      <p className="page-lede">
        {productMessaging.medium}
      </p>

      <p className="notice">
        <strong>Not medical advice.</strong> The index describes research. It
        does not diagnose or recommend a course of care.
      </p>

      <h2>Why this exists</h2>
      <p>
        People with EDS compare symptoms and care experiences in forums and
        patient groups. Some of those reports become research questions.
        Patients reported that local anesthetics often failed them; surveys
        in 2005 and 2019 measured how often, and a randomized trial published
        in 2026 found that fewer people with EDS were still numb 15 and 30
        minutes after a lidocaine injection. The{' '}
        <a href={publicSitePath("/records/mgmt-lidocaine-resistance")}>
          local anesthetic record
        </a>{' '}
        links those studies and their results.
      </p>
      <p>
        The index keeps each kind of evidence visible and separate. A forum
        pattern is labeled as a patient report and graded on its own scale, so
        it can be taken seriously without being mistaken for a trial result.
        The diagnostic criteria were rewritten in 1988, 1997, and 2017, and
        the most common type, hEDS, still has no confirmed gene, so every
        record also names the types and criteria it applies to.
      </p>

      <h2>Editorial position</h2>
      <ul>
        <li>
          Each source is filed as clinical, community, historical, registry, or
          gray literature, and each kind has its own scale of evidence levels.
        </li>
        <li>
          Patient-community material is summarized by venue. No individual is
          named or quoted, and these records are labeled as patient reports.
        </li>
        <li>
          Historical and folk practices are listed because they happened.
          Listing one says nothing about whether it works.
        </li>
        <li>
          When the evidence is unsettled, the record says so: contested records
          are labeled contested, and emerging ones carry a date for
          reassessment.
        </li>
        <li>
          Every record names its sources, the EDS types it applies to, and the
          diagnostic criteria in force when its evidence was gathered.
        </li>
      </ul>

      <h2 id="other-eds-references">Other EDS references</h2>
      <p>
        <a href="https://www.ehlers-danlos.com/2017-eds-international-classification/">
          The Ehlers-Danlos Society
        </a>{" "}
        hosts the 2017 classification and the hEDS diagnostic checklist.{" "}
        <a href="https://www.ncbi.nlm.nih.gov/books/NBK1116/">GeneReviews</a>{" "}
        has clinician-written chapters on vascular, classical, and hypermobile
        EDS. <a href="https://www.orpha.net/">Orphanet</a> lists expert centers
        and prevalence estimates, and{" "}
        <a href="https://rarediseases.info.nih.gov/diseases/6322/ehlers-danlos-syndrome">
          GARD
        </a>{" "}
        and{" "}
        <a href="https://rarediseases.org/rare-diseases/ehlers-danlos-syndrome/">
          NORD
        </a>{" "}
        have plain-language overviews. This index is narrower. It lists
        individual findings, practices, and events, shows the kind of evidence
        behind each, and keeps patient reports next to clinical studies
        without ranking them together.
      </p>

      <h2>Independence and source code</h2>
      <p>
        The index is published by Hraness as an independent editorial project.
        It is not affiliated with, endorsed by, or funded by The Ehlers-Danlos
        Society or any medical body. The society appears throughout the index
        because it runs the DICE Global Registry and EDS ECHO. The data and the code that checks and renders it are public
        at{" "}
        <a href={GITHUB_REPOSITORY_URL}>github.com/hraness/eds-research</a>.
      </p>

      <h2>Contact and corrections</h2>
      <p>
        Corrections are welcome; see{" "}
        <a href={publicSitePath("/contact")}>contact</a>. The{" "}
        <a href={publicSitePath("/methodology")}>methodology</a> sets out the
        rules, and the{" "}
        <a href={publicSitePath("/research")}>research program</a> page lists
        open questions, searches, and the change log.
      </p>
    </article>
  );
}
