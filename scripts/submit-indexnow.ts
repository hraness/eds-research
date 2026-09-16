import { loadCorpus, loadSubtypes } from "../lib/content";
import { absoluteSiteUrl, type SitePath } from "../app/site";

/*
 * Submits the canonical public URL set to IndexNow. Requires INDEXNOW_KEY
 * (a file named <key>.txt must be served at the site root for verification).
 * Usage: INDEXNOW_KEY=... bun run search:indexnow
 */
const key = process.env.INDEXNOW_KEY;
if (key === undefined || key === "") {
  console.error("INDEXNOW_KEY is required");
  process.exit(1);
}

const corpus = await loadCorpus();
const subtypes = await loadSubtypes();

const paths: SitePath[] = [
  "/",
  "/subtypes",
  "/timeline",
  "/practices",
  "/community",
  "/sources",
  "/methodology",
  "/research",
  "/data",
  "/about",
  "/contact",
  "/privacy",
  ...corpus.categories.map(
    ({ id }) => `/topics/${id}` as SitePath,
  ),
  ...corpus.records.map(({ id }) => `/records/${id}` as SitePath),
  ...subtypes.map(({ id }) => `/subtypes/${id}` as SitePath),
];

const urlList = paths.map((path) => absoluteSiteUrl(path));

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "hraness.com",
    key,
    keyLocation: absoluteSiteUrl(`/${key}.txt` as SitePath),
    urlList,
  }),
});

console.log(`Submitted ${urlList.length} URLs; status ${response.status}`);
if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}
