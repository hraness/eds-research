import { site } from "./site";

export function Byline() {
  return (
    <p className="byline">
      By {site.author} · {site.draftingNote}
    </p>
  );
}
