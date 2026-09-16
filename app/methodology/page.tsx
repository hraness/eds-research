import { loadResearch } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Methodology";
const DESCRIPTION =
  "How this index researches a rare disease: stratified sources, per-stratum evidence tiers, cross-stratum corroboration, diagnostic-era tagging, subtype scoping, and a review lifecycle.";

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

  return (
    <article className="prose">
      <h1 className="page-title">Methodology</h1>
      <p className="page-lede">
        A rare disease is researched differently from a common one. The trial
        record is thin, patient communities carry real signal years before the
        literature does, and the diagnostic criteria themselves have changed
        three times in forty years. This is the methodology the index runs on —
        enforced in its schema, not just described in prose.
      </p>

      <h2>1. Five source strata</h2>
      <p>
        Every source enters under exactly one stratum, and every record attests
        its evidence per stratum. The strata are never collapsed into a single
        evidence score.
      </p>
      <ul>
        <li>
          <strong>Clinical</strong> — peer-reviewed articles, trials,
          guidelines, consensus statements, and mechanistic studies.
        </li>
        <li>
          <strong>Community</strong> — venue-level patterns from forums,
          support groups, and patient organizations. Indexed at venue level
          only; no individual poster, handle, or verbatim post enters the
          corpus.
        </li>
        <li>
          <strong>Historical</strong> — pre-nosology case reports,
          contemporaneous accounts, archival records, and documented folk
          practice.
        </li>
        <li>
          <strong>Registry</strong> — patient registries, trial registrations,
          and rare-disease reference rails (Orphanet, GARD, ClinicalTrials.gov).
        </li>
        <li>
          <strong>Gray literature</strong> — preprints, theses, conference
          abstracts, and working papers ahead of peer review.
        </li>
      </ul>

      <h2>2. Per-stratum evidence tiers</h2>
      <p>
        A randomized trial and a recurring forum pattern are both real evidence;
        they are not the same kind of real. Each stratum defines its own tier
        ladder — systematic review down to case report in the clinical stratum,
        structured patient survey down to individual account in the community
        stratum, primary historical document down to folk tradition in the
        historical stratum. The schema rejects attestations whose tier does not
        belong to their stratum.
      </p>

      <h2>3. Cross-stratum corroboration</h2>
      <p>
        When a record&apos;s evidence spans more than one stratum, it must
        declare a corroboration state: <strong>convergent</strong> (independent
        strata agree), <strong>contested</strong> (strata disagree), or{" "}
        <strong>refuted</strong>. Single-stratum records cannot claim
        corroboration. Disagreement between strata is publishable signal — the
        lidocaine record is the model: decades of community reports, then
        structured surveys, then a randomized trial.
      </p>

      <h2>4. Diagnostic-era tagging</h2>
      <p>
        The meaning of &ldquo;EDS&rdquo; changed with each nosology — Berlin
        1988 expanded it to eleven types, Villefranche 1997 consolidated to six,
        and the 2017 International Classification defines thirteen and created
        HSD as the residual category. Every record carries the criteria era its
        sources worked under, so pre-2017 cohorts are never silently read as
        modern hEDS.
      </p>

      <h2>5. Subtype scoping</h2>
      <p>
        Every record declares its subtype scope. hEDS findings are never
        silently generalized to vEDS or other monogenic types — the conditions
        share a name and differ in mechanism, risk, and management. Records
        scoped to all types say so explicitly.
      </p>

      <h2>6. Epistemic status</h2>
      <ul>
        <li>
          <strong>Established</strong> — attested at consensus strength
          (guideline, consensus statement, review, trial, or cohort) in the
          clinical stratum, or by registry authority for program records.
        </li>
        <li>
          <strong>Probable</strong> — supported by sub-consensus clinical or
          registry evidence.
        </li>
        <li>
          <strong>Emerging</strong> — new and not yet replicated; always carries
          a reassessment date.
        </li>
        <li>
          <strong>Contested</strong> — strata or studies disagree; always
          carries a reassessment date.
        </li>
        <li>
          <strong>Community signal</strong> — real as community evidence, not
          yet clinically earned; always carries a reassessment date.
        </li>
        <li>
          <strong>Historical record</strong> — documented history; presence
          records provenance, never efficacy.
        </li>
        <li>
          <strong>Refuted</strong> — contradicted by stronger evidence; kept
          visible rather than deleted.
        </li>
      </ul>

      <h2>7. Review lifecycle</h2>
      <p>
        Every record carries a <code>reviewed_at</code> date. Emerging,
        contested, and community-signal records are inadmissible without a{" "}
        <code>reassess_by</code> date — undated emerging claims do not enter the
        corpus. Reassessment cadences are set by the publication policy:
        emerging {policy.reassessment_days.emerging} days, contested{" "}
        {policy.reassessment_days.contested} days, community signal{" "}
        {policy.reassessment_days.community_signal} days, established{" "}
        {policy.reassessment_days.established} days.
      </p>

      <h2>8. Publication policy</h2>
      <p>
        What may enter the corpus and under what review, verbatim from the
        published policy file:
      </p>
      <ul>
        {policy.rules.map((rule) => (
          <li key={rule.id}>{rule.text}</li>
        ))}
      </ul>
      <p>
        Auto-publishable admissions are bibliographic only (
        {policy.auto_publishable
          .map(({ stratum, media_type }) => `${stratum} ${media_type}`)
          .join("; ")}
        ). Everything else requires review:{" "}
        {policy.review_required
          .map(({ stratum }) => stratum)
          .filter((value, index, array) => array.indexOf(value) === index)
          .join(", ")}
        -stratum material at claim level, and all community and historical
        material without exception.
      </p>

      <h2>9. Discovery monitors and the run ledger</h2>
      <p>
        The index is a living program, not a one-time article. Declared
        monitors watch PubMed, ClinicalTrials.gov, society feeds, preprint
        servers, guideline bodies, community venues, and historical archives on
        fixed cadences. Every intake pass is logged in an append-only run
        ledger — admitted sources, admitted records, and rejected candidates
        with reasons. Corrections append; nothing rewrites history.
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
