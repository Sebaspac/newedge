// Generiert Strapi-5-Content-Types (schema.json + Factory-Controller/Route/Service)
// für alle Single Types + die pain-point-Collection aus dem exportierten
// Content-JSON der Website. Idempotent: überschreibt vorhandene generierte Typen.
//
//   node scripts/gen-schemas.mjs /pfad/zu/newedge-content.json
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT_JSON = process.argv[2];
if (!CONTENT_JSON) { console.error("Pfad zur newedge-content.json fehlt"); process.exit(1); }
const C = JSON.parse(readFileSync(CONTENT_JSON, "utf8"));

const API_DIR = join(process.cwd(), "src", "api");

/* ── home aus Page-Feldern + Section-Daten zusammensetzen (Frontend liest alles aus /api/home) ── */
const home = {
  ...C.home,
  hero: C.hero,
  impactCounter: C.impactCounter,
  problemJourney: C.problemJourney,
  tickerScroll: C.tickerScroll,
  cortex: C.cortex,
  positionedForImpact: C.positionedForImpact,
  horizontalScroll: C.horizontalScroll,
  derSchnitt: C.derSchnitt,
  embeddedAI: C.embeddedAI,
  threeStepsCTA: C.threeStepsCTA,
  testimonialsSection: C.testimonialsSection,
  clients: { heading: C.clientLogosHeading, logos: C.clientLogos },
  structuredData: C.structuredData,
};

/* ── EN-Aggregat für /api/home-en (spiegelt `home`) ── */
const homeEn = {
  ...C.homeEn,
  hero: C.heroEn,
  impactCounter: C.impactCounterEn,
  problemJourney: C.problemJourneyEn,
  tickerScroll: C.tickerScrollEn,
  cortex: C.cortexEn,
  positionedForImpact: C.positionedForImpactEn,
  horizontalScroll: C.horizontalScrollEn,
  derSchnitt: C.derSchnittEn,
  embeddedAI: C.embeddedAIEn,
  threeStepsCTA: C.threeStepsCTAEn,
  testimonialsSection: C.testimonialsSectionEn,
  clients: { heading: C.clientLogosHeadingEn, logos: C.clientLogosEn },
  structuredData: C.structuredDataEn,
};

/* ── Single Types: api-id → Content-Objekt ── */
const SINGLE_TYPES = {
  "home": home,
  "about": C.about,
  "methodik": C.methodik,
  "careers": C.careers,
  "ki-audit": C.kiAudit,
  "cortex-page": C.cortexPage,
  "web-design": C.webDesign,
  "ki-glossar": C.kiGlossar,
  "impressum": C.impressum,
  "kontakt": C.contact,
  "not-found": C.notFound,
  "pain-point-page": C.painPointPage,
  "mini-case-detail": C.miniCaseDetail,
  "nav": C.nav,
  "footer": C.footer,
  "contact-form-modal": C.contactFormModal,
  "maschinenraum-ticker": C.maschinenraumTicker,
  "new-edge-system": C.newEdgeSystem,
  "audit-sla-status": C.auditSlaStatus,
  "case-spotlight": C.caseSpotlight,
  "video-showcase": C.videoShowcase,
  "brand-assets": C.brandAssets,
  // ── EN-Locale-Varianten (getrennt editierbar) ──
  "home-en": homeEn,
  "about-en": C.aboutEn,
  "methodik-en": C.methodikEn,
  "careers-en": C.careersEn,
  "ki-audit-en": C.kiAuditEn,
  "cortex-page-en": C.cortexPageEn,
  "web-design-en": C.webDesignEn,
  "ki-glossar-en": C.kiGlossarEn,
  "impressum-en": C.impressumEn,
  "kontakt-en": C.contactEn,
  "not-found-en": C.notFoundEn,
  "pain-point-page-en": C.painPointPageEn,
  "mini-case-detail-en": C.miniCaseDetailEn,
  "nav-en": C.navEn,
  "footer-en": C.footerEn,
  "contact-form-modal-en": C.contactFormModalEn,
  "maschinenraum-ticker-en": C.maschinenraumTickerEn,
  "new-edge-system-en": C.newEdgeSystemEn,
  "audit-sla-status-en": C.auditSlaStatusEn,
  "case-spotlight-en": C.caseSpotlightEn,
  "video-showcase-en": C.videoShowcaseEn,
  "brand-assets-en": C.brandAssetsEn,
};

