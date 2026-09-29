import { loadCorpus, loadResearch, loadSubtypes } from "@/lib/content";
import { subtypeIds } from "@/lib/eds-schema";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { JsonLdScript } from "@hraness/web-discovery/json-ld";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  describe,
  GENETIC_STATUS_LABELS,
  INHERITANCE_LABELS,
} from "../../display";
import { RecordItem, SourceLink } from "../../record-view";
import { breadcrumbJsonLd, webPageJsonLd } from "../../seo";
import { absoluteSiteUrl, publicSitePath, socialMetadata } from "../../site";
import { Byline } from "../../byline";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return subtypeIds
    .filter((id) => id !== "all-eds" && id !== "unspecified")
    .map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function resolve(id: string) {
  const subtypes = await loadSubtypes();
  return subtypes.find((subtype) => subtype.id === id);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const subtype = await resolve(id);
  if (subtype === undefined) return {};
  const title = `${subtype.name} (${subtype.abbreviation})`;
  const description = describe(subtype.summary);
  return {
    title,
    description,
    alternates: { canonical: absoluteSiteUrl(`/subtypes/${id}`) },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(
      `${title} | hraness.com/eds`,
      description,
      `/subtypes/${id}`,
    ),
  };
}

export default async function SubtypePage({ params }: PageProps) {
  const { id } = await params;
  const research = await loadResearch();
  const [subtypes, corpus] = await Promise.all([
    loadSubtypes(research),
    loadCorpus(research),
  ]);
  const subtype = subtypes.find((candidate) => candidate.id === id);
  if (subtype === undefined) notFound();

  const specific = corpus.records.filter((record) =>
    record.subtypes.includes(subtype.id),
  );
  const general = corpus.records.filter((record) =>
    record.subtypes.includes("all-eds"),
  );
  const sources = subtype.source_ids.flatMap((sourceId) => {
    const source = research.sourceById.get(sourceId);
    return source === undefined ? [] : [source];
  });

  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "EDS Research Index", path: "/" },
          { name: "Subtypes", path: "/subtypes" },
          { name: subtype.abbreviation, path: `/subtypes/${subtype.id}` },
        ])}
        id="eds-subtype-breadcrumb"
      />
      <JsonLdScript
        data={webPageJsonLd({
          title: `${subtype.name} (${subtype.abbreviation})`,
          description: subtype.summary,
          path: `/subtypes/${subtype.id}`,
          reviewedAt: subtype.reviewed_at,
          citations: sources.map((source) => source.url),
        })}
        id="eds-subtype-webpage"
      />
      <p className="eyebrow">Subtype</p>
      <h1 className="page-title">
        {subtype.name} ({subtype.abbreviation})
      </h1>
      <p className="page-lede">{subtype.summary}</p>
      <Byline />
      <div className="notice">
        <strong>Not medical advice.</strong> This page summarizes research and
        does not recommend any course of care.
      </div>
      <table className="meta-table">
        <tbody>
          <tr>
            <th scope="row">Classification</th>
            <td>
              {subtype.classification === "eds-2017"
                ? "2017 International Classification"
                : "Related hypermobility spectrum"}
            </td>
          </tr>
          <tr>
            <th scope="row">Inheritance</th>
            <td>{INHERITANCE_LABELS[subtype.inheritance]}</td>
          </tr>
          <tr>
            <th scope="row">Genes</th>
            <td>
              {subtype.genetic_status === "candidate-emerging"
                ? `None confirmed. Candidate: ${subtype.genes.join(", ")}`
                : subtype.genes.length > 0
                  ? subtype.genes.join(", ")
                  : "None confirmed"}
            </td>
          </tr>
          <tr>
            <th scope="row">Genetic status</th>
            <td>{GENETIC_STATUS_LABELS[subtype.genetic_status]}</td>
          </tr>
          {subtype.villefranche_equivalent !== undefined && (
            <tr>
              <th scope="row">Villefranche (1997)</th>
              <td>{subtype.villefranche_equivalent}</td>
            </tr>
          )}
          <tr>
            <th scope="row">Prevalence</th>
            <td>{subtype.prevalence_display}</td>
          </tr>
          <tr>
            <th scope="row">Distinguishing features</th>
            <td>{subtype.distinguishing_features}</td>
          </tr>
          <tr>
            <th scope="row">Last checked</th>
            <td>{subtype.reviewed_at}</td>
          </tr>
        </tbody>
      </table>

      {specific.length > 0 && (
        <section className="section">
          <h2 className="section-title">
            Records about {subtype.abbreviation}
          </h2>
          <ul className="record-list">
            {specific.map((record) => (
              <RecordItem key={record.id} record={record} />
            ))}
          </ul>
        </section>
      )}

      {general.length > 0 && (
        <section className="section">
          <h2 className="section-title">
            Records that apply to every EDS type
          </h2>
          <ul>
            {general.map((record) => (
              <li key={record.id}>
                <a href={publicSitePath(`/records/${record.id}`)}>
                  {record.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">Sources</h2>
        <ul className="source-list">
          {sources.map((source) => (
            <SourceLink key={source.id} source={source} />
          ))}
        </ul>
      </section>
    </>
  );
}
