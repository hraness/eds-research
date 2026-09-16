"use client";

export default function Error({
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <article className="prose">
      <h1 className="page-title">Something went wrong</h1>
      <p>
        The page failed to render. The underlying corpus is unaffected — the
        dataset is always available under <a href="/eds/data">/eds/data</a>.
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
