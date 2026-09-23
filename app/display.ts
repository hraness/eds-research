import type {
  CorroborationState,
  CriteriaEra,
  PracticeKind,
  RecordKind,
  RecordStatus,
  RiskLevel,
  SourceStratum,
  SubtypeId,
  SubtypeRecord,
} from "@/lib/eds-schema";

export const STATUS_LABELS: Record<RecordStatus, string> = {
  established: "established",
  probable: "probable",
  emerging: "emerging",
  contested: "contested",
  "community-signal": "community signal",
  "historical-record": "historical record",
  refuted: "refuted",
};

export const STRATUM_LABELS: Record<SourceStratum, string> = {
  clinical: "clinical",
  community: "community",
  historical: "historical",
  registry: "registry",
  gray: "gray literature",
};

export const KIND_LABELS: Record<RecordKind, string> = {
  finding: "finding",
  practice: "practice",
  event: "event",
  signal: "patient-reported pattern",
  program: "research program",
};

export const PRACTICE_KIND_LABELS: Record<PracticeKind, string> = {
  "physical-therapy": "Physical therapy",
  "manual-therapy": "Manual therapy",
  medication: "Medication",
  procedural: "Procedures",
  "device-aid": "Devices and aids",
  "diet-nutrition": "Diet and nutrition",
  "lifestyle-self-management": "Lifestyle and self-management",
  psychological: "Psychological support",
  "folk-practice": "Folk practice",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "low risk",
  caution: "caution",
  significant: "significant risk",
  severe: "severe risk",
};

export const CORROBORATION_LABELS: Record<CorroborationState, string> = {
  convergent: "independent evidence agrees",
  "single-origin": "one underlying source",
  contested: "sources disagree",
  refuted: "refuted",
};

export const CRITERIA_ERA_LABELS: Record<CriteriaEra, string> = {
  "pre-nosology": "Before formal classification",
  "berlin-1988": "Berlin nosology (1988)",
  "villefranche-1997": "Villefranche nosology (1997)",
  "international-2017": "2017 International Classification",
  "era-independent": "Applies to all eras",
};

export const GENETIC_STATUS_LABELS: Record<SubtypeRecord["genetic_status"], string> = {
  "confirmed-molecular-basis": "confirmed genes",
  "candidate-emerging": "candidate gene, not confirmed",
  unknown: "no known gene",
  "not-applicable": "not applicable",
};

export const INHERITANCE_LABELS: Record<SubtypeRecord["inheritance"], string> = {
  "autosomal-dominant": "autosomal dominant",
  "autosomal-recessive": "autosomal recessive",
  "autosomal-dominant-or-recessive": "autosomal dominant or recessive",
  "x-linked": "X-linked",
  unknown: "unknown",
  "not-applicable": "not applicable",
};

export const SUBTYPE_LABELS: Record<SubtypeId, string> = {
  heds: "hEDS",
  ceds: "cEDS",
  cleds: "clEDS",
  cveds: "cvEDS",
  veds: "vEDS",
  aeds: "aEDS",
  deds: "dEDS",
  keds: "kEDS",
  bcs: "BCS",
  speds: "spEDS",
  mceds: "mcEDS",
  meds: "mEDS",
  peds: "pEDS",
  hsd: "HSD",
  "all-eds": "all EDS types",
  unspecified: "unspecified",
};

export const TIER_LABELS: Record<string, string> = {
  "systematic-review": "systematic review",
  "meta-analysis": "meta-analysis",
  "randomized-trial": "randomized trial",
  "cohort-study": "cohort study",
  "case-control": "case-control study",
  "cross-sectional-study": "cross-sectional study",
  "case-series": "case series",
  "case-report": "case report",
  "qualitative-study": "qualitative study",
  "clinical-guideline": "clinical guideline",
  "consensus-statement": "consensus statement",
  "expert-review": "expert review",
  "mechanistic-study": "mechanistic study",
  "structured-patient-survey": "structured patient survey",
  "patient-org-synthesis": "patient-organization synthesis",
  "cross-venue-pattern": "cross-venue pattern",
  "single-venue-pattern": "single-venue pattern",
  "individual-account": "individual account",
  "primary-historical-document": "primary historical document",
  "contemporaneous-clinical-account": "contemporaneous account",
  "archival-record": "archival record",
  "retrospective-account": "retrospective account",
  "folk-tradition": "folk tradition",
  "registry-analysis": "registry analysis",
  "registry-report": "registry report",
  "trial-registration": "trial registration",
  "genotype-database-record": "genotype database record",
  preprint: "preprint",
  "conference-abstract": "conference abstract",
  "doctoral-thesis": "doctoral thesis",
  "working-paper": "working paper",
};

export function displayTier(tier: string): string {
  return TIER_LABELS[tier] ?? tier.replaceAll("-", " ");
}

/*
 * A readable date for a partial date. Decades and centuries round down to
 * their first year ("1883" at decade precision is "1880s"); BC years drop
 * the zero padding ("-0400" is "c. 400 BC").
 */
export function displayDate(
  date: string | undefined,
  precision: string | undefined,
): string {
  if (date === undefined) return "undated";
  const year = Number.parseInt(date.slice(0, date.startsWith("-") ? 5 : 4), 10);
  if (year < 0) return `c. ${-year} BC`;
  switch (precision) {
    case "decade":
      return `${Math.floor(year / 10) * 10}s`;
    case "century":
      return `${Math.floor(year / 100) * 100}s`;
    default:
      return date;
  }
}

/*
 * A page description made from record text. It uses the first sentence when
 * that fits, otherwise as many whole sentences as fit, and only cuts at a word
 * boundary when the first sentence alone is too long. It never ends mid-word
 * and never adds an ellipsis.
 */
export function describe(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/gu, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const sentences = normalized.split(/(?<=[.!?][”"’)]?)\s+(?=[A-Z0-9“"(])/u);
  let description = "";
  for (const sentence of sentences) {
    const next = description === "" ? sentence : `${description} ${sentence}`;
    if (next.length > maxLength) break;
    description = next;
  }
  if (description !== "") return description;
  const words = normalized.slice(0, maxLength + 1).split(" ");
  words.pop();
  return words.join(" ").replace(/[,;:(]+$/u, "");
}
