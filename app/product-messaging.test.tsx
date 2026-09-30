import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import Home, { generateMetadata } from "./page";
import { productHeadings, productMessaging } from "./product-messaging";
import { site } from "./site";

test("uses the pinned product copy while preserving the medical notice and record evidence", async () => {
  expect(site.name).toBe(productMessaging.names.name);
  expect(generateMetadata().description).toBe(productMessaging.meta);
  const markup = renderToStaticMarkup(await Home());
  expect(markup).toContain(renderToStaticMarkup(<>{productMessaging.hero.heading}</>));
  expect(markup).toContain(renderToStaticMarkup(<>{productMessaging.hero.summary}</>));
  expect(markup).toContain(productHeadings.agreement);
  expect(markup).toContain("Not medical advice.");
  expect(markup).toContain("/eds/records/mgmt-lidocaine-resistance");
});
