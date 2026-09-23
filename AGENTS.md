# Contents

- `lib/eds-schema.ts` – the EDS domain contract: five source strata, per-stratum evidence tiers, corroboration states, criteria eras, subtype registry, record lifecycle.
- `lib/research-schema.ts` – source catalog, venues, monitors, run ledger, questions, collections, publication policy.
- `lib/source-identity.ts` – deterministic source identity and stable IDs.
- `lib/content.ts` – YAML loading from `unknown`, referential integrity, and corpus resolution.
- `public/eds-corpus/` – the record corpus: one category file per subject area plus `subtypes.yml`.
- `public/research/` – sources, venues, monitors, runs, questions, collections, and the publication policy.
- `app/` – the public site at `hraness.com/eds` (basePath `/eds`): index, subtypes, topics, records, timeline, practices, community, sources, methodology, research, data, about/contact/privacy, and discovery surfaces.
- `scripts/` – `source-id.ts` (stable IDs), `audit-eds-research.ts` (integrity + coverage), `submit-indexnow.ts`.
- `*.test.ts` – schema regressions and corpus-integrity tests over the real data.

# Guidelines

- Use Bun 1.3.14 for installs, builds, and tests. One `bun.lock`; no other package manager.
- Parse every foreign value from `unknown`. Reject unknown keys, duplicate IDs, unresolved references, malformed URLs, wrong-stratum tiers, record tiers that differ from the source catalog, and invalid dates at schema level. The loader fails the build, not the page.
- Never collapse strata into one score; each stratum has its own tier scale. Community material enters at venue level only: no posters, handles, or verbatim posts.
- Historical and folk records document practice; they never endorse it. `historical-record` and `community-signal` are not gradations of clinical truth.
- Every record declares subtype scope and criteria era. Emerging, contested, and community-signal records are inadmissible without `reassess_by`.
- The corpus is append-only at the ledger level: every correction appends a run to `public/research/runs.yml` that lists each changed record or source under `corrections` with the evidence for the change. A record whose central claim is wrong is marked `refuted` rather than rewritten; a wrong detail may be corrected in place only with that run entry. Never change a record ID: record IDs are URLs.
- Source IDs are derived (`scripts/source-id.ts`); never invent one by hand.
- The site is not medical advice and never recommends, prescribes, or discourages a course of care. State that once, near the top of a page, rather than repeating it in every section.
- Pin Hraness dependencies to reviewed immutable releases or full commits.
- Run `bun run check` before handoff.

# Writing and evidence rules for records

