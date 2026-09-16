#!/usr/bin/env bun
/**
 * Print the stable source ID for a URL (+ optional publication date).
 *
 *   bun run scripts/source-id.ts <url> [published-at]
 *   bun run scripts/source-id.ts --batch <<'EOF'
 *   <url>\t<published-at?>
 *   ...
 *   EOF
 */
import { stableResearchSourceId } from "../lib/source-identity";

const args = process.argv.slice(2);

if (args[0] === "--batch") {
  const input = await new Response(Bun.stdin.stream()).text();
  for (const line of input.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "") continue;
    const [url, publishedAt] = trimmed.split("\t");
    if (url === undefined) continue;
    console.log(
      `${stableResearchSourceId(url, publishedAt === "" ? undefined : publishedAt)}\t${url}${publishedAt ? `\t${publishedAt}` : ""}`,
    );
  }
} else {
  const [url, publishedAt] = args;
  if (url === undefined) {
    console.error("usage: bun run scripts/source-id.ts <url> [published-at]");
    process.exit(1);
  }
  console.log(stableResearchSourceId(url, publishedAt));
}
