import { publicSitePath, site } from "./site";

const NAV_LINKS = [
  { href: publicSitePath("/subtypes"), label: "Subtypes" },
  { href: publicSitePath("/timeline"), label: "Timeline" },
  { href: publicSitePath("/practices"), label: "Practices" },
  { href: publicSitePath("/community"), label: "Community" },
  { href: publicSitePath("/sources"), label: "Sources" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href={publicSitePath("/")}>
          {site.name}
        </a>
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