/* ── pain-points deduplizieren: gruppiere nach kanonischem entry.slug;
      aliases = alle Map-Keys der Gruppe außer dem kanonischen Slug ── */
function buildPainPoints(src) {
  const bySlug = new Map(); // canonical slug → { entry, keys:[] }
  for (const [key, entry] of Object.entries(src)) {
    const canonical = entry.slug || key;
    if (!bySlug.has(canonical)) bySlug.set(canonical, { entry, keys: [] });
    bySlug.get(canonical).keys.push(key);
  }
  const rows = [];
  for (const [canonical, { entry, keys }] of bySlug.entries()) {
    const aliases = keys.filter((k) => k !== canonical);
    rows.push({ ...entry, slug: canonical, aliases });
  }
  return rows;
}
const painPointRows = buildPainPoints(C.painPoints);
const painPointRowsEn = C.painPointsEn ? buildPainPoints(C.painPointsEn) : [];

/* ── Attribut-Typ aus einem Wert ableiten ── */
const RESERVED = { id: "fieldId", type: "fieldType", default: "defaultLabel" };
function attrNameFor(key) { return RESERVED[key] || key; }
function attrFor(value) {
  if (typeof value === "string") return value.length > 255 || value.includes("\n") ? { type: "text" } : { type: "string" };
  if (typeof value === "boolean") return { type: "boolean" };
  if (typeof value === "number") return Number.isInteger(value) ? { type: "integer" } : { type: "decimal" };
  // objects, arrays, null → json (shape-erhaltend; fromStrapi rekursiv)
  return { type: "json" };
}
function attributesFromObject(obj) {
  const attrs = {};
  for (const [k, v] of Object.entries(obj)) attrs[attrNameFor(k)] = attrFor(v);
  return attrs;
}

/* ── Datei-Writer ── */
function writeType(apiId, { singular, plural, displayName, kind, attributes }) {
  const base = join(API_DIR, apiId);
  mkdirSync(join(base, "content-types", apiId), { recursive: true });
  mkdirSync(join(base, "controllers"), { recursive: true });
  mkdirSync(join(base, "routes"), { recursive: true });
  mkdirSync(join(base, "services"), { recursive: true });

  const schema = {
    kind,
    collectionName: plural.replace(/-/g, "_"),
    info: { singularName: singular, pluralName: plural, displayName, description: "Generiert aus src/content (Website-Content-Layer)" },
    options: { draftAndPublish: true },
    pluginOptions: {},
    attributes,
  };
  writeFileSync(join(base, "content-types", apiId, "schema.json"), JSON.stringify(schema, null, 2) + "\n");

  const uid = `api::${singular}.${singular}`;
  const stamp = (role) => `/**\n * ${singular} ${role}\n */\nimport { factories } from '@strapi/strapi';\n\nexport default factories.createCore${role[0].toUpperCase()+role.slice(1)}('${uid}');\n`;
  writeFileSync(join(base, "controllers", `${apiId}.ts`), stamp("controller"));
  writeFileSync(join(base, "routes", `${apiId}.ts`), stamp("router"));
  writeFileSync(join(base, "services", `${apiId}.ts`), stamp("service"));
}

let count = 0;
// Single Types
for (const [apiId, obj] of Object.entries(SINGLE_TYPES)) {
  // singularName darf keine Bindestriche haben → camel/kebab: Strapi erlaubt kebab in singularName? Nutzt es für uid. Wir behalten apiId als singular+plural (kebab ok in Strapi 5).
  writeType(apiId, {
    singular: apiId,
    // Strapi verlangt pluralName != singularName; die Single-Type-Route bleibt /api/<singular>.
    plural: `${apiId}-entries`,
    displayName: apiId.replace(/(^|-)([a-z])/g, (_, s, c) => (s ? " " : "") + c.toUpperCase()),
    kind: "singleType",
    attributes: attributesFromObject(obj),
  });
  count++;
}

