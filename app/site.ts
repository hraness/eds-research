import type { Metadata } from "next";

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

const SITE_TAGLINE = "Ehlers-Danlos research, sorted by kind of evidence.";

export const site = {
  applicationName: "EDS Research Index",
  datasetDescription:
    "The YAML files behind the EDS Research Index: the source catalog, research records, subtype registry, searches for new evidence, open questions, and the log of every change.",
  description:
    "EDS Research Index is an independent, open-source index of Ehlers-Danlos syndromes research that links each record's sources and labels the kind of evidence.",
  domain: SITE_LABEL,
  indexTitle: "EDS Research Index",
  name: "EDS Research Index",
  socialImageAlt: `EDS Research Index at ${SITE_LABEL}: ${SITE_TAGLINE}`,
  tagline: SITE_TAGLINE,
  title: `EDS Research Index | ${SITE_LABEL}`,
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
