import type {
  CorroborationState,
  PracticeKind,
  RecordKind,
  RecordStatus,
  RiskLevel,
  SourceStratum,
  SubtypeId,
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
  signal: "community signal",
  program: "research program",
};

export const PRACTICE_KIND_LABELS: Record<PracticeKind, string> = {
  "physical-therapy": "physical therapy",
  "manual-therapy": "manual therapy",
  medication: "medication",
  procedural: "procedural",
  "device-aid": "device / aid",
  "diet-nutrition": "diet & nutrition",
  "lifestyle-self-management": "lifestyle & self-management",
  psychological: "psychological",
  "folk-practice": "folk practice",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "low risk",
  caution: "caution",
  significant: "significant risk",
  severe: "severe risk",
};

export const CORROBORATION_LABELS: Record<CorroborationState, string> = {
  convergent: "strata converge",
  contested: "strata disagree",
  refuted: "refuted across strata",
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
  "case-series": "case series",
  "case-report": "case report",
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

export function displayDate(
  date: string | undefined,
  precision: string | undefined,
): string {
  if (date === undefined) return "undated";
  if (date.startsWith("-")) return `c. ${date.slice(1)} BC`;
  switch (precision) {
    case "day":
      return date;
    case "month":
      return date;
    case "decade":
      return `${date}s`;
    case "century":
      return `${Math.floor(Number(date) / 100) + 1}00s`;
    default:
      return date;
  }
}
