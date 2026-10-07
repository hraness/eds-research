import { expect, test } from "bun:test";
import { securityHeaders } from "./next-config.ts";

test("security headers cover sniffing, referrers, permissions, and framing", () => {
  const keys = securityHeaders.map((header) => header.key);
  for (const key of [
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Strict-Transport-Security",
    "Content-Security-Policy",
  ]) {
    expect(keys).toContain(key);
  }
  expect(
    securityHeaders.find((h) => h.key === "Content-Security-Policy")?.value,
  ).toContain("frame-ancestors");
});
