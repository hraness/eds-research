import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Privacy";
const DESCRIPTION =
  "What the EDS Research Index collects — and, mostly, what it does not.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: absoluteSiteUrl("/privacy") },
    robots: INDEXABLE_ROBOTS,
    ...socialMetadata(`${TITLE} | hraness.com/eds`, DESCRIPTION, "/privacy"),
  };
}

export default function PrivacyPage() {
  return (
    <article className="prose">
      <h1 className="page-title">Privacy</h1>
      <p className="page-lede">
        This site is a static publication. It collects nothing from readers
        beyond what any web server sees in a request.
      </p>

      <h2>What the site collects</h2>
      <p>
        The pages are pre-rendered static documents served through a CDN. There
        is no account system, no comment system, no tracker owned by this site,
        and no advertising. Standard hosting logs — request path, timestamp,
        user agent — are handled by the hosting provider under its own policy.
      </p>

      <h2>Community sources</h2>
      <p>
        Community venues are cited at venue level only. The corpus never names,
        quotes, or profiles individual posters, and it does not republish
        threads. If you run an indexed venue and want it removed, see the
        contact page.
      </p>

      <h2>Health information</h2>
      <p>
        This site describes research; it does not ask for, store, or process
        any reader&apos;s health information. Do not send medical records or
        personal health details through any channel associated with this index.
      </p>
    </article>
  );
}
