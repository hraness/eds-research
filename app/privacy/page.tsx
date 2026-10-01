import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import type { Metadata } from "next";

import { absoluteSiteUrl, socialMetadata } from "../site";

export const dynamic = "force-static";

const TITLE = "EDS Research Index privacy";
const DESCRIPTION =
  "The EDS Research Index uses PostHog for visits and errors, and Hraness Accounts for signup and regional consent notices.";

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
        You can read the index without an account. The site uses PostHog to
        measure visits, selected link clicks, performance, and errors. Email
        signup and regional consent checks use Hraness Accounts.
      </p>

      <h2>What the site collects</h2>
      <p>
        PostHog receives page visits, selected link clicks, performance
        measurements, and error reports from the public site. Analytics uses
        memory-only state rather than tracking cookies, does not create
        person profiles or record sessions, and respects Do Not Track and
        your analytics preferences. Standard hosting logs are handled by the
        hosting provider under its own policy.
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
        The site has no medical-record uploads or personal-health
        questionnaires. Please omit medical records and personal health details
        from correction requests.
      </p>
    </article>
  );
}
