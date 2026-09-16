import { JsonLdScript } from "@hraness/web-discovery/json-ld";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@hraness/site-footer/stylex.css";
import "./globals.css";
import { siteOrganizationJsonLd, websiteJsonLd } from "./seo";
import { absoluteSiteUrl, SITE_HOST_ORIGIN, site } from "./site";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_HOST_ORIGIN),
  title: {
    default: site.applicationName,
    template: site.titleTemplate,
  },
  applicationName: site.applicationName,
  formatDetection: { address: false, email: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    images: [
      {
        alt: site.socialImageAlt,
        height: 630,
        url: absoluteSiteUrl("/opengraph-image"),
        width: 1200,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      { alt: site.socialImageAlt, url: absoluteSiteUrl("/opengraph-image") },
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { color: "#faf9f7", media: "(prefers-color-scheme: light)" },
    { color: "#171512", media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-US">
      <body>
        <JsonLdScript
          data={[websiteJsonLd(), siteOrganizationJsonLd()]}
          id="eds-research-website-structured-data"
        />
        <div className="site-shell">
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
