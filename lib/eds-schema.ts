import { z } from "zod";

export const EDS_CORPUS_SCHEMA_VERSION = "eds-research/corpus/v1" as const;

/*
 * Source strata.
 *
 * Rare-disease knowledge does not live in one place. Peer-reviewed literature
 * is sparse and lags practice; patient communities accumulate dense
 * lived-experience signal before clinicians study it; the historical record
 * holds both the disease's nosology and pre-diagnostic folk management.
 *
 * Every source belongs to exactly one stratum. Every record attests its
 * evidence per stratum, and records may carry attestations from several
 * strata at once — that convergence is the point of the index.
 */
export const sourceStrata = [
  "clinical",
  "community",
  "historical",
  "registry",
  "gray",
] as const;

export type SourceStratum = (typeof sourceStrata)[number];

/*
 * Evidence tiers are stratum-specific. A randomized trial and a recurring
 * forum pattern are both real evidence; they are not the same kind of real.
 */
export const evidenceTiers = {
  clinical: [
    "systematic-review",
    "meta-analysis",
    "randomized-trial",
    "cohort-study",
    "case-control",
    "case-series",
    "case-report",
    "clinical-guideline",
    "consensus-statement",
    "expert-review",
    "mechanistic-study",
  ],
  community: [
    "structured-patient-survey",
    "patient-org-synthesis",
    "cross-venue-pattern",
    "single-venue-pattern",
    "individual-account",
  ],
  historical: [
    "primary-historical-document",
    "contemporaneous-clinical-account",
    "archival-record",
    "retrospective-account",
    "folk-tradition",
  ],
  registry: [
    "registry-analysis",
    "registry-report",
    "trial-registration",
    "genotype-database-record",
  ],
  gray: [
    "preprint",
    "conference-abstract",
    "doctoral-thesis",
    "working-paper",
  ],
} as const satisfies Record<SourceStratum, readonly string[]>;

export type EvidenceTier<S extends SourceStratum = SourceStratum> =
  (typeof evidenceTiers)[S][number];

const allEvidenceTiers = new Set<string>(
  Object.values(evidenceTiers).flat(),
);

export function evidenceTierBelongsToStratum(
  stratum: SourceStratum,
  tier: string,
): boolean {
  return (evidenceTiers[stratum] as readonly string[]).includes(tier);
}

/*
 * Diagnostic criteria era. The meaning of "EDS" changed with each nosology:
 * a 1975 cohort and a 2020 hEDS cohort are not the same population. Records
 * carry the era their sources worked under so old claims are never silently
 * read as modern ones.
 */
export const criteriaEras = [
  "pre-nosology",
  "berlin-1988",
  "villefranche-1997",
  "international-2017",
  "era-independent",
] as const;

export type CriteriaEra = (typeof criteriaEras)[number];

/*
 * Epistemic status. `community-signal` and `historical-record` are
 * deliberately not gradations of clinical truth: they name evidence that is
 * real in its own stratum and has not (yet) earned a clinical one.
 */
export const recordStatuses = [
  "established",
  "probable",
  "emerging",
  "contested",
  "community-signal",
  "historical-record",
  "refuted",
] as const;

export type RecordStatus = (typeof recordStatuses)[number];

/*
 * Cross-stratum corroboration. Required whenever a record's evidence spans
 * more than one stratum. `convergent` marks independent strata agreeing —
 * the pattern a rare-disease index exists to surface, e.g. local-anesthetic
 * resistance reported by patients for decades before trial confirmation.
 */
export const corroborationStates = [
  "convergent",
  "contested",
  "refuted",
] as const;

export type CorroborationState = (typeof corroborationStates)[number];

/* The 2017 International Classification subtypes, plus HSD and catch-alls. */
export const subtypeIds = [
  "heds",
  "ceds",
  "cleds",
  "cveds",
  "veds",
  "aeds",
  "deds",
  "keds",
  "bcs",
  "speds",
  "mceds",
  "meds",
  "peds",
  "hsd",
  "all-eds",
  "unspecified",
] as const;

export type SubtypeId = (typeof subtypeIds)[number];

export const recordKinds = [
  "finding",
  "practice",
  "event",
  "signal",
  "program",
] as const;

export type RecordKind = (typeof recordKinds)[number];

export const practiceKinds = [
  "physical-therapy",
  "manual-therapy",
  "medication",
  "procedural",
  "device-aid",
  "diet-nutrition",
  "lifestyle-self-management",
  "psychological",
  "folk-practice",
] as const;

export type PracticeKind = (typeof practiceKinds)[number];

export const riskLevels = ["low", "caution", "significant", "severe"] as const;

export type RiskLevel = (typeof riskLevels)[number];

