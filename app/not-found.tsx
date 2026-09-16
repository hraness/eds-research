import { publicSitePath } from "./site";

export default function NotFound() {
  return (
    <article className="prose">
      <h1 className="page-title">Not found</h1>
      <p>
        This page does not exist in the index. The corpus is deterministic — if
        a record was here, its ID has not changed. Try the{" "}
        <a href={publicSitePath("/")}>index</a>, the{" "}
        <a href={publicSitePath("/sources")}>source catalog</a>, or the{" "}
        <a href={publicSitePath("/data")}>dataset</a>.
      </p>
    </article>
  );
}
