import type { NextConfig } from "next";
import {
  type ProductionDeliveryProofEnvironment,
  withProductionDeliveryProof,
} from "@hraness/vercel-delivery";

const nextConfig = {
  basePath: "/eds",
  async headers() {
    const noindexHeaders = [{ key: "X-Robots-Tag", value: "noindex, follow" }];
    return [
      { headers: noindexHeaders, source: "/eds-corpus/:path*" },
      { headers: noindexHeaders, source: "/research/:path*.yml" },
      { headers: [{ key: "Vary", value: "Accept" }], source: "/" },
      { headers: [{ key: "Vary", value: "Accept" }], source: "/:path*" },
    ];
  },
  reactStrictMode: true,
} satisfies NextConfig;

export function createNextConfig(
  environment: ProductionDeliveryProofEnvironment = process.env,
): NextConfig {
  return withProductionDeliveryProof(nextConfig, {
    environment,
    projectName: "eds-research",
  });
}

export default function configForPhase(): NextConfig {
  return createNextConfig();
}