function isRealPartialDate(value: string): boolean {
  const match =
    /^(-?\d{4})(?:-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?)?$/u.exec(value);
  if (match === null) return false;
  if (match[2] === undefined || match[3] === undefined) return true;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const PartialDateSchema = z.string().refine(
  isRealPartialDate,
  "Date must be a real calendar date using YYYY, YYYY-MM, or YYYY-MM-DD",
);

export const IsoDaySchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/u)
  .refine(isRealPartialDate, "Must be a real calendar date");

export const HttpsUrlSchema = z
  .string()
  .max(2_048)
  .url()
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.username === "" && url.password === "";
    } catch {
      return false;
    }
  }, "Source URL must use HTTPS without embedded credentials");

export const CompactTextSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine((value) => !/[\r\n]/u.test(value), "Text must fit on one line");

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u)
  .max(120);

export const SourceIdSchema = z.string().regex(/^source-[a-f0-9]{20}$/u);

export const VenueIdSchema = z
  .string()
  .regex(/^venue-[a-z0-9]+(?:-[a-z0-9]+)*$/u)
  .max(80);

const LabelValueSchema = z.strictObject({
  label: CompactTextSchema.max(100),
  value: CompactTextSchema.max(240),
});

/*
 * One attestation: a stratum, a tier within that stratum, and the canonical
 * sources backing it. A record's evidence array is the cross-strata index.
 */
export const EvidenceAttestationSchema = z.strictObject({
  stratum: z.enum(sourceStrata),
  tier: z.string().refine((tier) => allEvidenceTiers.has(tier), {
    message: "Evidence tier must be defined for some stratum",
  }),
  source_ids: z.array(SourceIdSchema).min(1).max(24),
  note: CompactTextSchema.max(300).optional(),
}).superRefine((attestation, context) => {
  if (!evidenceTierBelongsToStratum(attestation.stratum, attestation.tier)) {
    context.addIssue({
      code: "custom",
      message: `Tier "${attestation.tier}" does not belong to stratum "${attestation.stratum}"`,
      path: ["tier"],
    });
  }
});

export type EvidenceAttestation = z.infer<typeof EvidenceAttestationSchema>;

const clinicalConsensusTiers = new Set<string>([
  "systematic-review",
  "meta-analysis",
  "randomized-trial",
  "cohort-study",
  "case-control",
  "case-series",
  "clinical-guideline",
  "consensus-statement",
]);

export const EdsRecordSchema = z
  .strictObject({
    id: SlugSchema,
    kind: z.enum(recordKinds),
    title: CompactTextSchema.max(160),
    summary: z.string().trim().min(1).max(2_000),
    date: PartialDateSchema.optional(),
    date_precision: z
      .enum(["day", "month", "year", "decade", "century"])
      .optional(),
    subtypes: z.array(z.enum(subtypeIds)).min(1).max(subtypeIds.length),
    status: z.enum(recordStatuses),
    criteria_era: z.enum(criteriaEras),
    evidence: z.array(EvidenceAttestationSchema).min(1).max(8),
    corroboration: z.enum(corroborationStates).optional(),
    risk: z
      .strictObject({
        level: z.enum(riskLevels),
        note: CompactTextSchema.max(300),
      })
      .optional(),
    venues: z.array(VenueIdSchema).max(24).optional(),
    practice_kind: z.enum(practiceKinds).optional(),
    reviewed_at: IsoDaySchema,
    reassess_by: IsoDaySchema.optional(),
    details: z.array(LabelValueSchema).max(16).optional(),
    tags: z.array(SlugSchema).max(16).optional(),
    people: z.array(CompactTextSchema.max(120)).max(24).optional(),
    organizations: z.array(CompactTextSchema.max(120)).max(24).optional(),
  })
  .superRefine((record, context) => {
    const strataUsed = new Set(record.evidence.map(({ stratum }) => stratum));

    if (record.kind === "event" && record.date === undefined) {
      context.addIssue({
        code: "custom",
        message: "Events require a date",
        path: ["date"],
      });
    }
    if (record.kind === "practice" && record.practice_kind === undefined) {
      context.addIssue({
        code: "custom",
        message: "Practices require practice_kind",
        path: ["practice_kind"],
      });
    }
    if (
      record.kind === "signal" &&
      (record.venues === undefined || record.venues.length === 0)
    ) {
      context.addIssue({
        code: "custom",
        message: "Community signals require at least one venue",
        path: ["venues"],
      });
    }
    if (record.kind === "signal" && !strataUsed.has("community")) {
      context.addIssue({
        code: "custom",
        message: "Community signals require a community attestation",
        path: ["evidence"],
      });
    }

    if (strataUsed.size > 1 && record.corroboration === undefined) {
      context.addIssue({
        code: "custom",
        message:
          "Records attested by multiple strata require a corroboration state",
        path: ["corroboration"],
      });
    }
    if (strataUsed.size === 1 && record.corroboration !== undefined) {
      context.addIssue({
        code: "custom",
        message: "Corroboration applies only to multi-stratum evidence",
        path: ["corroboration"],
      });
    }

    if (record.status === "established") {
      const hasClinicalConsensus = record.evidence.some(
        ({ stratum, tier }) =>
          stratum === "clinical" && clinicalConsensusTiers.has(tier),
      );
      const hasRegistryAuthority =
        record.kind === "program" &&
        record.evidence.some(({ stratum }) => stratum === "registry");
      if (!hasClinicalConsensus && !hasRegistryAuthority) {
        context.addIssue({
          code: "custom",
          message:
            "Status established requires clinical attestation at consensus strength (guideline, consensus statement, review, trial, or cohort); programs may instead attest a registry record",
          path: ["status"],
        });
      }
    }
    if (record.status === "community-signal" && !strataUsed.has("community")) {
      context.addIssue({
        code: "custom",
        message: "community-signal status requires community evidence",
        path: ["status"],
      });
    }
    if (record.status === "historical-record" && !strataUsed.has("historical")) {
      context.addIssue({
        code: "custom",
        message: "historical-record status requires historical evidence",
        path: ["status"],
      });
    }
    if (record.status === "refuted" && record.corroboration === "convergent") {
      context.addIssue({
        code: "custom",
        message: "A refuted record cannot also be marked convergent",
        path: ["status"],
      });
    }

    if (
      ["emerging", "contested", "community-signal"].includes(record.status) &&
      record.reassess_by === undefined
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Emerging, contested, and community-signal records require reassess_by",
        path: ["reassess_by"],
      });
    }

    if (
      record.subtypes.includes("all-eds") &&
      record.subtypes.length > 1 &&
      !record.subtypes.includes("unspecified")
    ) {
      context.addIssue({
        code: "custom",
        message: "all-eds cannot be combined with specific subtypes",
        path: ["subtypes"],
      });
    }

    if (record.risk !== undefined && record.kind !== "practice") {
      context.addIssue({
        code: "custom",
        message: "Risk annotations apply to practices",
        path: ["risk"],
      });
    }
  });