// pain-point Collection: Attribute = Union aller Row-Keys
const ppAttrs = {};
for (const row of painPointRows) for (const [k, v] of Object.entries(row)) {
  const name = attrNameFor(k);
  if (!ppAttrs[name]) ppAttrs[name] = k === "slug" ? { type: "uid" } : attrFor(v);
}
writeType("pain-point", {
  singular: "pain-point",
  plural: "pain-points",
  displayName: "Pain Point",
  kind: "collectionType",
  attributes: ppAttrs,
});
count++;

// pain-point-en Collection (EN-Locale, getrennt editierbar)
if (painPointRowsEn.length) {
  const ppAttrsEn = {};
  for (const row of painPointRowsEn) for (const [k, v] of Object.entries(row)) {
    const name = attrNameFor(k);
    if (!ppAttrsEn[name]) ppAttrsEn[name] = k === "slug" ? { type: "uid" } : attrFor(v);
  }
  writeType("pain-point-en", {
    singular: "pain-point-en",
    plural: "pain-point-ens",
    displayName: "Pain Point (EN)",
    kind: "collectionType",
    attributes: ppAttrsEn,
  });
  count++;
}

/* ── Aufbereitete Daten für den Seeder ablegen (identische Quelle wie die Schemas) ── */
mkdirSync(join(process.cwd(), "data"), { recursive: true });
// „Bild austauschen"-Einträge: ein Datensatz pro Key der Bild-Registry
// (src/content/assets.ts). Der Seeder legt fehlende an und fasst bestehende
// NICHT an — sonst wären hochgeladene Dateien nach jedem Reseed weg.
const imageOverrides = (C.__imageKeys__ ?? []).map(({ imageKey, category }) => ({
  imageKey,
  category,
  // Lesbares Label aus dem Key: "pain-point-compliance-hero" → "Pain Point Compliance Hero"
  label: imageKey.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

/* ── testimonial + job: handgepflegte Collections (Schemas bleiben unberührt,
      sie nutzen Components statt json). Hier nur die Seed-Rows aufbereiten:
      die Website-Form wird in die Strapi-Form übersetzt. ── */
function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
// Reihenfolge der Website 1:1 übernehmen (Feld `order` im Schema).
const testimonialRows = (C.testimonials ?? []).map((t, i) => ({
  text: t.text,
  name: t.name,
  role: t.role,
  order: i,
}));
// tags: string[] → tag{label}; sections[].items: string[] → bullet{text}.
// Das Accordion-`id` ("item-1") entfällt: die Website nutzt im CMS-Betrieb die documentId.
const jobRows = (C.jobs ?? []).map((job, i) => ({
  title: job.title,
  slug: slugify(job.title),
  mailto: job.mailto ?? "",
  tags: (job.tags ?? []).map((label) => ({ label })),
  sections: (job.sections ?? []).map((s) => ({
    label: s.label,
    items: (s.items ?? []).map((text) => ({ text })),
  })),
  order: i,
}));

const prepared = {
  singleTypes: SINGLE_TYPES,           // apiId → Objekt (uid = api::<apiId>.<apiId>)
  painPoints: painPointRows,           // Collection-Rows mit slug + aliases
  painPointsEn: painPointRowsEn,       // EN-Locale-Collection-Rows
  imageOverrides,                      // Bild-Registry → CMS-Austauschliste
  testimonials: testimonialRows,       // Kundenstimmen (Custom Post)
  jobs: jobRows,                       // offene Positionen (Components)
};
writeFileSync(join(process.cwd(), "data", "prepared-content.json"), JSON.stringify(prepared, null, 2));

console.log(`generiert: ${count} Content-Types (${Object.keys(SINGLE_TYPES).length} Single + 1 Collection)`);
console.log(`pain-point Rows (dedupliziert):`, painPointRows.length, "→ slugs:", painPointRows.map(r => r.slug).join(", "));
console.log(`testimonial Rows:`, testimonialRows.length, "| job Rows:", jobRows.length, "→ slugs:", jobRows.map(r => r.slug).join(", "));
console.log(`prepared-content.json → data/`);
