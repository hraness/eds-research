import { describe } from "./display";

// Search titles retain the source's scope and uncertainty while the full
// finding remains the visible heading, citation, and structured-data name.
export const RECORD_SEARCH_TITLES: Readonly<Record<string, string>> = {
  "signal-subluxation-load": "Patient reports of partly slipping joints",
  "signal-meds-anesthesia-cautions": "Patient reports of medication cautions",
  "signal-diagnosis-navigation": "Patient advice on finding an EDS diagnosis",
  "com-trifecta-pattern": "hEDS, POTS, and MCAS patient reports",
  "com-multisystem-2017": "The 2017 EDS papers on wider symptoms",
  "com-misdiagnosis-load": "Registry survey of other hEDS diagnoses",
  "com-cci-tethered-cord": "Contested CCI and tethered cord in hEDS",
  "com-gi-dysautonomia-cluster": "GI and autonomic reports in hEDS and HSD",
  "class-heds-2017-criteria": "The 2017 hEDS diagnostic criteria",
  "class-molecular-confirmation-required": "Genetic confirmation of EDS except hEDS",
  "class-hsd-residual-category": "The 2017 framework for hEDS and HSD",
  "class-criteria-era-drift": "Older EDS criteria differ from 2017 hEDS",
  "dx-heds-remains-clinical": "hEDS diagnosis is still clinical",
  "folk-performer-training": "Elastic performers' historical training",
  "folk-diet-supportive": "Historical diets and tonics",
  "gen-heds-no-confirmed-gene": "hEDS has no confirmed molecular cause",
  "gen-klk15-first-candidate": "KLK15 is a candidate gene for hEDS",
  "gen-hedge-study": "HEDGE studies the genetics of hEDS",
  "gen-collagen-and-pathway-map": "The 2017 map of EDS gene pathways",
  "hist-hippocratic-early-accounts": "Joint laxity attributed to ancient texts",
  "hist-van-meekren-1682": "Van Meek'ren's 1682 skin case report",
  "hist-early-circus-performers": "Elastic performers in historical shows",
  "hist-chernogubov-1892": "Chernogubov's 1892 EDS case reports",
  "hist-ehlers-1901": "Edvard Ehlers' 1901 case report",
  "hist-danlos-1908": "Danlos' 1908 report of fragile skin",
  "hist-named-ehlers-danlos-1949": "The 1949 EDS naming claim is refuted",
  "hist-barabas-1967-vascular": "Barabas' 1967 report of vascular EDS",
  "hist-beighton-score-1973": "The Beighton score's 1973 publication",
  "hist-berlin-1988": "The 1988 Berlin classification of EDS",
  "hist-villefranche-1997": "The 1997 Villefranche EDS classification",
  "hist-international-2017": "The 2017 classification of 13 EDS types",
  "hist-klk15-2025": "The 2025 KLK15 candidate-gene study",
  "mgmt-pt-mainstay": "Physical therapy guidance for hEDS and HSD",
  "mgmt-lidocaine-resistance": "Local anesthetic resistance in EDS",
  "mgmt-psych-support": "Psychological support for hEDS and HSD",
  "px-trauma-informed-2025": "A 2025 study of hEDS diagnostic trauma",
  "px-german-cohort-manifestations": "Pain and instability at a German clinic",
  "px-fatigue-underrecognized": "Fatigue reported at a German EDS clinic",
  "prog-dice-registry": "DICE collects patient-reported EDS data",
  "prog-echo": "EDS ECHO education for clinicians",
  "prog-orpha-gard": "Orphanet and GARD reference records on EDS",
};

