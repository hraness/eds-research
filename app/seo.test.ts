import { describe, expect, it } from "bun:test";

import { collectionPageJsonLd, webPageJsonLd, websiteJsonLd } from "./seo";

describe("structured data", () => {
  it("names Hraness as publisher by reference to its own organization node", () => {
    const website = websiteJsonLd();
    expect(website.publisher).toEqual({
      "@id": "https://hraness.com/#organization",
    });
    expect(JSON.stringify(website)).not.toContain('"@type":"Organization"');
  });

  it("lists collection members as linked web pages", () => {
    const page = collectionPageJsonLd(
      [{ path: "/records/mgmt-lidocaine-resistance", title: "Lidocaine" }],
      { description: "Records.", path: "/", title: "EDS Research Index" },
    );
    expect(page.hasPart).toEqual([
      {
        "@type": "WebPage",
        "@id":
          "https://hraness.com/eds/records/mgmt-lidocaine-resistance#webpage",
        url: "https://hraness.com/eds/records/mgmt-lidocaine-resistance",
        name: "Lidocaine",
      },
    ]);
  });

  it("gives subtype pages the citations it is passed", () => {
    const page = webPageJsonLd({
      citations: ["https://doi.org/10.1002/ajmg.c.31552"],
      description: "Vascular EDS.",
      path: "/subtypes/veds",
      title: "Vascular Ehlers-Danlos syndrome (vEDS)",
    });
    expect(page.citation).toEqual(["https://doi.org/10.1002/ajmg.c.31552"]);
  });
});
