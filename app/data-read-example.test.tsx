import { describe, expect, test } from "bun:test";
import { copyFileSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";

import { EDS_CORPUS_SCHEMA_VERSION } from "@/lib/eds-schema";
import {
  DATA_READ_EXAMPLE_COMMANDS,
  DATA_READ_EXAMPLE_FILE,
  DATA_READ_EXAMPLE_LINE,
} from "./data-files";
import DataPage from "./data/page";
import SourcesPage from "./sources/page";

const root = join(import.meta.dir, "..");

function documentedScript(): string {
  const command = DATA_READ_EXAMPLE_COMMANDS.at(-1) ?? "";
  const match = /^bun -e '(.*)'$/u.exec(command);
  if (match?.[1] === undefined) throw new Error("The last documented command must be a bun -e script.");
  return match[1];
}

describe("EDS data reading example", () => {
  test("prints the documented first line and sample line from the published files", () => {
    const directory = mkdtempSync(join(tmpdir(), "eds-read-example-"));
    try {
      copyFileSync(join(root, "public/eds-corpus", DATA_READ_EXAMPLE_FILE), join(directory, DATA_READ_EXAMPLE_FILE));
      copyFileSync(join(root, "public/research/sources.yml"), join(directory, "sources.yml"));
      symlinkSync(join(root, "node_modules"), join(directory, "node_modules"), "dir");
      const result = Bun.spawnSync([process.execPath, "-e", documentedScript()], { cwd: directory });
      const lines = result.stdout.toString().trim().split("\n");

      expect(result.exitCode).toBe(0);
      expect(lines[0]).toBe(`${EDS_CORPUS_SCHEMA_VERSION} historiography`);
      expect(lines).toContain(DATA_READ_EXAMPLE_LINE);
      expect(lines.some((line) => line.includes("unknown source-"))).toBe(false);
    } finally {
      rmSync(directory, { force: true, recursive: true });
    }
  });

  test("downloads the published files from their public addresses", () => {
    expect(DATA_READ_EXAMPLE_COMMANDS.slice(0, 3)).toEqual([
      "curl --fail --location --remote-name https://hraness.com/eds/eds-corpus/historiography.yml",
      "curl --fail --location --remote-name https://hraness.com/eds/research/sources.yml",
      "bun add yaml",
    ]);
  });

  test("shows the commands and field notes on the data page", () => {
    const html = renderToStaticMarkup(<DataPage />);

    expect(html).toContain("<h2>Read a record file</h2>");
    expect(html).toContain("https://hraness.com/eds/eds-corpus/historiography.yml");
    expect(html).toContain("<code>criteria_era</code>");
    expect(html).toContain("<code>reviewed_at</code>");
    expect(html).toContain('href="/eds/sources"');
    expect(html.indexOf("Read a record file")).toBeLessThan(html.indexOf("<h2>License</h2>"));
  });

  test("explains the source catalog labels and links each one to its reference", async () => {
    const html = renderToStaticMarkup(await SourcesPage());

    expect(html).toContain('id="source-key-title"');
    for (const label of ["Kind of evidence", "Evidence level", "Date and access", "Source ID", "Last checked"]) {
      expect(html).toContain(`<th scope="row">${label}</th>`);
    }
    expect(html).toContain('href="/eds/methodology"');
    expect(html).toContain('href="/eds/data"');
    expect(html).toContain('href="/eds/research"');
    expect(html).toContain('href="/eds/records/dx-heds-remains-clinical"');
    expect(html).toContain("cites clinical, community, and registry sources");
    expect(html).toContain("It is not a clinical review.");
  });
});
