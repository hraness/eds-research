import { HranessSiteFooter } from "@hraness/site-footer/react";
import { GITHUB_REPOSITORY_URL, publicSitePath } from "./site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__resources">
          <span className="site-footer__resources-label">EDS Research Index</span>
          <nav aria-label="site links">
            <a href={publicSitePath("/research")}>Research program</a>
            <a href={publicSitePath("/data")}>Data</a>
            <a href={publicSitePath("/about")}>About</a>
            <a href={publicSitePath("/contact")}>Contact</a>
            <a href={publicSitePath("/privacy")}>Privacy</a>
            <a href={GITHUB_REPOSITORY_URL}>GitHub</a>
          </nav>
        </div>
      </div>
      <HranessSiteFooter
        mailingList={{ kind: "signup", audience: "hraness" }}
        placement="flow"
        support={{
          id: "hraness",
          name: "Hraness",
          updates: true,
          valueProposition:
            "Support independent research and ongoing development of Hraness tools.",
        }}
      />
    </footer>
  );
}
