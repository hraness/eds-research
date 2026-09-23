import { describe as group, expect, it } from "bun:test";

import { loadCorpus } from "@/lib/content";

import { describe, displayDate, KIND_LABELS, STATUS_LABELS } from "./display";

group("displayDate", () => {
  it("rounds decades and centuries down to their first year", () => {
    expect(displayDate("1883", "decade")).toBe("1880s");
    expect(displayDate("1880", "decade")).toBe("1880s");
    expect(displayDate("1900", "century")).toBe("1900s");
    expect(displayDate("1682", "century")).toBe("1600s");
  });

  it("writes BC years without zero padding", () => {
    expect(displayDate("-0400", "century")).toBe("c. 400 BC");
  });

  it("keeps day, month, and year dates as written", () => {
    expect(displayDate("2025-08", "month")).toBe("2025-08");
    expect(displayDate("1901", "year")).toBe("1901");
    expect(displayDate(undefined, undefined)).toBe("undated");
  });
});

group("describe", () => {
  it("returns short text unchanged", () => {
    expect(describe("A short summary.")).toBe("A short summary.");
  });

  it("keeps whole sentences that fit", () => {
    const text =
      "The first sentence is short. The second sentence is also short. " +
      "The third sentence is long enough that all three together run past the limit of one hundred and sixty characters.";
    expect(describe(text)).toBe(
      "The first sentence is short. The second sentence is also short.",
    );
  });

  it("does not split sentences at decimals or gene names", () => {
    const text =
      "The survey found an average of 10.45 other diagnoses and a KLK15 p.Gly226Asp variant in families. " +
      "A second sentence pushes the text past the limit so the first sentence must stand alone as the description.";
    expect(describe(text)).toBe(
      "The survey found an average of 10.45 other diagnoses and a KLK15 p.Gly226Asp variant in families.",
    );
  });

  it("cuts an over-long first sentence at a word boundary without an ellipsis", () => {
    const text = `${"word ".repeat(60).trim()}.`;
    const result = describe(text);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith("word")).toBe(true);
    expect(result).not.toContain("…");
  });

  it("gives every record a description that fits and ends on a whole word", async () => {
    const corpus = await loadCorpus();
    for (const record of corpus.records) {
      const description = describe(record.summary);
      expect(description.length).toBeGreaterThan(0);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(record.summary.replace(/\s+/gu, " ")).toStartWith(description);
      const next = record.summary.replace(/\s+/gu, " ").charAt(description.length);
      expect(["", " ", ",", ";", ":", "("]).toContain(next);
    }
  });

  it("gives every record page a description that is one or more whole sentences", async () => {
    const corpus = await loadCorpus();
    for (const record of corpus.records) {
      const description = record.description ?? describe(record.summary);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description).toMatch(/[.!?][”"’)]?$/u);
      expect(description).not.toContain("\u2014");
    }
  });
});

group("record badges", () => {
  it("never shows the same label for a record's status and kind", () => {
    for (const kind of Object.values(KIND_LABELS)) {
      expect(Object.values(STATUS_LABELS)).not.toContain(kind);
    }
  });
});