export const RECORD_SEARCH_DESCRIPTIONS: Readonly<Record<string, string>> = {
  "signal-pt-that-knows-eds":
    "EDS patient communities share directories and referrals for physical therapists, including concerns about generic exercise programs.",
  "class-criteria-era-drift":
    "Studies using 1997–2017 hypermobility-type EDS criteria do not map cleanly onto 2017 hEDS. Some participants would now meet HSD criteria.",
  "folk-performer-training":
    "Historical sources describe how elastic performers trained and protected their flexibility as a working skill, rather than a treatment.",
  "folk-diet-supportive":
    "Historical sources describe dietary measures and general tonics for connective-tissue fragility before specific therapies existed.",
  "hist-berlin-1988":
    "The 1988 Berlin nosology expanded EDS into eleven numbered types. Its blurred clinical boundaries preceded a later consolidation.",
  "hist-villefranche-1997":
    "The 1997 Villefranche classification, published in 1998, consolidated EDS into six major types as the molecular basis became clearer.",
  "hist-named-ehlers-danlos-1949":
    "The claim that Johnson and Falls named EDS in 1949 is refuted. The record cites a 1936 paper that already used the name.",
  "mgmt-lidocaine-resistance":
    "Patient reports and surveys describe local anesthetic failures in EDS. A 2026 trial found shorter-lasting numbness after lidocaine.",
};

export const SUBTYPE_SEARCH_TITLES: Readonly<Record<string, string>> = {
  aeds: "Arthrochalasia EDS (aEDS)",
  cleds: "Classical-like EDS (clEDS)",
  cveds: "Cardiac-valvular EDS (cvEDS)",
  deds: "Dermatosparaxis EDS (dEDS)",
  keds: "Kyphoscoliotic EDS (kEDS)",
  mceds: "Musculocontractural EDS (mcEDS)",
  speds: "Spondylodysplastic EDS (spEDS)",
};

export const SUBTYPE_SEARCH_DESCRIPTIONS: Readonly<Record<string, string>> = {
  veds:
    "Vascular EDS is caused by COL3A1 variants. Arteries, the bowel, and the uterus can tear or rupture, affecting surgery and anesthesia.",
  deds:
    "Dermatosparaxis EDS is a recessive type caused by ADAMTS2 deficiency. This collagen-processing defect produces extreme skin fragility.",
  bcs:
    "Brittle cornea syndrome is a recessive EDS type with fragile eyes. The subtype record describes inheritance, genes, and distinguishing features.",
};

export const CATEGORY_SEARCH_TITLES: Readonly<Record<string, string>> = {
  "patient-experience": "EDS patient experience and diagnosis",
  "research-programs": "EDS research programs and registries",
};

export const CATEGORY_SEARCH_DESCRIPTIONS: Readonly<Record<string, string>> = {
  "diagnosis-and-classification":
    "EDS diagnosis involves the Beighton score, 2017 hEDS criteria, and genetic confirmation of other types. Older studies used different criteria.",
  genetics:
    "Twelve EDS types have confirmed genes. hEDS has no confirmed molecular cause, and studies including HEDGE and the KLK15 work explore its genetics.",
  "patient-experience":
    "Studies of EDS and HSD describe long diagnostic delays and patients' experiences of care, including dismissal, validation, and diagnostic trauma.",
};

export function recordSearchTitle(record: Readonly<{ id: string; title: string }>): string {
  return RECORD_SEARCH_TITLES[record.id] ?? record.title;
}

export function recordSearchDescription(record: Readonly<{
  id: string;
  description?: string | undefined;
  summary: string;
}>): string {
  return RECORD_SEARCH_DESCRIPTIONS[record.id] ?? record.description ?? describe(record.summary);
}

export function subtypeSearchTitle(subtype: Readonly<{
  id: string;
  name: string;
  abbreviation: string;
}>): string {
  return SUBTYPE_SEARCH_TITLES[subtype.id] ?? `${subtype.name} (${subtype.abbreviation})`;
}

export function subtypeSearchDescription(subtype: Readonly<{ id: string; summary: string }>): string {
  return SUBTYPE_SEARCH_DESCRIPTIONS[subtype.id] ?? describe(subtype.summary);
}
