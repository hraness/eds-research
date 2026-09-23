import { loadCorpus, loadSubtypes } from "@/lib/content";
import { subtypeIds } from "@/lib/eds-schema";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { JsonLdScript } from "@hraness/web-discovery/json-ld";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  describe,
  GENETIC_STATUS_LABELS,
  INHERITANCE_LABELS,
  SUBTYPE_LABELS,
} from "../../display";
import { RecordItem } from "../../record-view";
import { breadcrumbJsonLd, webPageJsonLd } from "../../seo";
import { absoluteSiteUrl, socialMetadata } from "../../site";

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
  const [subtype, corpus] = await Promise.all([resolve(id), loadCorpus()]);
  if (subtype === undefined) notFound();

  const related = corpus.records.filter(
    (record) =>
      record.subtypes.includes(subtype.id) ||
      record.subtypes.includes("all-eds"),
  );

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
        })}
        id="eds-subtype-webpage"
      />
      <p className="eyebrow">Subtype</p>
      <h1 className="page-title">
        {subtype.name} ({subtype.abbreviation})
      </h1>
      <p className="page-lede">{subtype.summary}</p>
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
            <th scope="row">Reviewed</th>
            <td>{subtype.reviewed_at}</td>
          </tr>
        </tbody>
      </table>

      <section className="section">
        <h2 className="section-title">Related records</h2>
        <p className="section-sub">
          Records scoped to {SUBTYPE_LABELS[subtype.id]} or to all EDS types.
        </p>
        {related.length === 0 ? (
          <p className="section-sub">No records cover this type yet.</p>
        ) : (
          <ul className="record-list">
            {related.map((record) => (
              <RecordItem key={record.id} record={record} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
