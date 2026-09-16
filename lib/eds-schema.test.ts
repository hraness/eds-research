import { describe, expect, it } from "bun:test";

import {
  EdsFileSchema,
  EdsRecordSchema,
  PartialDateSchema,
  SubtypeFileSchema,
} from "./eds-schema";

const SOURCE_A = "source-0123456789abcdef0123";
const SOURCE_B = "source-0123456789abcdef0124";

function baseRecord() {
  return {
    id: "test-record",
    kind: "finding",
    title: "A test record",
    summary: "A summary of the test record.",
    subtypes: ["heds"],
    status: "probable",
    criteria_era: "international-2017",
    evidence: [
      {
        stratum: "clinical",
        tier: "case-series",
        source_ids: [SOURCE_A],
      },
    ],
    reviewed_at: "2026-09-16",
  };
}

describe("PartialDateSchema", () => {
  it("accepts year, month, day, and BCE years", () => {
    for (const value of ["1979", "2017-03", "2025-08-14", "-0400"]) {
      expect(PartialDateSchema.safeParse(value).success).toBe(true);
    }
  });
  it("rejects impossible and malformed dates", () => {
    for (const value of [
      "2025-13",
      "2025-02-30",
      "March 2017",
      "17-03",
      "",
      "2025-02-30",
    ]) {
      expect(PartialDateSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe("EdsRecordSchema", () => {
  it("accepts a well-formed record", () => {
    expect(EdsRecordSchema.safeParse(baseRecord()).success).toBe(true);
  });

  it("rejects unknown keys", () => {
    const record = { ...baseRecord(), surprise: true };
    expect(EdsRecordSchema.safeParse(record).success).toBe(false);
  });

  it("requires a date for events", () => {
    const record = { ...baseRecord(), kind: "event" };
    expect(EdsRecordSchema.safeParse(record).success).toBe(false);
    const dated = { ...record, date: "1908" };
    expect(EdsRecordSchema.safeParse(dated).success).toBe(true);
  });

  it("requires practice_kind for practices", () => {
    const record = { ...baseRecord(), kind: "practice" };
    expect(EdsRecordSchema.safeParse(record).success).toBe(false);
    const fixed = { ...record, practice_kind: "medication" };
    expect(EdsRecordSchema.safeParse(fixed).success).toBe(true);
  });

  it("requires venues and community attestation for signals", () => {
    const signal = {
      ...baseRecord(),
      kind: "signal",
      status: "community-signal",
      reassess_by: "2026-12-16",
    };
    expect(EdsRecordSchema.safeParse(signal).success).toBe(false);
    const withVenue = { ...signal, venues: ["venue-reddit-ehlersdanlos"] };
    expect(EdsRecordSchema.safeParse(withVenue).success).toBe(false);
    const withCommunity = {
      ...withVenue,
      evidence: [
        {
          stratum: "community",
          tier: "cross-venue-pattern",
          source_ids: [SOURCE_A],
        },
      ],
    };
    expect(EdsRecordSchema.safeParse(withCommunity).success).toBe(true);
  });

  it("requires corroboration only across multiple strata", () => {
    const multi = {
      ...baseRecord(),
      evidence: [
        { stratum: "clinical", tier: "cohort-study", source_ids: [SOURCE_A] },
        {
          stratum: "community",
          tier: "cross-venue-pattern",
          source_ids: [SOURCE_B],
        },
      ],
    };
    expect(EdsRecordSchema.safeParse(multi).success).toBe(false);
    const convergent = { ...multi, corroboration: "convergent" };
    expect(EdsRecordSchema.safeParse(convergent).success).toBe(true);
    const single = { ...baseRecord(), corroboration: "convergent" };
    expect(EdsRecordSchema.safeParse(single).success).toBe(false);
  });

  it("rejects a tier from the wrong stratum", () => {
    const record = {
      ...baseRecord(),
      evidence: [
        {
          stratum: "community",
          tier: "randomized-trial",
          source_ids: [SOURCE_A],
        },
      ],
    };
    expect(EdsRecordSchema.safeParse(record).success).toBe(false);
  });

  it("requires consensus-strength clinical attestation for established", () => {
    const established = {
      ...baseRecord(),
      status: "established",
      evidence: [
        {
          stratum: "clinical",
          tier: "mechanistic-study",
          source_ids: [SOURCE_A],
        },
      ],
    };
    expect(EdsRecordSchema.safeParse(established).success).toBe(false);
    const withConsensus = {
      ...established,
      evidence: [
        {
          stratum: "clinical",
          tier: "consensus-statement",
          source_ids: [SOURCE_A],
        },
      ],
    };
    expect(EdsRecordSchema.safeParse(withConsensus).success).toBe(true);
  });

  it("lets programs establish on registry authority", () => {
    const program = {
      ...baseRecord(),
      kind: "program",
      status: "established",
      evidence: [
        {
          stratum: "registry",
          tier: "registry-report",
          source_ids: [SOURCE_A],
        },
      ],
    };
    expect(EdsRecordSchema.safeParse(program).success).toBe(true);
  });

  it("requires reassess_by for emerging, contested, and community-signal", () => {
    for (const status of ["emerging", "contested"]) {
      const record = { ...baseRecord(), status };
      expect(EdsRecordSchema.safeParse(record).success).toBe(false);
    }
  });

  it("rejects all-eds combined with specific subtypes", () => {
    const record = { ...baseRecord(), subtypes: ["all-eds", "veds"] };
    expect(EdsRecordSchema.safeParse(record).success).toBe(false);
  });

  it("allows all-eds with unspecified", () => {
    const record = { ...baseRecord(), subtypes: ["all-eds", "unspecified"] };
    expect(EdsRecordSchema.safeParse(record).success).toBe(true);
  });

  it("restricts risk annotations to practices", () => {
    const record = {
      ...baseRecord(),
      risk: { level: "caution", note: "Be careful." },
    };
    expect(EdsRecordSchema.safeParse(record).success).toBe(false);
    const practice = {
      ...record,
      kind: "practice",
      practice_kind: "procedural",
    };
    expect(EdsRecordSchema.safeParse(practice).success).toBe(true);
  });

  it("rejects refuted records marked convergent", () => {
    const record = {
      ...baseRecord(),
      status: "refuted",
      corroboration: "convergent",
      evidence: [
        { stratum: "clinical", tier: "cohort-study", source_ids: [SOURCE_A] },
        {
          stratum: "community",
          tier: "cross-venue-pattern",
          source_ids: [SOURCE_B],
        },
      ],
    };
    expect(EdsRecordSchema.safeParse(record).success).toBe(false);
  });
});

describe("EdsFileSchema", () => {
  it("rejects duplicate record IDs within a file", () => {
    const file = {
      schema: "eds-research/corpus/v1",
      category: {
        id: "test-category",
        label: "Test",
        description: "Test category.",
        order: 1,
      },
      records: [baseRecord(), baseRecord()],
    };
    expect(EdsFileSchema.safeParse(file).success).toBe(false);
  });
});

describe("SubtypeFileSchema", () => {
  it("rejects confirmed molecular basis without genes", () => {
    const file = {
      schema: "eds-research/corpus/v1",
      subtypes: [
        {
          id: "ceds",
          name: "Classical EDS",
          abbreviation: "cEDS",
          classification: "eds-2017",
          inheritance: "autosomal-dominant",
          genes: [],
          genetic_status: "confirmed-molecular-basis",
          prevalence_display: "rare",
          distinguishing_features: "features",
          summary: "summary",
          source_ids: [SOURCE_A],
          reviewed_at: "2026-09-16",
        },
      ],
    };
    expect(SubtypeFileSchema.safeParse(file).success).toBe(false);
  });
});
