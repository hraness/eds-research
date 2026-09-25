import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "Privacy";
const DESCRIPTION =
  "What the EDS Research Index collects from readers, and what it does not.";

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
        This site is a static publication. Reading it needs no account, and
        the index collects nothing from readers beyond what any web server
        sees in a request. The shared Hraness footer is the one exception,
        described below.
      </p>

      <h2>What the site collects</h2>
      <p>
        The pages are pre-rendered static documents served through a CDN.
        There is no account system, no comment system, no tracker owned by
        this site, and no advertising. Standard hosting logs (request path,
        timestamp, user agent) are handled by the hosting provider under its
        own policy.
      </p>

      <h2>The shared Hraness footer</h2>
      <p>
        If you enter an email address in the footer, it goes to Hraness
        Accounts at account.hraness.com, which asks you to confirm before
        adding you to the Hraness mailing list. When a page loads, the footer
        asks account.hraness.com whether a consent notice applies in your
        region, and your browser keeps your answer in local storage. The
        Support link leads to optional Hraness membership. The{" "}
        <a href="https://hraness.com/privacy">Hraness privacy policy</a>{" "}
        covers all three.
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
