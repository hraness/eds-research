import { z } from "zod";

import {
  CompactTextSchema,
  evidenceTiers,
  HttpsUrlSchema,
  IsoDaySchema,
  PartialDateSchema,
  SlugSchema,
  SourceIdSchema,
  sourceStrata,
  VenueIdSchema,
  evidenceTierBelongsToStratum,
} from "./eds-schema";
import {
  canonicalResearchSourceIdentity,
  stableResearchSourceId,
} from "./source-identity";

export const EDS_SOURCE_CATALOG_SCHEMA_VERSION =
  "eds-research/sources/v1" as const;
export const EDS_VENUES_SCHEMA_VERSION = "eds-research/venues/v1" as const;
export const EDS_MONITORS_SCHEMA_VERSION = "eds-research/monitors/v1" as const;
export const EDS_RUNS_SCHEMA_VERSION = "eds-research/runs/v1" as const;
export const EDS_QUESTIONS_SCHEMA_VERSION =
  "eds-research/questions/v1" as const;
export const EDS_COLLECTIONS_SCHEMA_VERSION =
  "eds-research/collections/v1" as const;
export const EDS_PUBLICATION_POLICY_SCHEMA_VERSION =
  "eds-research/publication-policy/v1" as const;

const allTiers = new Set<string>(Object.values(evidenceTiers).flat());

/*
 * The canonical source catalog. Sources carry their stratum and tier at
 * admission so records can attest evidence without re-deriving epistemics.
 * Community sources identify venues, never individuals.
 */
export const ResearchSourceSchema = z
  .strictObject({
    id: SourceIdSchema,
    stratum: z.enum(sourceStrata),
    tier: z.string().refine((tier) => allTiers.has(tier), {
      message: "Tier must be defined for some stratum",
    }),
    media_type: z.enum([
      "journal-article",
      "guideline",
      "book-chapter",
      "archival-document",
      "preprint",
      "conference-abstract",
      "registry-entry",
      "trial-record",
      "survey-report",
      "forum-venue",
      "patient-org-page",
      "reporting",
      "webpage",
      "dataset",
    ]),
    publisher: CompactTextSchema.max(160),
    title: CompactTextSchema.max(400),
    url: HttpsUrlSchema,
    published_at: PartialDateSchema.optional(),
    retrieved_at: IsoDaySchema.optional(),
    venue_id: VenueIdSchema.optional(),
    native_id: CompactTextSchema.max(160).optional(),
    access: z.enum(["public", "registration", "membership", "paywalled", "archived"]),
    language: z
      .string()
      .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/u)
      .optional(),
    note: CompactTextSchema.max(300).optional(),
  })
  .superRefine((source, context) => {
    if (!evidenceTierBelongsToStratum(source.stratum, source.tier)) {
      context.addIssue({
        code: "custom",
        message: `Tier "${source.tier}" does not belong to stratum "${source.stratum}"`,
        path: ["tier"],
      });
    }
    if (source.stratum === "community" && source.venue_id === undefined) {
      context.addIssue({
        code: "custom",
        message: "Community sources must name a venue, never an individual",
        path: ["venue_id"],
      });
    }
    if (source.stratum !== "community" && source.venue_id !== undefined) {
      context.addIssue({
        code: "custom",
        message: "Only community sources carry venue_id",
        path: ["venue_id"],
      });
    }
  });

export type ResearchSource = z.infer<typeof ResearchSourceSchema>;

