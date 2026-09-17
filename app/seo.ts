import {
  absoluteSiteUrl,
  GITHUB_REPOSITORY_URL,
  HRANESS_URL,
  SITE_ORIGIN,
  site,
  type SitePath,
} from "./site";

export interface BreadcrumbItem {
  readonly name: string;
  readonly path: SitePath;
}

const publisherJsonLd = {
  "@type": "Organization",
  "@id": `${HRANESS_URL}#organization`,
  name: "Hraness",
  url: HRANESS_URL,
  sameAs: ["https://github.com/hraness"],
} as const;

export function siteOrganizationJsonLd() {
  const rootUrl = absoluteSiteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${rootUrl}#organization`,
    name: site.name,
    alternateName: site.domain,
    description: site.description,
    url: rootUrl,
    sameAs: [GITHUB_REPOSITORY_URL],
    parentOrganization: publisherJsonLd,
  } as const;
}

export function websiteJsonLd() {
  const rootUrl = absoluteSiteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${rootUrl}#website`,
    url: rootUrl,
    name: site.name,
    alternateName: site.domain,
    description: site.description,
    inLanguage: "en-US",
    publisher: publisherJsonLd,
    sameAs: [GITHUB_REPOSITORY_URL],
  } as const;
}

export function collectionPageJsonLd(
  items: readonly Readonly<{ id: string; title: string }>[],
  input: Readonly<{
    description: string;
    path: SitePath;
    reviewedAt?: string | undefined;
    title: string;
  }>,
) {
  const url = absoluteSiteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: input.title,
    description: input.description,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_ORIGIN}#website` },
    ...(input.reviewedAt !== undefined && { dateModified: input.reviewedAt }),
    hasPart: items.map((item) => ({
      "@type": "ListItem",
      name: item.title,
    })),
  } as const;
}

export function webPageJsonLd(
  input: Readonly<{
    citations?: readonly string[] | undefined;
    description: string;
    path: SitePath;
    reviewedAt?: string | undefined;
    title: string;
  }>,
) {
  const url = absoluteSiteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.title,
    description: input.description,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_ORIGIN}#website` },
    ...(input.reviewedAt !== undefined && { dateModified: input.reviewedAt }),
    ...(input.citations !== undefined &&
      input.citations.length > 0 && { citation: [...input.citations] }),
  } as const;
}

export function breadcrumbJsonLd(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: absoluteSiteUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  } as const;
}
