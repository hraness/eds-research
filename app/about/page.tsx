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
  "What the EDS Research Index is, why it exists, and the editorial position it runs on.";

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
        An independent, open-source research index for the Ehlers-Danlos
        syndromes — built to answer a structural question: how do you honestly
        index what is known about a rare disease when the knowledge lives in
        journals, registries, forums, and four centuries of case notes at once?
      </p>

      <h2>Why this exists</h2>
      <p>
        EDS is under-researched relative to its burden, its diagnostic criteria
        have been revised three times in forty years, and the most common type
        had no associated gene until 2025. Patient communities have carried
        real signal — local-anesthetic resistance being the documented example —
        for years before formal study confirmed it. A serious index for this
        disease has to take all of that seriously without pretending a forum
        post is a clinical trial.
      </p>

      <h2>Editorial position</h2>
      <ul>
        <li>
          Evidence is stratified, never flattened. Clinical, community,
          historical, registry, and gray-literature sources each carry their
          own tier ladder.
        </li>
        <li>
          Community material is indexed at venue level — patterns, never
          posters — and filed as reports, not proof.
        </li>
        <li>
          Historical and folk practices are documented as historical objects.
          Admission records existence and provenance, never efficacy.
        </li>
        <li>
          Uncertainty is publishable. Contested records are labeled contested;
          emerging records carry reassessment dates.
        </li>
        <li>
          Every record names its sources, its subtype scope, and the diagnostic
          era its evidence worked under.
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
        Society or any medical body — the society appears throughout the corpus
        because it operates the field&apos;s central research infrastructure.
        The full corpus and the code that validates and renders it are public
        at{" "}
        <a href={GITHUB_REPOSITORY_URL}>github.com/hraness/eds-research</a>.
      </p>

      <h2>Contact and corrections</h2>
      <p>
        Corrections are a first-class input — see{" "}
        <a href={publicSitePath("/contact")}>contact</a>. The methodology is{" "}
        <a href={publicSitePath("/methodology")}>documented in full</a>, and the
        research machinery is on the{" "}
        <a href={publicSitePath("/research")}>research program</a> page.
      </p>
    </article>
  );
}
