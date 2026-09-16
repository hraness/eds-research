"use client";

export default function GlobalError({
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <html lang="en-US">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1.5rem" }}>
        <h1>EDS Research Index</h1>
        <p>The site failed to render. The corpus is unaffected.</p>
        <button onClick={reset} type="button">
          Try again
        </button>
      </body>
    </html>
  );
}
