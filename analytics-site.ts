import type { PostHogSiteDefinition } from "@hraness/posthog";

export const analyticsSite = {
  "id": "eds-research",
  "canonicalDomain": "hraness.com",
  "allowedHosts": [
    "hraness.com",
    "www.hraness.com"
  ],
  "schemaVersion": 2,
  "routes": [
    {
      "match": "exact",
      "path": "/eds",
      "pageKind": "home"
    },
    {
      "match": "prefix",
      "path": "/eds",
      "pageKind": "research"
    }
  ],
  "sensitivePaths": [
    {
      "match": "prefix",
      "path": "/eds/auth"
    },
    {
      "match": "prefix",
      "path": "/account"
    }
  ],
  "customEvents": [
    "cta clicked",
    "outbound link opened"
  ],
  "allowedPaths": [
    {
      "match": "prefix",
      "path": "/eds"
    }
  ]
} as const satisfies PostHogSiteDefinition;

/** Only bounded semantic names reach analytics; URLs and link text are never event IDs. */
export function analyticsCtaForUrl(url: URL): string {
  if (url.hostname.replace(/^www\./, "") === "github.com") return "github";
  if (["/install", "/download"].includes(url.pathname.replace(/\/$/, "")) || url.hash === "#install") return "install";
  if (url.pathname === "/docs" || url.pathname.startsWith("/docs/")) return "docs";
  if (url.pathname === "/compare" || url.pathname.startsWith("/compare/")) return "compare";
  if (url.pathname === "/connect") return "connect";
  if (url.pathname === "/use-cases" || url.hash === "#use") return "use_cases";
  return "get_started";
}
