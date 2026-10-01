import { describe, expect, it } from "bun:test";
import type { Metadata } from "next";

import { loadCorpus, loadSubtypes } from "../lib/content";
import { generateMetadata as homeMetadata } from "./page";
import { generateMetadata as aboutMetadata } from "./about/page";
import { generateMetadata as communityMetadata } from "./community/page";
import { generateMetadata as contactMetadata } from "./contact/page";
import { generateMetadata as dataMetadata } from "./data/page";
import { generateMetadata as methodologyMetadata } from "./methodology/page";
import { generateMetadata as practicesMetadata } from "./practices/page";
import { generateMetadata as privacyMetadata } from "./privacy/page";
import { generateMetadata as recordMetadata } from "./records/[id]/page";
import { generateMetadata as researchMetadata } from "./research/page";
import { generateMetadata as sourcesMetadata } from "./sources/page";
import { generateMetadata as subtypeMetadata } from "./subtypes/[id]/page";
import { generateMetadata as subtypesMetadata } from "./subtypes/page";
import { generateMetadata as timelineMetadata } from "./timeline/page";
import { generateMetadata as topicMetadata } from "./topics/[category]/page";
import {
  CATEGORY_SEARCH_DESCRIPTIONS,
  CATEGORY_SEARCH_TITLES,
  RECORD_SEARCH_DESCRIPTIONS,
  RECORD_SEARCH_TITLES,
  SUBTYPE_SEARCH_DESCRIPTIONS,
  SUBTYPE_SEARCH_TITLES,
} from "./search-metadata";
import { absoluteSiteUrl, site, type SitePath } from "./site";
import sitemap from "./sitemap";

describe("public search metadata", () => {
  it("covers the entire sitemap with distinct titles, readable descriptions, and matching shares", async () => {
    const [corpus, subtypes, urls] = await Promise.all([loadCorpus(), loadSubtypes(), sitemap()]);
    const pages: [SitePath, Metadata][] = [
      ["/", homeMetadata()],
      ["/about", aboutMetadata()],
      ["/community", communityMetadata()],
      ["/contact", contactMetadata()],
      ["/data", dataMetadata()],
      ["/methodology", methodologyMetadata()],
      ["/practices", practicesMetadata()],
      ["/privacy", privacyMetadata()],
      ["/research", researchMetadata()],
      ["/sources", sourcesMetadata()],
      ["/subtypes", subtypesMetadata()],
      ["/timeline", timelineMetadata()],
    ];
    for (const { id } of corpus.records) pages.push([
      `/records/${id}`,
      await recordMetadata({ params: Promise.resolve({ id }) }),
    ]);
    for (const { id } of subtypes) pages.push([
      `/subtypes/${id}`,
      await subtypeMetadata({ params: Promise.resolve({ id }) }),
    ]);
    for (const { id: category } of corpus.categories) pages.push([
      `/topics/${category}`,
      await topicMetadata({ params: Promise.resolve({ category }) }),
    ]);

    expect(pages.map(([path]) => absoluteSiteUrl(path)).sort()).toEqual(urls.map(({ url }) => url).sort());
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const [path, metadata] of pages) {
      const title = typeof metadata.title === "string"
        ? site.titleTemplate.replace("%s", metadata.title)
        : (metadata.title as { absolute: string }).absolute;
      expect(title.length, path).toBeGreaterThanOrEqual(30);
      expect(title.length, path).toBeLessThanOrEqual(60);
      expect(titles.has(title.toLocaleLowerCase("en-US")), path).toBe(false);
      titles.add(title.toLocaleLowerCase("en-US"));
      const description = metadata.description!;
      expect(description.length, path).toBeGreaterThanOrEqual(110);
      expect(description.length, path).toBeLessThanOrEqual(160);
      expect(description, path).toMatch(/[.!?]$/u);
      expect(description, path).not.toContain("—");
      expect(descriptions.has(description.toLocaleLowerCase("en-US")), path).toBe(false);
      descriptions.add(description.toLocaleLowerCase("en-US"));
      expect(metadata.alternates?.canonical, path).toBe(absoluteSiteUrl(path));
      expect(metadata.openGraph?.title, path).toBe(title);
      expect(metadata.twitter?.title, path).toBe(title);
      expect(metadata.openGraph?.description, path).toBe(description);
      expect(metadata.twitter?.description, path).toBe(description);
    }
  });

  it("keeps overrides attached to existing records, subtypes, and topics", async () => {
    const [corpus, subtypes] = await Promise.all([loadCorpus(), loadSubtypes()]);
    for (const overrides of [RECORD_SEARCH_TITLES, RECORD_SEARCH_DESCRIPTIONS]) {
      for (const id of Object.keys(overrides)) expect(corpus.records.some(record => record.id === id), id).toBe(true);
    }
    for (const overrides of [SUBTYPE_SEARCH_TITLES, SUBTYPE_SEARCH_DESCRIPTIONS]) {
      for (const id of Object.keys(overrides)) expect(subtypes.some(subtype => subtype.id === id), id).toBe(true);
    }
    for (const overrides of [CATEGORY_SEARCH_TITLES, CATEGORY_SEARCH_DESCRIPTIONS]) {
      for (const id of Object.keys(overrides)) expect(corpus.categories.some(category => category.id === id), id).toBe(true);
    }
  });

  it("preserves the uncertainty and attribution of sensitive search snippets", async () => {
    const page = async (id: string) => recordMetadata({ params: Promise.resolve({ id }) });
    expect((await page("com-cci-tethered-cord")).title).toMatch(/contested/iu);
    expect((await page("gen-klk15-first-candidate")).title).toMatch(/candidate/iu);
    expect((await page("gen-klk15-first-candidate")).description).toMatch(/not a diagnostic test/iu);
    expect((await page("com-trifecta-pattern")).title).toMatch(/patient reports/iu);
    expect((await page("folk-diet-supportive")).title).toMatch(/historical/iu);
    const refuted = await page("hist-named-ehlers-danlos-1949");
    expect(refuted.title).toMatch(/refuted/iu);
    expect(refuted.description).toMatch(/refuted/iu);
    expect((await page("px-fatigue-underrecognized")).title).toMatch(/German/iu);
  });
});
