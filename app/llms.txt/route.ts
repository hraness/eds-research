import { absoluteSiteUrl, site } from "../site";

export const dynamic = "force-static";

const LINES = [
  `# ${site.name}`,
  "",
  `> ${site.description}`,
  "",
  "This is a research index, not medical advice. Records carry per-stratum",
  "evidence tiers; community material is venue-level and filed as reports,",
  "and historical/folk records document practice without endorsing it.",
  "",
  "## Surfaces",
  "",
  `- [Index](${absoluteSiteUrl("/")}): corpus overview and cross-stratum convergences`,
  `- [Subtypes](${absoluteSiteUrl("/subtypes")}): the 2017 classification plus HSD`,
  `- [Timeline](${absoluteSiteUrl("/timeline")}): the disease concept across criteria eras`,
  `- [Practices](${absoluteSiteUrl("/practices")}): management and folk practice with risk annotations`,
  `- [Community](${absoluteSiteUrl("/community")}): venue-level patient-knowledge signals`,
  `- [Sources](${absoluteSiteUrl("/sources")}): the canonical source catalog by stratum`,
  `- [Methodology](${absoluteSiteUrl("/methodology")}): strata, tiers, corroboration, lifecycle`,
  `- [Research](${absoluteSiteUrl("/research")}): monitors, questions, collections, run ledger`,
  `- [Data](${absoluteSiteUrl("/data")}): the open YAML corpus`,
  `- [About](${absoluteSiteUrl("/about")}): editorial position and independence`,
  "",
  "## Data files",
  "",
  `- ${absoluteSiteUrl("/eds/subtypes.yml")}`,
  `- ${absoluteSiteUrl("/research/sources.yml")}`,
  `- ${absoluteSiteUrl("/research/questions.yml")}`,
  `- ${absoluteSiteUrl("/research/publication-policy.yml")}`,
  "",
] as const;

export function GET() {
  return new Response(`${LINES.join("\n")}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