export const ResearchSourceCatalogSchema = z
  .strictObject({
    schema: z.literal(EDS_SOURCE_CATALOG_SCHEMA_VERSION),
    sources: z.array(ResearchSourceSchema).min(1).max(2_000),
  })
  .superRefine((catalog, context) => {
    const ids = catalog.sources.map(({ id }) => id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: "custom",
        message: "Source IDs must be unique",
        path: ["sources"],
      });
    }
    const canonicalIdentities = new Map<string, string>();
    const nativeIdentities = new Map<string, string>();
    for (const [index, source] of catalog.sources.entries()) {
      const expectedId = stableResearchSourceId(source.url, source.published_at);
      if (source.id !== expectedId) {
        context.addIssue({
          code: "custom",
          message: `Source ID must equal ${expectedId}`,
          path: ["sources", index, "id"],
        });
      }
      const identity = canonicalResearchSourceIdentity(source.url, source.published_at);
      const duplicateId = canonicalIdentities.get(identity);
      if (duplicateId !== undefined) {
        context.addIssue({
          code: "custom",
          message: `Source is canonical-equivalent to ${duplicateId}`,
          path: ["sources", index, "url"],
        });
      } else {
        canonicalIdentities.set(identity, source.id);
      }
      if (source.native_id !== undefined) {
        const nativeIdentity = `${source.media_type}:${source.native_id}`;
        const nativeDuplicateId = nativeIdentities.get(nativeIdentity);
        if (nativeDuplicateId !== undefined) {
          context.addIssue({
            code: "custom",
            message: `Native source identity is already used by ${nativeDuplicateId}`,
            path: ["sources", index, "native_id"],
          });
        } else {
          nativeIdentities.set(nativeIdentity, source.id);
        }
      }
    }
    for (let index = 1; index < catalog.sources.length; index += 1) {
      const previous = catalog.sources[index - 1];
      const current = catalog.sources[index];
      if (previous !== undefined && current !== undefined && previous.id > current.id) {
        context.addIssue({
          code: "custom",
          message: "Sources must be ordered by stable ID",
          path: ["sources", index, "id"],
        });
      }
    }
  });

export type ResearchSourceCatalog = z.infer<typeof ResearchSourceCatalogSchema>;

/*
 * Community venues are indexed as venues — with access level, moderation
 * model, and reporting rules — never as scraped threads or named posters.
 */
export const CommunityVenueSchema = z.strictObject({
  id: VenueIdSchema,
  name: CompactTextSchema.max(120),
  kind: z.enum([
    "forum",
    "subreddit",
    "social-group",
    "chat-community",
    "patient-org",
    "registry",
    "survey-platform",
  ]),
  host: CompactTextSchema.max(120),
  url: HttpsUrlSchema,
  access: z.enum(["public", "registration", "membership", "closed"]),
  scale_display: CompactTextSchema.max(80).optional(),
  moderation: z.enum(["professional", "volunteer", "light", "unmoderated"]),
  note: CompactTextSchema.max(300).optional(),
});

export type CommunityVenue = z.infer<typeof CommunityVenueSchema>;

export const CommunityVenueCatalogSchema = z.strictObject({
  schema: z.literal(EDS_VENUES_SCHEMA_VERSION),
  venues: z.array(CommunityVenueSchema).min(1).max(200),
});

export type CommunityVenueCatalog = z.infer<typeof CommunityVenueCatalogSchema>;

/*
 * Discovery monitors: bounded, declared inputs the research program watches.
 * Each monitor names the strata it feeds and the cadence it runs on.
 */
export const ResearchMonitorSchema = z.strictObject({
  id: SlugSchema,
  label: CompactTextSchema.max(120),
  kind: z.enum([
    "literature-query",
    "trial-registry",
    "guideline-watch",
    "registry-watch",
    "preprint-watch",
    "venue-scan",
    "org-feed",
  ]),
  strata: z.array(z.enum(sourceStrata)).min(1).max(sourceStrata.length),
  target: CompactTextSchema.max(400),
  cadence_days: z.number().int().min(1).max(365),
  purpose: CompactTextSchema.max(300),
  last_checked: IsoDaySchema.optional(),
  active: z.boolean(),
});

export type ResearchMonitor = z.infer<typeof ResearchMonitorSchema>;

export const ResearchMonitorCatalogSchema = z.strictObject({
  schema: z.literal(EDS_MONITORS_SCHEMA_VERSION),
  monitors: z.array(ResearchMonitorSchema).min(1).max(100),
});

export type ResearchMonitorCatalog = z.infer<typeof ResearchMonitorCatalogSchema>;

