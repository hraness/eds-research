# EDS Research Index

> 🧬 EDS Research Index collects Ehlers-Danlos syndromes research record by
> record. Each entry links its sources and labels the kind of evidence behind
> it, so a reader can tell a cohort study from a case report.
>
> Browse the index: https://hraness.com/eds
>
> — Ben Guo

EDS Research Index is an independent index of Ehlers-Danlos syndromes research for patients and clinicians. Each record links its sources and labels the kind of evidence behind it. It is published at [hraness.com/eds](https://hraness.com/eds) as a reference, not medical advice.

## Other EDS references

[The Ehlers-Danlos Society](https://www.ehlers-danlos.com/2017-eds-international-classification/) hosts the 2017 classification and the hEDS diagnostic checklist. [GeneReviews](https://www.ncbi.nlm.nih.gov/books/NBK1116/) has clinician-written chapters on vascular, classical, and hypermobile EDS. [Orphanet](https://www.orpha.net/) lists expert centers and prevalence estimates, and [GARD](https://rarediseases.info.nih.gov/diseases/6322/ehlers-danlos-syndrome) and [NORD](https://rarediseases.org/rare-diseases/ehlers-danlos-syndrome/) have plain-language overviews. This index is narrower. It lists individual findings, practices, and events, shows the kind of evidence behind each, and keeps patient reports next to clinical studies without ranking them together.

## Methodology

Each kind of evidence has its own scale of evidence levels, and a record gives each source the level recorded in the source catalog. Records that cite more than one kind of evidence state how it relates: `convergent`, `single-origin` (the kinds restate one underlying study or report), `contested`, or `refuted`. Community evidence is recorded by venue, never by poster. Historical and folk practices are listed as history, not as recommendations. Every record carries a `reviewed_at` date, and emerging, contested, and community-signal records also need a `reassess_by` date.

The full methodology is on the site at [/eds/methodology](https://hraness.com/eds/methodology).

## Read a record and its sources

Open [topics](https://hraness.com/eds/topics), choose a record, then follow its source links to the cited publications. Use the [source catalog](https://hraness.com/eds/sources) to look up each source's evidence kind and level, not as a single score across different kinds of evidence. Use [subtypes](https://hraness.com/eds/subtypes) to check which subtype the record covers. A review date records an index check; it is not a recommendation for your care.

## Read the YAML data

The [data downloads](https://hraness.com/eds/data) include records and their source catalog. For a nonclinical first example, download the community venue directory and list its IDs and access requirements with Bun 1.3.14:

```sh
curl --fail --location --output venues.yml https://hraness.com/eds/research/venues.yml
bun -e 'import { YAML } from "bun"; const data = YAML.parse(await Bun.file("venues.yml").text()); console.log(data.schema); for (const venue of data.venues) console.log(venue.id, venue.access, venue.url);'
```

The first line is `eds-research/venues/v1`; each following line identifies a venue, its recorded access requirement, and its URL. This lists venues, not individual posts or patient identities. For record data, resolve `source_ids` against `public/research/sources.yml`; the [corpus schema](lib/eds-schema.ts) and [research schema](lib/research-schema.ts) define the fields. Credit reused data and identify your changes as described in [DATA_LICENSE.md](DATA_LICENSE.md). The cited papers and reports keep their own terms.

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

## License

The code is available under the [MIT License](LICENSE). The data files in
`public/eds-corpus/` and `public/research/` are licensed under CC BY 4.0; see
[DATA_LICENSE.md](DATA_LICENSE.md).

## Shared website copy

The website imports `portfolio-messaging.generated.json` at build time for its product name, description, hero, and marketing headings. The snapshot records its revision of [the Hraness portfolio](https://hraness.com/portfolio.json), plus canonical facts for related products. Ordinary builds use the checked-in file without a network request.

Change shared copy in the canonical portfolio, refresh the snapshot through the portfolio refresh workflow, review the generated diff, and run `bun run check`. Keep historical records, research findings, and methodology in their repository-owned sources.

From the company repository, include the package projection when refreshing:

```sh
bun scripts/sync-product-messaging.ts --product eds-research --output /path/to/eds-research/portfolio-messaging.generated.json --package-json /path/to/eds-research/package.json --write
```

Replace `--write` with `--check` to verify both files without changing them. During a coordinated unpublished update, add `--portfolio portfolio.public.generated.json` to select the validated local portfolio revision. Package description derives from canonical `messaging.meta`; package identity, version, and other fields stay intact.
