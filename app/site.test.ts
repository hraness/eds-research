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
