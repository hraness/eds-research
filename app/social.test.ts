import { describe, expect, it, mock } from "bun:test";
import { readFileSync } from "node:fs";

import * as socialImage from "@hraness/web-discovery/social-image";
import {
  socialImageFit,
  socialImageIconShape,
  socialImageSiteDetails,
} from "@hraness/web-discovery/social-image/card";

import { SITE_LABEL, site } from "./site";
import { APP_ICON_SVG, SOCIAL_CARD_NAME, socialSite } from "./social";

describe("social image declaration", () => {
  it("uses the real app icon from app/icon.svg", () => {
    const iconFile = readFileSync(new URL("./icon.svg", import.meta.url), "utf8");
    expect(APP_ICON_SVG).toBe(iconFile);
    expect(socialSite.icon?.kind).toBe("app");
    const src = socialSite.icon?.src ?? "";
    expect(src.startsWith("data:image/svg+xml;base64,")).toBe(true);
    const decoded = Buffer.from(src.split(",")[1] ?? "", "base64").toString("utf8");
    expect(decoded).toBe(iconFile);
  });

  it("declares the site's brand copy and light theme", () => {
    expect(socialSite.name).toBe(SOCIAL_CARD_NAME);
    expect(site.name.startsWith(SOCIAL_CARD_NAME)).toBe(true);
    expect(socialSite.domain).toBe(SITE_LABEL);
    expect(socialSite.description).toBe(site.tagline);
    expect(socialSite.theme).toEqual({
      accent: "#2c5f8a",
      background: "#faf9f7",
      foreground: "#1c1a17",
      muted: "#57534b",
    });
    const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");
    const root = css.slice(0, css.indexOf("}"));
    expect(root).toContain("--accent: #2c5f8a;");
    expect(root).toContain("--bg: #faf9f7;");
    expect(root).toContain("--ink: #1c1a17;");
    expect(root).toContain("--ink-soft: #57534b;");
  });

  it("feeds the shared template the site details", () => {
    const details = socialImageSiteDetails(socialSite);
    expect(details.title).toBe("EDS Research");
    expect(details.domain).toBe("hraness.com/eds");
    expect(details.icon).toEqual(socialSite.icon);
    expect(socialSite.keepTogether).toEqual([SOCIAL_CARD_NAME]);
  });
});

describe("social image fit", () => {
  it("lays out the home card as written, with the name on one line", () => {
    const fit = socialImageFit(socialImageSiteDetails(socialSite));
    expect(fit.issues).toEqual([]);
    expect(fit.findings).toEqual([]);
    expect(fit.layout).toBe("product");
    expect(fit.headline.lines).toEqual([SOCIAL_CARD_NAME]);
    expect(fit.headline.reduced).toBe(false);
    expect(fit.description?.cut).toBe("none");
    expect(fit.removed).toEqual([]);
  });

  it("draws the app icon as solid full-bleed art", () => {
    expect(socialSite.icon && socialImageIconShape(socialSite.icon)).toBe("solid");
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
    expect(calls).toEqual([[socialSite]]);
    const png = new Uint8Array(await response.arrayBuffer());
    expect([...png.slice(1, 4)]).toEqual([0x50, 0x4e, 0x47]);
  });
});
