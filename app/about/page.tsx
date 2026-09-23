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
        The EDS Research Index is an independent, open-source guide to what is
        known about the Ehlers-Danlos syndromes. It draws on journals,
        registries, patient forums, and historical case reports, and it keeps
        track of which kind of source each claim comes from.
      </p>

      <h2>Why this exists</h2>
      <p>
        The diagnostic criteria for EDS have been revised three times in forty
        years, and the most common type, hEDS, still has no confirmed gene. The
        first candidate gene, KLK15, was reported in a 2024 preprint and
        published in 2025. Patients sometimes notice a problem long before
        researchers study it; local anesthetics failing in EDS is the
        best-documented case. The index takes patient reports seriously and
        labels them as reports, so they are not mistaken for trial results.
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