/* Append-only research run ledger. */
export const ResearchRunSchema = z.strictObject({
  id: z.string().regex(/^run-\d{4}-\d{2}-\d{2}-[a-z0-9]+$/u).max(60),
  date: IsoDaySchema,
  scope: CompactTextSchema.max(300),
  strata: z.array(z.enum(sourceStrata)).min(1).max(sourceStrata.length),
  monitors_used: z.array(SlugSchema).max(100).optional(),
  admitted_source_ids: z.array(SourceIdSchema).max(500).optional(),
  admitted_record_ids: z.array(SlugSchema).max(500).optional(),
  rejected: z
    .array(
      z.strictObject({
        candidate: CompactTextSchema.max(200),
        reason: CompactTextSchema.max(300),
      }),
    )
    .max(100)
    .optional(),
  notes: CompactTextSchema.max(500).optional(),
});

export type ResearchRun = z.infer<typeof ResearchRunSchema>;

export const ResearchRunLedgerSchema = z.strictObject({
  schema: z.literal(EDS_RUNS_SCHEMA_VERSION),
  runs: z.array(ResearchRunSchema).max(2_000),
});

export type ResearchRunLedger = z.infer<typeof ResearchRunLedgerSchema>;

/* Open and contested questions the index is tracking. */
export const OpenQuestionSchema = z.strictObject({
  id: SlugSchema,
  question: CompactTextSchema.max(300),
  why_open: CompactTextSchema.max(400),
  status: z.enum(["open", "watching", "partially-answered"]),
  strata_sought: z.array(z.enum(sourceStrata)).min(1).max(sourceStrata.length),
  related_source_ids: z.array(SourceIdSchema).max(24).optional(),
  opened_at: IsoDaySchema,
  last_reviewed: IsoDaySchema,
});

export type OpenQuestion = z.infer<typeof OpenQuestionSchema>;

export const OpenQuestionLedgerSchema = z.strictObject({
  schema: z.literal(EDS_QUESTIONS_SCHEMA_VERSION),
  questions: z.array(OpenQuestionSchema).min(1).max(200),
});

export type OpenQuestionLedger = z.infer<typeof OpenQuestionLedgerSchema>;

export const ResearchCollectionSchema = z.strictObject({
  id: SlugSchema,
  label: CompactTextSchema.max(120),
  description: CompactTextSchema.max(400),
  record_ids: z.array(SlugSchema).max(500),
});

export type ResearchCollection = z.infer<typeof ResearchCollectionSchema>;

export const ResearchCollectionCatalogSchema = z.strictObject({
  schema: z.literal(EDS_COLLECTIONS_SCHEMA_VERSION),
  collections: z.array(ResearchCollectionSchema).max(100),
});

export type ResearchCollectionCatalog = z.infer<
  typeof ResearchCollectionCatalogSchema
>;

/*
 * The publication policy: what may enter the corpus under what review.
 * Community and historical material always requires human review; nothing
 * auto-publishes a health claim.
 */
export const PublicationPolicySchema = z.strictObject({
  schema: z.literal(EDS_PUBLICATION_POLICY_SCHEMA_VERSION),
  auto_publishable: z
    .array(
      z.strictObject({
        stratum: z.enum(sourceStrata),
        media_type: CompactTextSchema.max(60),
        condition: CompactTextSchema.max(300),
      }),
    )
    .max(50),
  review_required: z
    .array(
      z.strictObject({
        stratum: z.enum(sourceStrata),
        scope: CompactTextSchema.max(300),
      }),
    )
    .max(50),
  rules: z
    .array(
      z.strictObject({
        id: SlugSchema,
        text: CompactTextSchema.max(500),
      }),
    )
    .min(1)
    .max(100),
  reassessment_days: z
    .strictObject({
      emerging: z.number().int().min(7).max(365),
      contested: z.number().int().min(7).max(365),
      community_signal: z.number().int().min(7).max(365),
      established: z.number().int().min(30).max(730),
    }),
});

export type PublicationPolicy = z.infer<typeof PublicationPolicySchema>;
