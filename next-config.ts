import type { NextConfig } from "next";
import {
  type ProductionDeliveryProofEnvironment,
  withProductionDeliveryProof,
} from "@hraness/vercel-delivery";

// A full script-src policy needs nonces for Next's inline bootstrap scripts,
// so only the directive that is safe without them is set here.
export const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig = {
  basePath: "/eds",
  async headers() {
    const noindexHeaders = [{ key: "X-Robots-Tag", value: "noindex, follow" }];
    return [
      { headers: securityHeaders, source: "/:path*" },
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
