import {
  createSiteSocialImageResponse,
  socialImageAlt,
  socialImageContentType,
  socialImageSize,
} from "@hraness/web-discovery/social-image";

import { homeSocialPage, socialSite } from "./social";

export const dynamic = "force-static";
export const alt = socialImageAlt(socialSite);
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function OpengraphImage() {
  return createSiteSocialImageResponse(socialSite, homeSocialPage);
}
