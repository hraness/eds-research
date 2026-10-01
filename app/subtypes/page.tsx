import { loadSubtypes } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { JsonLdScript } from "@hraness/web-discovery/json-ld";
import type { Metadata } from "next";

import { GENETIC_STATUS_LABELS, INHERITANCE_LABELS } from "../display";
import { collectionPageJsonLd } from "../seo";
import { absoluteSiteUrl, publicSitePath, socialMetadata } from "../site";
import { Byline } from "../byline";

export const dynamic = "force-static";

const TITLE = "Ehlers-Danlos syndrome types and HSD";
const DESCRIPTION =
  "The 13 Ehlers-Danlos syndrome types in the 2017 classification, plus hypermobility spectrum disorder: genes, inheritance, prevalence, and key features.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/subtypes") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/subtypes"),
  };
}

export default async function SubtypesPage() {
  const subtypes = await loadSubtypes();
  return (
    <>
      <JsonLdScript
        data={collectionPageJsonLd(
          subtypes.map(({ id, name }) => ({
            path: `/subtypes/${id}` as const,
            title: name,
          })),
          {
            description: DESCRIPTION,
            path: "/subtypes",
            reviewedAt: [...subtypes.map((s) => s.reviewed_at)].sort().at(-1),
            title: TITLE,
          },
        )}
        id="eds-subtypes-structured-data"
      />
      <h1 className="page-title">EDS subtypes</h1>
      <p className="page-lede">
        The 2017 International Classification defines thirteen types of EDS.
        Twelve have known causative genes and can be confirmed with a genetic
        test. hEDS, the most common, is still diagnosed from clinical signs
        alone. Hypermobility spectrum disorder (HSD) covers people with
        symptomatic joint hypermobility who do not meet the hEDS criteria.
      </p>
      <Byline />
      <ul className="record-list">
        {subtypes.map((subtype) => (
          <li className="record-item" key={subtype.id}>
            <div className="record-item__head">
              <h2 className="record-item__title">
                <a href={publicSitePath(`/subtypes/${subtype.id}`)}>
                  {subtype.name}
                </a>
              </h2>
              <span className="badge badge--kind">{subtype.abbreviation}</span>
              <span className="badge badge--kind">
                {GENETIC_STATUS_LABELS[subtype.genetic_status]}
              </span>
            </div>
            <p className="record-item__summary">{subtype.summary}</p>
            <p className="record-item__meta">
              {INHERITANCE_LABELS[subtype.inheritance]}
              {subtype.genes.length > 0
                ? ` · ${subtype.genetic_status === "candidate-emerging" ? "candidate gene " : ""}${subtype.genes.join(", ")}`
                : ""}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
