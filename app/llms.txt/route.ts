import { CORPUS_FILES, RESEARCH_FILES } from "../data-files";
import { absoluteSiteUrl, site } from "../site";

export const dynamic = "force-static";

const LINES = [
  `# ${site.name}`,
  "",
  `> ${site.description}`,
  "",
  "Ehlers-Danlos syndromes are underdiagnosed and the research is",
  "scattered across journals, registries, and patient communities. EDS",
  "Research Index is an independent, open-source index that collects the",
  "research record by record. Each entry links its sources and labels the",
  "kind of evidence behind it, so a reader can tell a cohort study from a",
  "case report. It is a reference, not medical advice, built by Hraness",
  "and published in the open.",
  "",
  "Each record labels its evidence by kind (clinical, community,",
  "historical, registry, or gray literature) and by level within that",
  "kind. Community material is summarized by venue and labeled as patient",
  "reports. Historical and folk records describe what was done, not what",
  "works.",
  "",
  "## Pages",
  "",
  `- [Index](${absoluteSiteUrl("/")}): overview and records where kinds of evidence agree`,
  `- [Subtypes](${absoluteSiteUrl("/subtypes")}): the 13 types in the 2017 classification plus HSD`,
  `- [Timeline](${absoluteSiteUrl("/timeline")}): how the idea of EDS changed over time`,
  `- [Practices](${absoluteSiteUrl("/practices")}): management and folk practice, with known risks`,
  `- [Community](${absoluteSiteUrl("/community")}): patterns reported in patient venues`,
  `- [Sources](${absoluteSiteUrl("/sources")}): every cited source, by kind of evidence`,
  `- [Methodology](${absoluteSiteUrl("/methodology")}): how evidence is sorted, graded, and reviewed`,
  `- [Research](${absoluteSiteUrl("/research")}): open questions, searches, collections, and the change log`,
  `- [Data](${absoluteSiteUrl("/data")}): every YAML data file`,
  `- [About](${absoluteSiteUrl("/about")}): who publishes the index and the rules it follows`,
  "",
  "## Data files",
  "",
  ...CORPUS_FILES.map((file) => `- ${absoluteSiteUrl(`/eds-corpus/${file}`)}`),
  ...RESEARCH_FILES.map((file) => `- ${absoluteSiteUrl(`/research/${file}`)}`),
  "",
];

export function GET() {
  return new Response(`${LINES.join("\n")}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
