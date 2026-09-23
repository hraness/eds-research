import { publicSitePath } from "./site";

export default function NotFound() {
  return (
    <article className="prose">
      <h1 className="page-title">Not found</h1>
      <p>
        There is no page at this address. Record addresses do not change, so
        the link may be mistyped. Try the{" "}
        <a href={publicSitePath("/")}>index</a>, the{" "}
        <a href={publicSitePath("/sources")}>source catalog</a>, or the{" "}
        <a href={publicSitePath("/data")}>data files</a>.
      </p>
    </article>
  );
}
