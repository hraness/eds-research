# EDS Research Index

An independent, open-source research index for the Ehlers-Danlos syndromes, published at [hraness.com/eds](https://hraness.com/eds).

The index treats rare-disease knowledge as what it is: spread across peer-reviewed literature, patient registries, community venues, preprints, and four centuries of historical record. Every record names its sources, its stratum, its evidence tier, its subtype scope, and the diagnostic-criteria era its evidence worked under.

## The methodology in one paragraph

Sources are filed under five strata — **clinical**, **community**, **historical**, **registry**, **gray literature** — each with its own evidence-tier ladder. Records attested by multiple strata must declare a corroboration state (`convergent`, `contested`, `refuted`). Community evidence is indexed at venue level only — patterns, never posters. Historical and folk practices are documented as history, never as endorsement. Every record carries a `reviewed_at` date; emerging, contested, and community-signal records cannot enter the corpus without a `reassess_by` date.

The full methodology is on the site at [/eds/methodology](https://hraness.com/eds/methodology).

## Repository layout

- `lib/` — Zod schemas (`eds-schema`, `research-schema`), stable source identity, and the content loader with referential-integrity checks.
- `public/eds/` — the record corpus: one YAML file per category plus `subtypes.yml` (all thirteen 2017 types plus HSD).
- `public/research/` — `sources.yml`, `venues.yml`, `monitors.yml`, `runs.yml`, `questions.yml`, `collections.yml`, `publication-policy.yml`.
- `app/` — the public Next.js site (basePath `/eds`).
- `scripts/` — `source-id.ts`, `audit-eds-research.ts`, `submit-indexnow.ts`.

## Commands

```sh
bun install
bun run dev        # local development
bun run check      # research:audit + typecheck + lint + test
bun run build      # production build (all static)
bun run research:audit        # corpus integrity and coverage report
bun run research:source-id    # stable source ID for a URL
```

## Adding a source

1. Compute its ID: `bun run research:source-id -- <url> [published-at]`.
2. Add it to `public/research/sources.yml` sorted by ID, with stratum and a tier belonging to that stratum.
3. Reference it from records via `source_ids`; the audit rejects unknown or stratum-mismatched references.

## Boundaries

Not medical advice. The index documents evidence and provenance; it does not diagnose, recommend, or discourage any course of care. Community evidence is filed as reports, not proof. Historical and folk records document what was done, not what works.
