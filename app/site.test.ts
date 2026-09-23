import { describe, expect, it } from "bun:test";

import {
  absoluteSiteUrl,
  publicSitePath,
  SITE_BASE_PATH,
  SITE_ORIGIN,
} from "./site";

describe("site paths", () => {
  it("maps the root to the base path", () => {
    expect(publicSitePath("/")).toBe("/eds");
    expect(publicSitePath("/subtypes")).toBe("/eds/subtypes");
  });

  it("builds absolute canonical URLs under hraness.com/eds", () => {
    expect(absoluteSiteUrl("/")).toBe("https://hraness.com/eds");
    expect(absoluteSiteUrl("/sources")).toBe(
      "https://hraness.com/eds/sources",
    );
  });

  it("keeps origin constants consistent", () => {
    expect(SITE_BASE_PATH).toBe("/eds");
    expect(SITE_ORIGIN).toBe("https://hraness.com/eds");
  });
});

describe("site description", () => {
  it("fits a meta description and uses no em dash", async () => {
    const { site } = await import("./site");
    expect(site.description.length).toBeLessThanOrEqual(160);
    expect(site.description).not.toContain("—");
    expect(site.description).toContain("Ehlers-Danlos");
  });
});

describe("llms.txt", () => {
  it("lists every public data file", async () => {
    const { GET } = await import("./llms.txt/route");
    const { CORPUS_FILES, RESEARCH_FILES } = await import("./data-files");
    const text = await GET().text();
    for (const file of CORPUS_FILES) {
      expect(text).toContain(`https://hraness.com/eds/eds-corpus/${file}`);
    }
    for (const file of RESEARCH_FILES) {
      expect(text).toContain(`https://hraness.com/eds/research/${file}`);
    }
  });
});
