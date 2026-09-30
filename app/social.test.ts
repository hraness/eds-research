import { describe, expect, it, mock } from "bun:test";
import { readFileSync } from "node:fs";

import * as socialImage from "@hraness/web-discovery/social-image";
import {
  socialImageFit,
  socialImageSiteDetails,
} from "@hraness/web-discovery/social-image/card";

import { SITE_LABEL, site } from "./site";
import { productMessaging } from "./product-messaging";
import { homeSocialPage, socialSite } from "./social";

describe("social image declaration", () => {
  it("draws the header as the site shows it: text brand, no mark", () => {
    expect(socialSite.brand).toBe(site.name);
    expect(socialSite.name).toBe(site.name);
    expect(socialSite.brandMark).toBeUndefined();
    expect(socialSite).not.toHaveProperty("icon");
    expect(socialSite).not.toHaveProperty("palette");
    expect(socialSite.domain).toBe(SITE_LABEL);
    expect(socialSite.description).toBe(site.tagline);
  });

  it("takes its theme from the page's own colours", () => {
    expect(socialSite.theme).toEqual({
      accent: "#2c5f8a",
      background: "#faf9f7",
      foreground: "#1c1a17",
      headerBackground: "#faf9f7",
      line: "#e4e0d8",
      muted: "#57534b",
    });
    const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");
    const root = css.slice(0, css.indexOf("}"));
    expect(root).toContain("--accent: #2c5f8a;");
    expect(root).toContain("--bg: #faf9f7;");
    expect(root).toContain("--ink: #1c1a17;");
    expect(root).toContain("--ink-soft: #57534b;");
    expect(root).toContain("--line: #e4e0d8;");
    expect(css).toMatch(/\.site-header \{[^}]*background: var\(--bg\);/u);
  });

  it("uses the hero's eyebrow and headline on the home card", () => {
    expect(homeSocialPage).toEqual({
      description: "",
      eyebrow: productMessaging.category,
      headline: productMessaging.hero.heading,
      layout: "product",
    });
  });
});

describe("social image fit", () => {
  it("lays out the home card as written", () => {
    const fit = socialImageFit(socialImageSiteDetails(socialSite, homeSocialPage));
    expect(fit.issues).toEqual([]);
    expect(fit.findings).toEqual([]);
    expect(fit.layout).toBe("product");
    expect(fit.headline).toMatchObject({ reduced: false, threeLine: false, truncated: false });
    expect(fit.description).toBeUndefined();
    expect(fit.removed).toEqual([]);
  });
});

describe("opengraph-image route", () => {
  it("renders the shared template for the site at 1200x630 PNG", async () => {
    const calls: unknown[][] = [];
    const real = { ...socialImage };
    void mock.module("@hraness/web-discovery/social-image", () => ({
      ...real,
      createSiteSocialImageResponse: (...args: Parameters<typeof real.createSiteSocialImageResponse>) => {
        calls.push(args);
        return real.createSiteSocialImageResponse(...args);
      },
    }));
    const route = await import("./opengraph-image");
    expect(route.size).toEqual({ height: 630, width: 1200 });
    expect(route.contentType).toBe("image/png");
    expect(route.alt).toBe(site.socialImageAlt);
    const response = route.default();
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(calls).toEqual([[socialSite, homeSocialPage]]);
    const png = new Uint8Array(await response.arrayBuffer());
    expect([...png.slice(1, 4)]).toEqual([0x50, 0x4e, 0x47]);
  });
});
