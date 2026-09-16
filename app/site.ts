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

export const site = {
  applicationName: "EDS Research Index",
  datasetDescription:
    "Open, source-linked YAML records behind the EDS research index: canonical sources across clinical, community, historical, registry, and gray strata; research records with per-stratum evidence attestations; subtype registry; discovery monitors; open questions; and the append-only run ledger.",
  description:
    "An independent, source-linked research index for the Ehlers-Danlos syndromes — peer-reviewed literature, corroborated community knowledge, registries and trials, and documented historical and folk practice, each with explicit evidence tiers and provenance.",
  domain: SITE_LABEL,
  indexTitle: "EDS Research Index",
  name: "EDS Research Index",
  socialImageAlt: `Ehlers-Danlos syndromes research index at ${SITE_LABEL}`,
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
