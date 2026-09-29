import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { loadCorpus } from "@/lib/content";
import { assertNoHeadings, assertRoleImgWithLabel } from "@hraness/design-kit/testing";

import { STRATUM_LABELS } from "./display";
import {
  ANATOMY_LEGEND,
  ANATOMY_PARTS,
  ANATOMY_RECORD_ID,
  describeRecordAnatomy,
  RecordAnatomy,
  RecordAnatomySheet,
} from "./record-anatomy";

async function anatomyRecord() {
  const corpus = await loadCorpus();
  const record = corpus.records.find(({ id }) => id === ANATOMY_RECORD_ID);
  if (record === undefined) throw new Error(`${ANATOMY_RECORD_ID} is missing`);
  return record;
}

describe("record anatomy illustration", () => {
  it("renders a real corpus record with every numbered label", async () => {
    const record = await anatomyRecord();
    expect(record.evidence.length).toBeGreaterThan(1);
    expect(record.corroboration).toBeDefined();
    const html = renderToStaticMarkup(<RecordAnatomy record={record} />);
    for (const part of ANATOMY_PARTS) {
      expect(html).toContain(`data-part="${part}"`);
    }
    expect(html).toContain(`/records/${record.id}`);
    expect(html).toContain("Illustration of a real record");
  });

  it("is one image with a description and no headings inside it", async () => {
    const record = await anatomyRecord();
    const sheet = renderToStaticMarkup(<RecordAnatomySheet record={record} />);
    assertRoleImgWithLabel(sheet, "record anatomy");
    assertNoHeadings(sheet, "record anatomy");
    expect(sheet).toContain("data-nosnippet");
  });

  it("describes the same evidence rows the picture shows", async () => {
    const record = await anatomyRecord();
    const describe = describeRecordAnatomy(record);
    expect(describe).toContain(record.title);
    expect(describe).toContain(`${record.evidence.length} evidence rows`);
  });

  it("names the site's kinds of evidence in the legend", () => {
    for (const label of Object.values(STRATUM_LABELS)) {
      expect(ANATOMY_LEGEND.stratum.text).toContain(label);
    }
    expect(Object.keys(STRATUM_LABELS)).toHaveLength(5);
    expect(ANATOMY_LEGEND.stratum.text).toContain("one of five kinds");
  });

  it("uses no em dashes in the legend", () => {
    for (const { term, text } of Object.values(ANATOMY_LEGEND)) {
      expect(`${term} ${text}`).not.toContain("—");
    }
  });
});