These rules govern every record, source note, question, and page an agent writes for this index. Public text also follows `STYLE.md` and `WRITING.md`; text a model writes for publication also follows `hraness-generation-style/v1` and the "Digest or gist" addendum in [`GENERATION_STYLE.md`](https://github.com/hraness/.github/blob/main/GENERATION_STYLE.md).

- Write for patients and clinicians who have not read the sources. Use plain sentences, no em dashes, and sentence-case titles that state the finding. Do not use "X: the Y" or "X, the Y" epithets as titles, and do not write clauses about how the index files, indexes, or tracks a record.
- Quote every number with its statistic (mean or median), its denominator, and its population, taken from the paper's results, tables, or abstract, never from its introduction or its account of other work. When the abstract and the tables disagree, use the tables and say so.
- Before adding a source, resolve its DOI, PMID, PMCID, or arXiv ID and confirm that the title, venue, and year at the link match the catalog entry. A link that resolves does not show that it is the right paper. Record the check in the run entry.
- A record's tier for a source must equal that source's tier in `sources.yml`; the loader enforces this. Choose the catalog tier from the study design: interview studies are `qualitative-study`, one-time surveys are `cross-sectional-study`, and a review that retells a historical report is `retrospective-account`, not a primary document.
- `convergent` needs independent studies or reports in different strata. A paper, its preprint, and a press release are one study, and a classification and a patient-organization summary of it are one source; mark those `single-origin`.
- Status follows the evidence, not the other way round. If a record needs an upgraded tier to pass the `established` check, it is `probable`.
- Risk notes describe reported effects and attribute any advice to its source ("The trial authors say…"). They never tell the reader what to do.
- Say a caveat once. The "not medical advice" and "listed, not recommended" notices live on the page, not in each record.
- Every change to a record, source, question, or subtype appends a run entry that names each target and what changed.

<!-- hraness-public-copy:start -->
- Public copy (websites, READMEs, docs, package and GitHub descriptions, CLI help, `llms.txt`, generated pages) follows `STYLE.md`, synced from hraness/.github. Text a model writes for publication also follows `GENERATION_STYLE.md`.
- The delivery vocabulary in this file (admission, qualification, custody, receipt, bounded, lane, gate, surface, projection) is internal. Translate it into what the reader gets.
- Take one-line product and sibling descriptions from the portfolio registry and versions from the release record. Tests pin facts, not prose.
- Run `bun run check:copy` before handoff when the repository has it.
<!-- hraness-public-copy:end -->

<!-- oompa-local-efficiency:start -->
- Treat the user's request to change this repository as standing authorization for routine task-owned commits, pushes, pull requests, merges, releases, deployments, and production verification after the gates applicable to that action pass. Do not ask for duplicate confirmation. Build confidence through relevant automated checks, bounded diagnostics, and independent review, not another human approval. Passing checks does not expand task scope or authority.
- Prefer agentic service provisioning for new infrastructure. Check Vercel Marketplace for a native product that can provision the required resource first; use Stripe Projects as a supported alternative when it better covers the service or the Marketplace route only connects an existing account. Verify the current catalog, account, region, plan, recurring cost and resource capabilities before selecting a route. Prefer supported provider CLIs or APIs over browser-only setup when neither catalog fits, and explain the concrete exception. Reuse existing owner-controlled resources where appropriate; this preference alone does not authorize migrations, duplicate accounts, paid upgrades or wider access. Continue setup already authorized by the task and budget without duplicate confirmation. Keep provider credentials and generated environment files private, complete required interactive authentication, and verify deployment, persistence and recovery separately from successful provisioning.
- Separate artifact admission from live qualification and operational activation. Use applicable automated source, security, package/install, and provenance evidence for artifact admission; live provider qualification is not a universal publication prerequisite. Preserve explicit live acceptance criteria and require relevant live evidence for claims that depend on it. If publication or an artifact's install, upgrade, or default-use path activates risky unqualified behavior, keep that behavior guarded or disabled, or obtain bounded relevant evidence before shipping or activation.
- Use the repository's documented delivery workflow and preserve the identity, target, capacity, migration, and recovery guards applicable to operational activation. Replace an obsolete gate through a reviewed source and policy change with corresponding tests, never an ad hoc skip. Preserve every runtime-enforced approval, access control, branch protection, environment rule, safety policy, and required final gate. Ask for user input only when delivery needs a material product decision, missing credentials or authority, unavoidable interactive authentication, an irreversibly destructive action outside task scope, or resolution of a failure that cannot be handled safely and autonomously.
- Preserve production and user data throughout delivery. Inspect the exact account, environment, deployment, and data target before writes. For data changes, inspect a dry run or equivalent migration plan and validate the recovery path before any effect that could lose or corrupt data. Prefer additive, backward-compatible migrations and bounded batches. Record mutation intent, use idempotency or conditional writes, and reconcile uncertain results before retrying. Verify deployed identity, health, and relevant data invariants after delivery. Routine delivery never authorizes resetting, truncating, dropping, or overwriting user data; stop the unsafe operation if preservation or recovery cannot be established.
- Prefer short-lived repository workload identities such as OIDC trusted publishing, GitHub Apps, and narrowly scoped machine identities. Use unattended stable publication and production promotion when supported by the provider and repository. Establish supported machine authority once and verify it with a non-publishing preflight where available; routine releases should not require recurring interactive authentication or conversational approval. Retain account two-factor authentication and provider controls, including required authentication for approval of an exact staged artifact; do not add long-lived personal tokens to eliminate an interactive prompt.
- Keep delivery gates proportional to the failure they prevent. Prefer required checks on the current integration candidate, independent agent review, and atomic or conditional integration. Add a merge queue or another approval stage only for a demonstrated coordination or safety need. Replace redundant queues, serial waits, and duplicate checks through reviewed policy changes while retaining evidence for the integrated result.
- Preserve useful reasoning fan-out, but avoid unnecessary checkout fan-out. Prefer subagents in the current task for bounded research, review, diagnosis, and focused checks when they can safely share one working tree; create a separate task or worktree only for independently deliverable divergent edits, an isolated verification tree, or a different execution environment.
- Give each expensive focused validation command and external wait one owner. The integration owner reviews that evidence and runs the repository-required aggregate or final gate once after convergence. Reuse evidence only for the exact Git tree, command, lockfiles, toolchain, relevant environment, and validity period, and never to skip a required final integration, merge, release, deployment, or production-verification gate.
- On Hraness development machines, use `$oompa-local-efficiency` and the installed host scheduler for heavyweight top-level commands when available. Keep ordinary work in the compute lane; give authenticated browser/dev-server/Chromium work one `browser-auth` owner and Mac-only validation one `mac-native` owner.
- When a CI or policy gate scans complete Git history, check out the exact governed SHA and fetch only the fully qualified governed refs before scanning. Preserve the complete-history gate and reject unexpected refs instead of importing unrelated concurrent heads.
- At closeout, record applicable branch, PR, check, merge, release, deployment, and production evidence. Archive only conclusively finished tasks, never from silence alone, and reclaim only freshly revalidated clean merged worktrees through the guarded exact-path flow.
<!-- oompa-local-efficiency:end -->

<!-- algal-skills:start -->
## ALGAL skills

- Prefer the globally installed `algal-*` skills for bounded git state, diffs, repository survey/search, test and release gates, CI polling, and web fetches instead of repeated raw tool output.
- At session start, if the `algal` skill is unavailable, install the current skill pack for Claude Code, Codex, and Devin for Terminal with `bunx skills add 0thernet/algal-skills --global --agent claude-code codex devin --skill '*' --copy --yes`.
- Confirm installation with `bunx skills list --global`. If Bun or network access is unavailable, continue with repository-native tools instead of blocking delivery.
- Treat ALGAL receipts as execution evidence, not provider attestation, and preserve the repository's normal verification and release gates.
<!-- algal-skills:end -->
