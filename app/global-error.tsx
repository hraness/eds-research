"use client";

import { SiteExceptionAnalytics } from "./site-analytics";

import { productMessaging } from "./product-messaging";

export default function GlobalError({
  error,
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <html lang="en-US">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1.5rem" }}>
      <SiteExceptionAnalytics error={error} />
        <h1>{productMessaging.names.name}</h1>
        <p>The site did not load. The data files are unaffected.</p>
        <button onClick={reset} type="button">
          Try again
        </button>
      </body>
    </html>
  );
}
