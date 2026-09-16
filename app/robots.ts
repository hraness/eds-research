import type { MetadataRoute } from "next";
import { absoluteSiteUrl, publicSitePath, SITE_HOST_ORIGIN } from "./site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: `${publicSitePath("/")}/`,
    },
    host: SITE_HOST_ORIGIN,
    sitemap: absoluteSiteUrl("/sitemap.xml"),
  };
}
