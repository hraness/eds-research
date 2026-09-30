import { defineSocialImageSite, type SocialImagePage } from "@hraness/web-discovery/social-image/card";
import { productMessaging } from "./product-messaging";

/**
 * The one social-image declaration for this site. Every Open Graph and
 * Twitter image is rendered from it by the shared @hraness/web-discovery
 * template; routes pass page copy only.
 *
 * The card draws the site header: the site has no Design Kit palette and its
 * header shows the product name as text with no mark, so the card gets no
 * `brandMark` and a theme taken from the `:root` colours in `globals.css`.
 */
export const socialSite = defineSocialImageSite({
  brand: productMessaging.names.name,
  description: productMessaging.tagline,
  domain: "hraness.com/eds",
  keepTogether: [productMessaging.names.name],
  name: productMessaging.names.name,
  theme: {
    accent: "#2c5f8a",
    background: "#faf9f7",
    foreground: "#1c1a17",
    headerBackground: "#faf9f7",
    line: "#e4e0d8",
    muted: "#57534b",
  },
});

/**
 * The home card is the hero: its eyebrow and headline under the header. The
 * hero summary is too long for the card, so the card leaves it out.
 */
export const homeSocialPage: SocialImagePage = {
  description: "",
  eyebrow: productMessaging.category,
  headline: productMessaging.hero.heading,
  layout: "product",
};
