import { loadCorpus } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { JsonLdScript } from "@hraness/web-discovery/json-ld";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RecordDetail } from "../../record-view";
import { breadcrumbJsonLd } from "../../seo";
import { absoluteSiteUrl, socialMetadata } from "../../site";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const corpus = await loadCorpus();
  return corpus.records.map(({ id }) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function resolve(id: string) {
  const corpus = await loadCorpus();
  return corpus.records.find((record) => record.id === id);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const record = await resolve(id);
  if (record === undefined) return {};
  return {
    title: record.title,
    description: record.summary.slice(0, 300),
    alternates: { canonical: absoluteSiteUrl(`/records/${id}`) },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(
      `${record.title} | hraness.com/eds`,
      record.summary.slice(0, 200),
      `/records/${id}`,
    ),
  };
}

export default async function RecordPage({ params }: PageProps) {
  const { id } = await params;
  const record = await resolve(id);
  if (record === undefined) notFound();

  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "EDS Research Index", path: "/" },
          {
            name: record.categoryLabel,
            path: `/topics/${record.categoryId}`,
          },
          { name: record.title, path: `/records/${record.id}` },
        ])}
        id="eds-record-breadcrumb"
      />
      <RecordDetail record={record} />
    </>
  );
}
