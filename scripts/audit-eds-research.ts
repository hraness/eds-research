import { loadCorpus, loadResearch, loadSubtypes } from "../lib/content";

const research = await loadResearch();
const corpus = await loadCorpus(research);
const subtypes = await loadSubtypes(research);

const problems: string[] = [];

const recordIds = new Set(corpus.records.map(({ id }) => id));
for (const collection of research.collections) {
  for (const recordId of collection.record_ids) {
    if (!recordIds.has(recordId)) {
      problems.push(
        `collection ${collection.id} references unknown record ${recordId}`,
      );
    }
  }
}
for (const question of research.questions) {
  for (const sourceId of question.related_source_ids ?? []) {
    if (!research.sourceById.has(sourceId)) {
      problems.push(
        `question ${question.id} references unknown source ${sourceId}`,
      );
    }
  }
}
for (const run of research.runs) {
  for (const sourceId of run.admitted_source_ids ?? []) {
    if (!research.sourceById.has(sourceId)) {
      problems.push(`run ${run.id} admits unknown source ${sourceId}`);
    }
  }
  for (const recordId of run.admitted_record_ids ?? []) {
    if (!recordIds.has(recordId)) {
      problems.push(`run ${run.id} admits unknown record ${recordId}`);
    }
  }
}

const citedSourceIds = new Set<string>();
for (const record of corpus.records) {
  for (const attestation of record.evidence) {
    for (const sourceId of attestation.source_ids) citedSourceIds.add(sourceId);
  }
}
for (const subtype of subtypes) {
  for (const sourceId of subtype.source_ids) citedSourceIds.add(sourceId);
}
for (const question of research.questions) {
  for (const sourceId of question.related_source_ids ?? []) {
    citedSourceIds.add(sourceId);
  }
}
const uncited = research.sources.filter(({ id }) => !citedSourceIds.has(id));

const strataCounts = new Map<string, number>();
for (const record of corpus.records) {
  for (const { stratum } of record.evidence) {
    strataCounts.set(stratum, (strataCounts.get(stratum) ?? 0) + 1);
  }
}

if (problems.length > 0) {
  console.error("Audit failed:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`Sources:    ${research.sources.length}`);
console.log(`Venues:     ${research.venues.length}`);
console.log(`Monitors:   ${research.monitors.length} (${research.monitors.filter((m) => m.active).length} active)`);
console.log(`Runs:       ${research.runs.length}`);
console.log(`Questions:  ${research.questions.length}`);
console.log(`Categories: ${corpus.categories.length}`);
console.log(`Records:    ${corpus.records.length}`);
console.log(`Subtypes:   ${subtypes.length}`);
console.log(`Attestations by stratum: ${[...strataCounts.entries()].map(([s, n]) => `${s}=${n}`).join(", ")}`);
if (uncited.length > 0) {
  console.log(`Uncited sources (catalog-only): ${uncited.map(({ id }) => id).join(", ")}`);
}
console.log("Audit passed.");
