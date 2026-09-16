import { loadCorpus } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { JsonLdScript } from "@hraness/web-discovery/json-ld";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RecordItem } from "../../record-view";
import { breadcrumbJsonLd, collectionPageJsonLd } from "../../seo";
import { absoluteSiteUrl, socialMetadata } from "../../site";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const corpus = await loadCorpus();
  return corpus.categories.map(({ id }) => ({ category: id }));
}

interface PageProps {
  params: Promise<{ category: string }>;
}

async function resolve(categoryId: string) {
  const corpus = await loadCorpus();
  const category = corpus.categories.find(({ id }) => id === categoryId);
  if (category === undefined) return undefined;
  return {
    category,
    records: corpus.records.filter(
      (record) => record.categoryId === categoryId,
    ),
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const resolved = await resolve(category);
  if (resolved === undefined) return {};
  const title = resolved.category.label;
  return {
    title,
    description: resolved.category.description,
    alternates: { canonical: absoluteSiteUrl(`/topics/${category}`) },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(
      `${title} | hraness.com/eds`,
      resolved.category.description,
      `/topics/${category}`,
    ),
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const resolved = await resolve(category);
  if (resolved === undefined) notFound();

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "EDS Research Index", path: "/" },
            { name: resolved.category.label, path: `/topics/${category}` },
          ]),
          collectionPageJsonLd(resolved.records, {
            description: resolved.category.description,
            path: `/topics/${category}`,
            title: resolved.category.label,
          }),
        ]}
        id="eds-category-structured-data"
      />
      <h1 className="page-title">{resolved.category.label}</h1>
      <p className="page-lede">{resolved.category.description}</p>
      <ul className="record-list">
        {resolved.records.map((record) => (
          <RecordItem key={record.id} record={record} />
        ))}
      </ul>
    </>
  );
}
