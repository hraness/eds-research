# EDS Research Index

EDS Research Index is an independent index of Ehlers-Danlos syndromes research for patients and clinicians. Each record links its sources and labels the kind of evidence behind it. It is published at [hraness.com/eds](https://hraness.com/eds) as a reference, not medical advice.

## Methodology

Each kind of evidence has its own scale of evidence levels, and a record gives each source the level recorded in the source catalog. Records that cite more than one kind of evidence state how it relates: `convergent`, `single-origin` (the kinds restate one underlying study or report), `contested`, or `refuted`. Community evidence is recorded by venue, never by poster. Historical and folk practices are listed as history, not as recommendations. Every record carries a `reviewed_at` date, and emerging, contested, and community-signal records also need a `reassess_by` date.

The full methodology is on the site at [/eds/methodology](https://hraness.com/eds/methodology).

## Repository layout

- `lib/`: Zod schemas (`eds-schema`, `research-schema`), stable source identity, and the content loader with referential-integrity checks.
- `public/eds-corpus/`: the record corpus, one YAML file per category plus `subtypes.yml` (all thirteen 2017 types plus HSD).
- `public/research/`: `sources.yml`, `venues.yml`, `monitors.yml`, `runs.yml`, `questions.yml`, `collections.yml`, `publication-policy.yml`.
- `app/`: the public Next.js site (basePath `/eds`).
- `scripts/`: `source-id.ts`, `audit-eds-research.ts`, `submit-indexnow.ts`.

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
2. Resolve its DOI, PMID, or other identifier and confirm that the title, venue, and year at the link match the entry.
3. Add it to `public/research/sources.yml` sorted by ID, with its stratum and a tier belonging to that stratum.
4. Reference it from records via `source_ids`, using the catalog tier; the audit rejects unknown references and tiers that differ from the catalog.
5. Log the addition in a new run in `public/research/runs.yml`.

## Boundaries

The index describes evidence and where it comes from; it does not diagnose, recommend, or discourage any course of care. Community evidence is filed as patient reports. Historical and folk records describe what was done, not what works.

The EDS Research Index is built on a design several Hraness projects share: each record links its sources and labels the kind of evidence, so what the index says can be checked against where it came from. [The thread through hraness](https://hraness.com/writing/the-thread-through-hraness) follows that design across the projects.
