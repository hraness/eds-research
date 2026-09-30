import snapshot from "../portfolio-messaging.generated.json";

if (snapshot.contract !== "hraness.product-messaging/v1" || snapshot.productId !== "eds-research" || snapshot.canonicalUrl !== "https://hraness.com/eds") {
  throw new Error("The website needs its canonical EDS Research messaging snapshot.");
}

/** Pinned at refresh time; importing this module never fetches or rewrites copy. */
export const productMessaging = snapshot.messaging;
export const productHeadings = productMessaging.headings;
