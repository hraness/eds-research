import {
  createSocialImageResponse,
  socialImageContentType,
  socialImageSize,
} from "@hraness/web-discovery/social-image";

import { site } from "./site";

export const dynamic = "force-static";
export const alt = site.socialImageAlt;
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function OpengraphImage() {
  return createSocialImageResponse({
    description:
      "Peer-reviewed literature, corroborated community knowledge, registries and trials, and documented historical practice — with evidence tiers and provenance.",
    domain: site.domain,
    eyebrow: "Ehlers-Danlos syndromes",
    theme: {
      accent: "#2c5f8a",
      background: "#faf9f7",
      foreground: "#1c1a17",
      muted: "#57534b",
    },
    title: "EDS Research Index",
  });
}
