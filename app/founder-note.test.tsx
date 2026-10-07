import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import Home from "./page";

test("sets the founder note below the hero and above the medical notice", async () => {
  const markup = renderToStaticMarkup(await Home());
  const note = markup.indexOf('class="founder-note"');
  expect(note).toBeGreaterThan(markup.indexOf("hero-facts"));
  expect(note).toBeLessThan(markup.indexOf("Not medical advice."));
  expect(markup).toContain("so a reader can tell a cohort study from a case report.");
  expect(markup).toContain("https://hraness.com/eds".replace("https://", ""));
});
