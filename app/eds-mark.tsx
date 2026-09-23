/**
 * Inline product mark for the social image: the same ringed-index motif as
 * `app/icon.svg`: a ringed record point on crosshair axes. Rendered in
 * currentColor inside the shared card's top bar.
 */
export function EdsMark() {
  return (
    <svg
      aria-label="EDS Research Index"
      height="42"
      role="img"
      viewBox="0 0 36 36"
      width="42"
    >
      <circle
        cx="18"
        cy="18"
        fill="none"
        r="11.5"
        stroke="currentColor"
        strokeWidth="2.6"
      />
      <path
        d="M18 3.5v5M18 27.5v5M3.5 18h5M27.5 18h5"
        fill="none"
        opacity="0.55"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
      <circle cx="18" cy="18" fill="#2c5f8a" r="4.6" />
    </svg>
  );
}
