import {
  createSocialImageResponse,
  socialImageContentType,
  socialImageSize,
} from "@hraness/web-discovery/social-image";

import { EdsMark } from "./eds-mark";
import { site } from "./site";

export const dynamic = "force-static";
export const alt = site.socialImageAlt;
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function OpengraphImage() {
  return createSocialImageResponse({
    description: site.tagline,
    domain: site.domain,
    eyebrow: "Ehlers-Danlos syndromes",
    mark: <EdsMark />,
    theme: {
      accent: "#2c5f8a",
      background: "#faf9f7",
      foreground: "#1c1a17",
      muted: "#57534b",
    },
    title: site.name,
  });
}
