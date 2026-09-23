import { loadResearch } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { clinicalConsensusTiers } from "@/lib/eds-schema";

import { displayTier } from "../display";
import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Methodology";
const DESCRIPTION =
  "How the EDS Research Index sorts sources into five kinds of evidence, grades them within each kind, and schedules records for review.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/methodology") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/methodology"),
  };
}

export default async function MethodologyPage() {
  const research = await loadResearch();
  const policy = research.publicationPolicy;
  const consensusTiers = clinicalConsensusTiers.map(displayTier);

  return (
    <article className="prose">
      <h1 className="page-title">Methodology</h1>
      <p className="page-lede">
        Rare diseases are studied differently from common ones. Trials are few,
        patient communities sometimes notice problems years before the
        literature does, and the diagnostic criteria for EDS have changed three
        times in forty years. This page sets out the rules the index follows.
        The site checks some of them automatically when it builds; the rest
        depend on editorial review.
      </p>

      <h2>1. Five kinds of evidence</h2>
      <p>
        Every source is filed under exactly one of five kinds of evidence, and
        every record lists its evidence by kind. The kinds are never merged
        into a single score.
      </p>
      <ul>
        <li>
          Clinical: peer-reviewed articles, trials, guidelines, consensus
          statements, and laboratory studies.
        </li>
        <li>
          Community: patterns reported across forums, support groups, and
          patient organizations. The index names the venue only; no individual
          poster, username, or verbatim post is recorded.
        </li>
        <li>
          Historical: case reports from before EDS was formally classified,
          accounts written at the time, archival records, and documented folk
          practice.
        </li>
        <li>
          Registry: patient registries, trial registrations, and rare-disease
          reference databases (Orphanet, GARD, ClinicalTrials.gov).
        </li>
        <li>
          Gray literature: preprints, theses, conference abstracts, and working
          papers that have not been peer reviewed.
        </li>
      </ul>

      <h2>2. Evidence levels within each kind</h2>
      <p>
        Each kind of evidence has its own scale, so a randomized trial and a
        recurring forum pattern are never ranked against each other. The
        clinical scale runs from systematic review to case report, the
        community scale from structured patient survey to individual account,
        and the historical scale from primary historical document to folk
        tradition. The build rejects a record that gives a source a level from
        the wrong scale, or a level different from the one in the source
        catalog.
      </p>

      <h2>3. When kinds of evidence agree or disagree</h2>
      <p>
        A record whose evidence spans more than one kind states how that
        evidence relates: <strong>convergent</strong> when independent studies
        or reports agree, <strong>one underlying source</strong> when the
        different kinds restate a single study or report (a paper, its
        preprint, and a press release are one study),{" "}
        <strong>contested</strong> when they disagree, or{" "}
        <strong>refuted</strong>. Records with one kind of evidence make no
        such claim. Local anesthetic resistance is the clearest example of
        agreement: patient reports came first, then surveys, then a randomized
        trial.
      </p>

      <h2>4. Diagnostic criteria</h2>
      <p>
        What counted as &ldquo;EDS&rdquo; changed with each classification. The
        1997 Villefranche nosology consolidated the types to six, and the 2017
        International Classification defines thirteen and created
        hypermobility spectrum disorder (HSD) for people with symptomatic
        hypermobility who do not meet the hEDS criteria. Every record names the
        criteria in force when its sources were written, so a study from before
        2017 is not read as a study of hEDS as defined today.
      </p>

      <h2>5. EDS types</h2>
      <p>
        Every record names the EDS types it applies to. A finding about hEDS is
        not applied to vEDS or other types with a known gene: the conditions
        share a name but differ in cause, risk, and management. Records that
        apply to all types say so.
      </p>

      <h2>6. How settled each claim is</h2>
      <ul>
        <li>
          Established: at least one clinical source at one of these levels:{" "}
          {consensusTiers.join(", ")}. A research program record may instead
          rest on a registry source.
        </li>
        <li>
          Probable: supported by other clinical or registry evidence.
        </li>
        <li>
          Emerging: new and not yet replicated. Always has a reassessment date.
        </li>
        <li>
          Contested: sources or studies disagree. Always has a reassessment
          date.
        </li>
        <li>
          Community signal: a pattern patients report consistently that
          clinical research has not tested. Always has a reassessment date.
        </li>
        <li>
          Historical record: something documented in the past. Listing it
          records that it happened, not that it works.
        </li>
        <li>
          Refuted: contradicted by stronger evidence. Kept on the site and
          labeled, not deleted.
        </li>
      </ul>

      <h2>7. Review dates</h2>
      <p>
        Every record carries the date it was last reviewed. Emerging,
        contested, and community-signal records cannot be published without a
        reassessment date. The publication policy sets target intervals of{" "}
        {policy.reassessment_days.emerging} days for emerging records,{" "}
        {policy.reassessment_days.contested} for contested,{" "}
        {policy.reassessment_days.community_signal} for community signals, and{" "}
        {policy.reassessment_days.established} for established records. The
        build does not enforce these intervals.
      </p>

      <h2>8. Publication policy</h2>
      <p>These rules are quoted from the published policy file:</p>
      <ul>
        {policy.rules.map((rule) => (
          <li key={rule.id}>{rule.text}</li>
        ))}
      </ul>
      <p>
        Two kinds of entry can go live without review, and only as
        bibliographic facts: trial registrations and journal articles (title,
        venue, date, and identifier). Everything else needs review: every
        clinical claim, practice assessment, and risk note; any reading of a
        registry beyond its own fields; and all community, historical, and gray
        literature material. Preprints enter provisionally and are marked
        emerging.
      </p>

      <h2>9. Searches and the change log</h2>
      <p>
        The index lists the searches it uses to find new evidence (PubMed,
        ClinicalTrials.gov, society news, preprint servers, guideline bodies,
        community venues, and historical archives) and how often each should
        run. Each update to the data is logged with its date, the searches
        used, and what changed. Corrections add a new log entry; earlier
        entries are not edited.
      </p>

      <h2>10. What this index does not do</h2>
      <p>
        It does not diagnose. It does not recommend or discourage any course of
        care for any individual. It does not treat forum reports as clinical
        evidence, and it does not treat documented folk practice as treatment.
        When evidence is weak or contradictory, the record says so and says why.
      </p>
    </article>
  );
}
