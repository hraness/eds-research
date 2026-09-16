import { loadSubtypes } from "@/lib/content";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { JsonLdScript } from "@hraness/web-discovery/json-ld";
import type { Metadata } from "next";

import { collectionPageJsonLd } from "../seo";
import { absoluteSiteUrl, publicSitePath, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "EDS subtypes";
const DESCRIPTION =
  "All thirteen Ehlers-Danlos syndrome subtypes under the 2017 International Classification, plus hypermobility spectrum disorder — genes, inheritance, prevalence, and distinguishing features.";

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
          subtypes.map(({ id, name }) => ({ id, title: name })),
          { description: DESCRIPTION, path: "/subtypes", title: TITLE },
        )}
        id="eds-subtypes-structured-data"
      />
      <h1 className="page-title">Subtypes</h1>
      <p className="page-lede">
        The 2017 International Classification defines thirteen EDS subtypes.
        Twelve have confirmed molecular bases; hEDS — the most common — remains
        a clinical diagnosis. HSD sits beside them as the residual category for
        symptomatic hypermobility.
      </p>
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
                {subtype.genetic_status.replaceAll("-", " ")}
              </span>
            </div>
            <p className="record-item__summary">{subtype.summary}</p>
            <p className="record-item__meta">
              {subtype.inheritance.replaceAll("-", " ")}
              {subtype.genes.length > 0
                ? ` · ${subtype.genes.join(", ")}`
                : ""}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
