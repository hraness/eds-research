import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { absoluteSiteUrl, GITHUB_REPOSITORY_URL, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Contact and corrections";
const DESCRIPTION =
  "How to send corrections, source suggestions, and scope notes to the EDS Research Index.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/contact") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/contact"),
  };
}

export default function ContactPage() {
  return (
    <article className="prose">
      <h1 className="page-title">Contact and corrections</h1>
      <p className="page-lede">
        Corrections are a first-class input to this index. If a record misstates
        its evidence, mis-scopes a subtype, or mislabels a stratum, that is a
        bug — the corpus is public, the validation is deterministic, and the
        fix lands in the ledger.
      </p>

      <h2>Corrections and source suggestions</h2>
      <p>
        Open an issue or pull request at{" "}
        <a href={GITHUB_REPOSITORY_URL}>github.com/hraness/eds-research</a>. For
        a correction, cite the record ID and the source that contradicts it.
        For a suggested source, the canonical URL and publication date are what
        the admission pipeline needs.
      </p>

      <h2>What corrections do</h2>
      <p>
        The corpus is append-only at the ledger level: a correction lands as a
        new run entry naming what changed and why. A record found to be wrong is
        marked refuted or revised with its history intact — it is not silently
        rewritten.
      </p>

      <h2>What this channel is not for</h2>
      <p>
        Personal medical questions cannot be answered here. Community evidence
        is indexed at venue level only — please do not send screenshots or
        quotes of identifiable patient posts.
      </p>
    </article>
  );
}
