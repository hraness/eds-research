import type { ResolvedRecord } from "@/lib/content";
import { MockupRoot } from "@hraness/design-kit/mockups";
import "@hraness/design-kit/mockups.css";

import {
  CORROBORATION_LABELS,
  CRITERIA_ERA_LABELS,
  displayTier,
  KIND_LABELS,
  RISK_LABELS,
  STATUS_LABELS,
  STRATUM_LABELS,
  SUBTYPE_LABELS,
} from "./display";
import { publicSitePath, site } from "./site";

/*
 * An annotated illustration of one real record page. It renders the record
 * from the corpus with the site's own badges, marks each label with a number,
 * and explains the labels in a legend outside the picture, so the legend is
 * real text and the picture is one image with a description.
 */

/** The record the homepage uses to explain the labels. */
export const ANATOMY_RECORD_ID = "mgmt-lidocaine-resistance";

export const ANATOMY_PARTS = [
  "status",
  "corroboration",
  "subtypes",
  "criteria",
  "stratum",
  "tier",
  "sources",
] as const;

export type AnatomyPart = (typeof ANATOMY_PARTS)[number];

const STRATUM_COUNT = Object.keys(STRATUM_LABELS).length;

const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function countWord(count: number): string {
  return COUNT_WORDS[count] ?? String(count);
}