export type EdsRecord = z.infer<typeof EdsRecordSchema>;

export const EdsCategorySchema = z.strictObject({
  id: SlugSchema,
  label: CompactTextSchema.max(80),
  description: CompactTextSchema.max(400),
  order: z.number().int().min(1).max(99),
});

export type EdsCategory = z.infer<typeof EdsCategorySchema>;

export const EdsFileSchema = z
  .strictObject({
    schema: z.literal(EDS_CORPUS_SCHEMA_VERSION),
    category: EdsCategorySchema,
    records: z.array(EdsRecordSchema).min(1).max(400),
  })
  .superRefine((file, context) => {
    const ids = file.records.map(({ id }) => id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: "custom",
        message: "Record IDs must be unique within a file",
        path: ["records"],
      });
    }
  });

export type EdsFile = z.infer<typeof EdsFileSchema>;

export const SubtypeRecordSchema = z
  .strictObject({
    id: z.enum(subtypeIds),
    name: CompactTextSchema.max(120),
    abbreviation: CompactTextSchema.max(16),
    classification: z.enum(["eds-2017", "related-spectrum"]),
    inheritance: z.enum([
      "autosomal-dominant",
      "autosomal-recessive",
      "autosomal-dominant-or-recessive",
      "x-linked",
      "unknown",
      "not-applicable",
    ]),
    genes: z.array(CompactTextSchema.max(60)).max(12),
    genetic_status: z.enum([
      "confirmed-molecular-basis",
      "candidate-emerging",
      "unknown",
      "not-applicable",
    ]),
    villefranche_equivalent: CompactTextSchema.max(120).optional(),
    prevalence_display: CompactTextSchema.max(200),
    distinguishing_features: z.string().trim().min(1).max(1_500),
    summary: z.string().trim().min(1).max(1_200),
    source_ids: z.array(SourceIdSchema).min(1).max(24),
    reviewed_at: IsoDaySchema,
  })
  .superRefine((record, context) => {
    if (
      record.genetic_status === "confirmed-molecular-basis" &&
      record.genes.length === 0
    ) {
      context.addIssue({
        code: "custom",
        message: "Confirmed molecular basis requires at least one gene",
        path: ["genes"],
      });
    }
    if (record.genetic_status === "unknown" && record.genes.length > 0) {
      context.addIssue({
        code: "custom",
        message:
          "Unknown genetic status cannot list genes; use candidate-emerging",
        path: ["genes"],
      });
    }
  });

export type SubtypeRecord = z.infer<typeof SubtypeRecordSchema>;

export const SubtypeFileSchema = z.strictObject({
  schema: z.literal(EDS_CORPUS_SCHEMA_VERSION),
  subtypes: z.array(SubtypeRecordSchema).min(1).max(24),
});

export type SubtypeFile = z.infer<typeof SubtypeFileSchema>;
