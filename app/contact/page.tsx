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
        If a record gets its evidence, EDS type, or kind of source wrong, please
        tell us. The data is public, and each correction is logged with what
        changed and why.
      </p>

      <h2>Corrections and source suggestions</h2>
      <p>
        Open an issue or pull request at{" "}
        <a href={GITHUB_REPOSITORY_URL}>github.com/hraness/eds-research</a>. For
        a correction, cite the record ID and the source that contradicts it.
        For a new source, send its URL and publication date.
      </p>

      <h2>What corrections do</h2>
      <p>
        Each correction is added to the change log as a new entry that names
        what changed and why. A record found to be wrong is marked refuted, or
        revised with the change logged; it is not silently rewritten.
      </p>

      <h2>What this channel is not for</h2>
      <p>
        Personal medical questions cannot be answered here. Community evidence
        is recorded by venue only, so please do not send screenshots or quotes
        of identifiable patient posts.
      </p>
    </article>
  );
}
