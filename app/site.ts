import { socialImageAlt } from "@hraness/web-discovery/social-image/card";
import type { Metadata } from "next";

import { socialSite } from "./social";
import { productMessaging } from "./product-messaging";

export const SITE_DOMAIN = "hraness.com" as const;
export const SITE_HOST_ORIGIN = `https://${SITE_DOMAIN}` as const;
export const SITE_BASE_PATH = "/eds" as const;
export const SITE_ORIGIN = `${SITE_HOST_ORIGIN}${SITE_BASE_PATH}` as const;
export const SITE_LABEL = "hraness.com/eds" as const;
export const GITHUB_REPOSITORY_URL =
  "https://github.com/hraness/eds-research" as const;
export const HRANESS_URL = "https://hraness.com/" as const;

export type SitePath = `/${string}`;

export function publicSitePath(path: SitePath): string {
  return path === "/" ? SITE_BASE_PATH : `${SITE_BASE_PATH}${path}`;
}

export function absoluteSiteUrl(path: SitePath): string {
  return path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
}

export const site = {
  applicationName: productMessaging.names.name,
  /** Visible byline. Pages are drafted with AI assistance and credited to Hraness, never to a named human author. */
  author: "Hraness",
  draftingNote: "Drafted with AI assistance.",
  datasetDescription:
    `The YAML files behind the ${productMessaging.names.name}: the source catalog, research records, subtype registry, searches for new evidence, open questions, and the log of every change.`,
  description: productMessaging.meta,
  domain: SITE_LABEL,
  indexTitle: productMessaging.names.name,
  name: productMessaging.names.name,
  socialImageAlt: socialImageAlt(socialSite),
  tagline: productMessaging.tagline,
  title: `${productMessaging.names.name} | ${SITE_LABEL}`,
  titleTemplate: `%s | ${SITE_LABEL}`,
} as const;

export function socialMetadata(
  title: string,
  description: string,
  url: SitePath,
  image: Readonly<{
    alt?: string;
    path?: SitePath;
  }> = {},
): Pick<Metadata, "openGraph" | "twitter"> {
  const imageAlt = image.alt ?? site.socialImageAlt;
  const imagePath = image.path ?? "/opengraph-image";
  return {
    openGraph: {
      type: "website" as const,
      locale: "en_US",
      url: absoluteSiteUrl(url),
      siteName: site.name,
      title,
      description,
      images: [
        {
          alt: imageAlt,
          height: 630,
          url: absoluteSiteUrl(imagePath),
          width: 1200,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [{ alt: imageAlt, url: absoluteSiteUrl(imagePath) }],
    },
  };
}
