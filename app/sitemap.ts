import { loadCorpus, loadSubtypes } from "@/lib/content";
import type { MetadataRoute } from "next";

import { absoluteSiteUrl, type SitePath } from "./site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [corpus, subtypes] = await Promise.all([loadCorpus(), loadSubtypes()]);

  const staticPaths: SitePath[] = [
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
  ];

  return [
    ...staticPaths.map((path) => ({ url: absoluteSiteUrl(path) })),
    ...corpus.categories.map(({ id }) => ({
      url: absoluteSiteUrl(`/topics/${id}`),
    })),
    ...corpus.records.map(({ id }) => ({
      url: absoluteSiteUrl(`/records/${id}`),
    })),
    ...subtypes.map(({ id }) => ({
      url: absoluteSiteUrl(`/subtypes/${id}`),
    })),
  ];
}
