import { defineSocialImageSite } from "@hraness/web-discovery/social-image/card";

/**
 * The site's app icon, byte-for-byte the same SVG as `app/icon.svg` (the
 * favicon and manifest icon). Checked in as text so every route that needs
 * the social-image declaration can use it without reading the filesystem.
 */
export const APP_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#1c1a17"/>
  <circle cx="32" cy="32" r="17" fill="none" stroke="#faf9f7" stroke-width="3.5"/>
  <path d="M32 15 L32 49 M15 32 L49 32" stroke="#faf9f7" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
  <circle cx="32" cy="32" r="7" fill="#7fb0d9"/>
</svg>
`;

/** The name drawn on the share card (see below). */
export const SOCIAL_CARD_NAME = "EDS Research" as const;

/**
 * The one social-image declaration for this site. Every Open Graph and
 * Twitter image is rendered from it by the shared @hraness/web-discovery
 * template; routes pass page copy only.
 *
 * The card name is the short form "EDS Research": the full product name
 * "EDS Research Index" wraps onto two lines in the card's name slot. The
 * domain and icon on the card carry the rest of the identity.
 */
export const socialSite = defineSocialImageSite({
  description: "Ehlers-Danlos research, sorted by kind of evidence.",
  domain: "hraness.com/eds",
  icon: {
    kind: "app",
    src: `data:image/svg+xml;base64,${Buffer.from(APP_ICON_SVG, "utf8").toString("base64")}`,
  },
  name: SOCIAL_CARD_NAME,
  theme: {
    accent: "#2c5f8a",
    background: "#faf9f7",
    foreground: "#1c1a17",
    muted: "#57534b",
  },
});
