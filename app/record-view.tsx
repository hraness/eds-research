import type { ResolvedRecord } from "@/lib/content";
import type { ResearchSource } from "@/lib/research-schema";
import {
  CORROBORATION_LABELS,
  CRITERIA_ERA_LABELS,
  displayDate,
  displayTier,
  KIND_LABELS,
  PRACTICE_KIND_LABELS,
  RISK_LABELS,
  STATUS_LABELS,
  STRATUM_LABELS,
  SUBTYPE_LABELS,
} from "./display";
import { publicSitePath } from "./site";

function SourceLink({ source }: Readonly<{ source: ResearchSource }>) {
  return (
    <li>
      <a href={source.url}>{source.title}</a>
      <span className="source-list__meta">
        {" "}
        · {source.publisher}
        {source.published_at !== undefined
          ? ` · ${source.published_at}`
          : ""}
        {source.access !== "public" ? ` · ${source.access}` : ""}
      </span>
    </li>
  );
}

export function RecordBadges({
  record,
}: Readonly<{ record: ResolvedRecord }>) {
  return (
    <>
      <span className={`badge badge--status-${record.status}`}>
        {STATUS_LABELS[record.status]}
      </span>
      <span className="badge badge--kind">{KIND_LABELS[record.kind]}</span>
      {record.corroboration !== undefined && (
        <span className="badge badge--kind">
          {CORROBORATION_LABELS[record.corroboration]}
        </span>
      )}
      {record.risk !== undefined && (
        <span className={`badge badge--risk-${record.risk.level}`}>
          {RISK_LABELS[record.risk.level]}
        </span>
      )}
    </>
  );
}

export function RecordItem({
  record,
}: Readonly<{ record: ResolvedRecord }>) {
  return (
    <li className="record-item">
      <div className="record-item__head">
        <h3 className="record-item__title">
          <a href={publicSitePath(`/records/${record.id}`)}>{record.title}</a>
        </h3>
        <RecordBadges record={record} />
      </div>
      <p className="record-item__summary">{record.summary}</p>
      <p className="record-item__meta">
        {[
          record.subtypes.map((id) => SUBTYPE_LABELS[id]).join(", "),
          record.date === undefined
            ? undefined
            : displayDate(record.date, record.date_precision),
          record.categoryLabel,
        ]
          .filter((part) => part !== undefined)
          .join(" · ")}
      </p>
    </li>
  );
}

export function EvidenceBlock({
  record,
}: Readonly<{ record: ResolvedRecord }>) {
  return (
    <section className="section">
      <h2 className="section-title">Evidence</h2>
      {record.evidence.map((attestation, index) => (
        <div className="evidence-block" key={index}>
          <div className="evidence-block__head">
            <span className={`badge badge--stratum-${attestation.stratum}`}>
              {STRATUM_LABELS[attestation.stratum]}
            </span>
            <span className="badge badge--kind">
              {displayTier(attestation.tier)}
            </span>
          </div>
          {attestation.note !== undefined && (
            <p className="evidence-block__note">{attestation.note}</p>
          )}
          <ul className="source-list">
            {attestation.sources.map((source) => (
              <SourceLink key={source.id} source={source} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function RecordDetail({
  record,
}: Readonly<{ record: ResolvedRecord }>) {
  return (
    <article>
      <p className="eyebrow">{record.categoryLabel}</p>
      <h1 className="page-title">{record.title}</h1>
      <div className="record-item__head">
        <RecordBadges record={record} />
      </div>
      <p className="page-lede">{record.summary}</p>
      <table className="meta-table">
        <tbody>
          <tr>
            <th scope="row">EDS types</th>
            <td>
              {record.subtypes.map((id) => SUBTYPE_LABELS[id]).join(", ")}
            </td>
          </tr>
          {record.date !== undefined && (
            <tr>
              <th scope="row">Date</th>
              <td>{displayDate(record.date, record.date_precision)}</td>
            </tr>
          )}
          <tr>
            <th scope="row">Diagnostic criteria</th>
            <td>{CRITERIA_ERA_LABELS[record.criteria_era]}</td>
          </tr>
          {record.practice_kind !== undefined && (
            <tr>
              <th scope="row">Type of practice</th>
              <td>{PRACTICE_KIND_LABELS[record.practice_kind]}</td>
            </tr>
          )}
          {record.venueNames.length > 0 && (
            <tr>
              <th scope="row">Venues</th>
              <td>{record.venueNames.join(", ")}</td>
            </tr>
          )}
          {record.risk !== undefined && (
            <tr>
              <th scope="row">Risk note</th>
              <td>{record.risk.note}</td>
            </tr>
          )}
          <tr>
            <th scope="row">Reviewed</th>
            <td>{record.reviewed_at}</td>
          </tr>
          {record.reassess_by !== undefined && (
            <tr>
              <th scope="row">Reassess by</th>
              <td>{record.reassess_by}</td>
            </tr>
          )}
        </tbody>
      </table>
      <EvidenceBlock record={record} />
    </article>
  );
}
