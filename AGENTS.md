# Contents

- `lib/eds-schema.ts` – the EDS domain contract: five source strata, per-stratum evidence tiers, corroboration states, criteria eras, subtype registry, record lifecycle.
- `lib/research-schema.ts` – source catalog, venues, monitors, run ledger, questions, collections, publication policy.
- `lib/source-identity.ts` – deterministic source identity and stable IDs.
- `lib/content.ts` – YAML loading from `unknown`, referential integrity, and corpus resolution.
- `public/eds/` – the record corpus: one category file per subject area plus `subtypes.yml`.
- `public/research/` – sources, venues, monitors, runs, questions, collections, and the publication policy.
- `app/` – the public site at `hraness.com/eds` (basePath `/eds`): index, subtypes, topics, records, timeline, practices, community, sources, methodology, research, data, about/contact/privacy, and discovery surfaces.
- `scripts/` – `source-id.ts` (stable IDs), `audit-eds-research.ts` (integrity + coverage), `submit-indexnow.ts`.
- `*.test.ts` – schema regressions and corpus-integrity tests over the real data.

# Guidelines

- Use Bun 1.3.14 for installs, builds, and tests. One `bun.lock`; no other package manager.
- Parse every foreign value from `unknown`. Reject unknown keys, duplicate IDs, unresolved references, malformed URLs, wrong-stratum tiers, and invalid dates at schema level — the loader fails the build, not the page.
- Never collapse strata. A randomized trial and a forum pattern are both real evidence and are never the same kind of real. Community material enters at venue level only: no posters, handles, or verbatim posts.
- Historical and folk records document practice; they never endorse it. `historical-record` and `community-signal` are not gradations of clinical truth.
- Every record declares subtype scope and criteria era. Emerging, contested, and community-signal records are inadmissible without `reassess_by`.
- The corpus is append-only at the ledger level: corrections append new runs; records are marked refuted rather than silently rewritten.
- Source IDs are derived (`scripts/source-id.ts`); never invent one by hand.
- The site is not medical advice and never recommends, prescribes, or discourages a course of care. Keep that boundary visible in public copy.
- Pin Hraness dependencies to reviewed immutable releases or full commits.
- Run `bun run check` before handoff.