function listPhrase(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

export const ANATOMY_LEGEND: Readonly<
  Record<AnatomyPart, Readonly<{ term: string; text: string }>>
> = {
  status: {
    term: "Evidence status",
    text: "How settled the claim is, from established to refuted. The method page gives the rule for each status.",
  },
  corroboration: {
    term: "Agreement",
    text: "Whether independent studies or reports from different kinds of evidence agree. A paper, its preprint, and a press release count as one study.",
  },
  subtypes: {
    term: "EDS types",
    text: "Which types the record covers. A finding about one type is not applied to another.",
  },
  criteria: {
    term: "Diagnostic criteria",
    text: "The classification in force when the sources were written, so an older study is not read as a study of a type as it is defined today.",
  },
  stratum: {
    term: "Kind of evidence",
    text: `Every source is one of ${countWord(STRATUM_COUNT)} kinds: ${listPhrase(Object.values(STRATUM_LABELS))}. They are never ranked against each other.`,
  },
  tier: {
    term: "Level within that kind",
    text: "Each kind has its own scale. A trial is graded against other clinical sources, and a forum pattern against other patient reports.",
  },
  sources: {
    term: "Sources",
    text: "Each source links to where it was published. Patient reports name the forum, never the person.",
  },
};

function firstSentence(text: string): string {
  const match = /^.*?[.!?](?=\s|$)/u.exec(text);
  return match === null ? text : match[0];
}

function sourceCount(count: number): string {
  return count === 1 ? "1 source" : `${count} sources`;
}

function subtypeList(record: ResolvedRecord): string {
  return record.subtypes.map((id) => SUBTYPE_LABELS[id]).join(", ");
}

/** The accessible name, built from the same record the picture renders. */
export function describeRecordAnatomy(record: ResolvedRecord): string {
  const rows = record.evidence.map(
    (row) =>
      `${STRATUM_LABELS[row.stratum]} (${displayTier(row.tier)}, ${sourceCount(row.sources.length)})`,
  );
  const agreement =
    record.corroboration === undefined
      ? ""
      : `, the agreement label "${CORROBORATION_LABELS[record.corroboration]}"`;
  return (
    `Illustration of the record page "${record.title}". It shows the evidence status "${STATUS_LABELS[record.status]}"${agreement}, ` +
    `the EDS types (${subtypeList(record)}), the diagnostic criteria (${CRITERIA_ERA_LABELS[record.criteria_era]}), ` +
    `and ${record.evidence.length} evidence rows: ${listPhrase(rows)}.`
  );
}

function Marker({ part }: Readonly<{ part: AnatomyPart }>) {
  return (
    <span className="record-anatomy__marker" data-part={part}>
      {ANATOMY_PARTS.indexOf(part) + 1}
    </span>
  );
}

function Labelled({
  children,
  part,
}: Readonly<{ part: AnatomyPart; children: React.ReactNode }>) {
  return (
    <span className="record-anatomy__part" data-part={part}>
      {children}
      <Marker part={part} />
    </span>
  );
}

export function RecordAnatomySheet({
  record,
}: Readonly<{ record: ResolvedRecord }>) {
  return (
    <MockupRoot
      className="record-anatomy__sheet"
      describe={describeRecordAnatomy(record)}
      kind="record"
    >
      <p className="record-anatomy__crumb">
        {site.name} / {record.categoryLabel}
      </p>
      <p className="record-anatomy__title">{record.title}</p>
      <p className="record-anatomy__badges">
        <span className="badge badge--kind">{KIND_LABELS[record.kind]}</span>
        <Labelled part="status">
          <span className={`badge badge--status-${record.status}`}>
            {`evidence: ${STATUS_LABELS[record.status]}`}
          </span>
        </Labelled>
        {record.corroboration !== undefined && (
          <Labelled part="corroboration">
            <span className="badge badge--kind">
              {CORROBORATION_LABELS[record.corroboration]}
            </span>
          </Labelled>
        )}
        {record.risk !== undefined && (
          <span className={`badge badge--risk-${record.risk.level}`}>
            {RISK_LABELS[record.risk.level]}
          </span>
        )}
      </p>
      <p className="record-anatomy__summary">{firstSentence(record.summary)}</p>
      <dl className="record-anatomy__meta">
        <div>
          <dt>EDS types</dt>
          <dd>
            <Labelled part="subtypes">{subtypeList(record)}</Labelled>
          </dd>
        </div>
        <div>
          <dt>Diagnostic criteria</dt>
          <dd>
            <Labelled part="criteria">
              {CRITERIA_ERA_LABELS[record.criteria_era]}
            </Labelled>
          </dd>
        </div>
      </dl>
      <p className="record-anatomy__evidence-label">Evidence</p>
      <ul className="record-anatomy__evidence">
        {record.evidence.map((row, index) => {
          const stratum = (
            <span className={`badge badge--stratum-${row.stratum}`}>
              {STRATUM_LABELS[row.stratum]}
            </span>
          );
          const tier = (
            <span className="record-anatomy__tier">{displayTier(row.tier)}</span>
          );
          const sources = (
            <span className="record-anatomy__sources">
              {sourceCount(row.sources.length)}
            </span>
          );
          return (
            <li key={`${row.stratum}-${row.tier}-${index}`}>
              {index === 0 ? <Labelled part="stratum">{stratum}</Labelled> : stratum}
              {index === 0 ? <Labelled part="tier">{tier}</Labelled> : tier}
              {index === 0 ? <Labelled part="sources">{sources}</Labelled> : sources}
            </li>
          );
        })}
      </ul>
    </MockupRoot>
  );
}

/** The illustration with its numbered legend and a link to the full record. */
export function RecordAnatomy({
  record,
}: Readonly<{ record: ResolvedRecord }>) {
  const parts = ANATOMY_PARTS.filter(
    (part) => part !== "corroboration" || record.corroboration !== undefined,
  );
  return (
    <figure className="record-anatomy">
      <RecordAnatomySheet record={record} />
      <figcaption className="record-anatomy__caption">
        <p className="record-anatomy__note">
          Illustration of a real record, with its labels numbered.{" "}
          <a href={publicSitePath(`/records/${record.id}`)}>
            Open the full record
          </a>
        </p>
        <ol className="record-anatomy__legend">
          {parts.map((part) => (
            <li data-part={part} key={part}>
              <span aria-hidden="true" className="record-anatomy__marker">
                {ANATOMY_PARTS.indexOf(part) + 1}
              </span>
              <span>
                <strong>{ANATOMY_LEGEND[part].term}.</strong>{" "}
                {ANATOMY_LEGEND[part].text}
              </span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
