import { expect, test } from "bun:test";
import { securityHeaders } from "./next-config.ts";

test("security headers cover sniffing, referrers, permissions, and HSTS", () => {
  const keys = securityHeaders.map((header) => header.key);
  for (const key of [
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Strict-Transport-Security",
  ]) {
    expect(keys).toContain(key);
  }
});
