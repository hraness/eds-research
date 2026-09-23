"use client";

export default function Error({
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <article className="prose">
      <h1 className="page-title">Something went wrong</h1>
      <p>
        This page did not load. The data behind it is unaffected, and every
        file is listed at <a href="/eds/data">/eds/data</a>.
      </p>
      <p>
        <button
          onClick={reset}
          style={{
            background: "var(--ink)",
            border: "none",
            borderRadius: "0.4rem",
            color: "var(--bg)",
            cursor: "pointer",
            fontFamily: "var(--sans)",
            fontSize: "0.9rem",
            padding: "0.55rem 1.1rem",
          }}
          type="button"
        >
          Try again
        </button>
      </p>
    </article>
  );
}
