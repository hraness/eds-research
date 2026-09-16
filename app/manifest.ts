import type { MetadataRoute } from "next";
import { publicSitePath, site } from "./site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: publicSitePath("/"),
    name: site.indexTitle,
    short_name: site.applicationName,
    description: site.description,
    start_url: publicSitePath("/"),
    scope: `${publicSitePath("/")}/`,
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#faf9f7",
    icons: [
      {
        src: publicSitePath("/icon.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
