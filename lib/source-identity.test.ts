import { describe, expect, it } from "bun:test";

import {
  canonicalResearchSourceIdentity,
  stableResearchSourceId,
} from "./source-identity";

describe("canonicalResearchSourceIdentity", () => {
  it("strips www and trailing slashes", () => {
    expect(
      canonicalResearchSourceIdentity("https://www.example.com/a/", "2020"),
    ).toBe(canonicalResearchSourceIdentity("https://example.com/a", "2020"));
  });

  it("strips tracking parameters", () => {
    expect(
      canonicalResearchSourceIdentity(
        "https://example.com/a?utm_source=x&b=1",
        undefined,
      ),
    ).toBe(canonicalResearchSourceIdentity("https://example.com/a?b=1", undefined));
  });

  it("keeps publication date in the identity", () => {
    const a = canonicalResearchSourceIdentity("https://example.com/a", "2020");
    const b = canonicalResearchSourceIdentity("https://example.com/a", "2021");
    expect(a).not.toBe(b);
  });
});

describe("stableResearchSourceId", () => {
  it("is deterministic", () => {
    expect(stableResearchSourceId("https://example.com/a", "2020")).toBe(
      stableResearchSourceId("https://example.com/a", "2020"),
    );
  });

  it("matches the source ID format", () => {
    expect(stableResearchSourceId("https://example.com/a", undefined)).toMatch(
      /^source-[a-f0-9]{20}$/u,
    );
  });

  it("differentiates mirrors by path but not tracking params", () => {
    expect(
      stableResearchSourceId("https://example.com/a?utm_campaign=x", undefined),
    ).toBe(stableResearchSourceId("https://example.com/a", undefined));
    expect(
      stableResearchSourceId("https://example.com/a", undefined),
    ).not.toBe(stableResearchSourceId("https://example.com/b", undefined));
  });
});
