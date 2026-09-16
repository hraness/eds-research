import { createHash } from "node:crypto";

/**
 * Canonical identity for a research source. Normalizes the URL enough to
 * deduplicate mirrors and tracking parameters without pretending two
 * distinct documents are the same.
 */
export function canonicalResearchSourceIdentity(
  url: string,
  publishedAt: string | undefined,
): string {
  const parsed = new URL(url);
  const host = parsed.hostname.toLowerCase().replace(/^www\./u, "");
  const path = parsed.pathname.replace(/\/+$/u, "").toLowerCase();
  const params = [...parsed.searchParams.entries()]
    .filter(([key]) => !/^(utm_|fbclid|gclid|mc_)/iu.test(key))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `${host}${path}${params === "" ? "" : `?${params}`}|${publishedAt ?? ""}`;
}

export function stableResearchSourceId(
  url: string,
  publishedAt: string | undefined,
): string {
  const digest = createHash("sha256")
    .update(`eds-research/source/v1\n${canonicalResearchSourceIdentity(url, publishedAt)}`)
    .digest("hex");
  return `source-${digest.slice(0, 20)}`;
}
