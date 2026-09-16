import { describe, expect, it } from "bun:test";

import { loadCorpus, loadResearch, loadSubtypes } from "./content";
import { subtypeIds } from "./eds-schema";
import { stableResearchSourceId } from "./source-identity";

describe("research layer", () => {
  it("loads the full research corpus", async () => {
    const research = await loadResearch();
    expect(research.sources.length).toBeGreaterThan(30);
    expect(research.venues.length).toBeGreaterThan(3);
    expect(research.monitors.length).toBeGreaterThan(5);
    expect(research.questions.length).toBeGreaterThan(3);
    expect(research.publicationPolicy.rules.length).toBeGreaterThan(3);
  });

  it("keeps source IDs stable against URL and date", async () => {
    const research = await loadResearch();
    for (const source of research.sources) {
      expect(source.id).toBe(
        stableResearchSourceId(source.url, source.published_at),
      );
    }
  });

  it("files every community source under a known venue", async () => {
    const research = await loadResearch();
    for (const source of research.sources) {
      if (source.stratum === "community") {
        expect(source.venue_id).toBeDefined();
        expect(research.venueById.has(source.venue_id ?? "")).toBe(true);
      }
    }
  });

  it("references only existing monitors from runs", async () => {
    const research = await loadResearch();
    const monitorIds = new Set(research.monitors.map(({ id }) => id));
    for (const run of research.runs) {
      for (const monitorId of run.monitors_used ?? []) {
        expect(monitorIds.has(monitorId)).toBe(true);
      }
    }
  });
});

describe("corpus layer", () => {
  it("loads all categories with globally unique record IDs", async () => {
    const corpus = await loadCorpus();
    expect(corpus.categories.length).toBeGreaterThan(5);
    const ids = corpus.records.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves every cited source at its attested stratum", async () => {
    const corpus = await loadCorpus();
    for (const record of corpus.records) {
      for (const attestation of record.evidence) {
        expect(attestation.sources.length).toBe(
          attestation.source_ids.length,
        );
        for (const source of attestation.sources) {
          expect(source.stratum).toBe(attestation.stratum);
        }
      }
    }
  });

  it("resolves every venue reference to a venue name", async () => {
    const corpus = await loadCorpus();
    for (const record of corpus.records) {
      expect(record.venueNames.length).toBe((record.venues ?? []).length);
    }
  });

  it("keeps emerging, contested, and signal records reassessment-dated", async () => {
    const corpus = await loadCorpus();
    for (const record of corpus.records) {
      if (
        ["emerging", "contested", "community-signal"].includes(record.status)
      ) {
        expect(record.reassess_by).toBeDefined();
      }
    }
  });

  it("attests community sources only through venues, never individuals", async () => {
    const research = await loadResearch();
    const corpus = await loadCorpus(research);
    for (const record of corpus.records) {
      for (const attestation of record.evidence) {
        if (attestation.stratum !== "community") continue;
        for (const source of attestation.sources) {
          expect(source.venue_id).toBeDefined();
        }
      }
    }
  });

  it("carries attestation in all five strata", async () => {
    const corpus = await loadCorpus();
    const strata = new Set(
      corpus.records.flatMap((r) => r.evidence.map((e) => e.stratum)),
    );
    expect(strata).toEqual(
      new Set(["clinical", "community", "historical", "registry", "gray"]),
    );
  });
});

describe("subtypes", () => {
  it("covers all thirteen 2017 types plus HSD", async () => {
    const subtypes = await loadSubtypes();
    const ids = new Set(subtypes.map(({ id }) => id));
    for (const id of subtypeIds) {
      if (id === "all-eds" || id === "unspecified") continue;
      expect(ids.has(id)).toBe(true);
    }
  });

  it("references only known sources", async () => {
    const research = await loadResearch();
    const subtypes = await loadSubtypes(research);
    for (const subtype of subtypes) {
      for (const sourceId of subtype.source_ids) {
        expect(research.sourceById.has(sourceId)).toBe(true);
      }
    }
  });
});
