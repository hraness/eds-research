import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import {
  absoluteSiteUrl,
  GITHUB_REPOSITORY_URL,
  publicSitePath,
  socialMetadata,
} from "../site";

export const dynamic = "force-static";

const TITLE = "About";
const DESCRIPTION =
  "Who publishes the EDS Research Index, why it exists, and the rules it follows for weighing clinical, patient, and historical evidence.";

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
        EDS Research Index is an independent index of Ehlers-Danlos syndromes
        research for patients and clinicians. Each record links its sources
        and labels the kind of evidence behind it.
      </p>

      <h2>Why this exists</h2>
      <p>
        Rare diseases break the usual order of evidence. Evidence-based
        medicine ranks study designs, from systematic reviews down to case
        reports, and trials in the Ehlers-Danlos syndromes are few. People
        with EDS compare notes in forums and patient groups, and what they
        report can point research somewhere new. Patients reported that local
        anesthetics often failed them; surveys in 2005 and 2019 measured how
        often, and a randomized trial published in 2026 found that fewer
        people with EDS were still numb 15 and 30 minutes after a lidocaine
        injection.
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

      <h2>What this is not</h2>
      <p>
        This index is not medical advice, does not diagnose, and does not
        recommend or discourage any course of care. If you believe you may have
        EDS, the index can show you what is known and where the evidence lives;
        it cannot tell you what you have or what to do.
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
