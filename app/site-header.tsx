import { publicSitePath } from "./site";

const NAV_LINKS = [
  { href: publicSitePath("/subtypes"), label: "subtypes" },
  { href: publicSitePath("/timeline"), label: "timeline" },
  { href: publicSitePath("/practices"), label: "practices" },
  { href: publicSitePath("/community"), label: "community knowledge" },
  { href: publicSitePath("/sources"), label: "source catalog" },
  { href: publicSitePath("/research"), label: "research program" },
  { href: publicSitePath("/methodology"), label: "methodology" },
  { href: publicSitePath("/about"), label: "about" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href={publicSitePath("/")}>
          EDS Research Index
        </a>
        <span className="site-header__domain">hraness.com/eds</span>
        <nav aria-label="primary" className="site-header__nav">
          {NAV_LINKS.map(({ href, label }) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
