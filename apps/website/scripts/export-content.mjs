// Exportiert den statischen Content-Layer (src/content/**) nach JSON.
// Grundlage für die Strapi-Schema-Generierung + das Seeding.
// Läuft aus dem Frontend-Repo: `node scripts/export-content.mjs`
import esbuild from "esbuild";
import { writeFileSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";

// name (Export) → Modulpfad (relativ zu src/content)
const MODULES = {
  // pages
  home: "./pages/home.ts#home",
  about: "./pages/about.ts#about",
  methodik: "./pages/methodik.ts#methodik",
  careers: "./pages/careers.ts#careers",
  kiAudit: "./pages/kiAudit.ts#kiAudit",
  cortexPage: "./pages/cortex.ts#cortexPage",
  webDesign: "./pages/webDesign.ts#webDesign",
  kiGlossar: "./pages/kiGlossar.ts#kiGlossar",
  impressum: "./pages/impressum.ts#impressum",
  contact: "./pages/contact.ts#contact",
  notFound: "./pages/notFound.ts#notFound",
  painPointPage: "./pages/painPointAuswahlverfahren.ts#painPointPage",
  miniCaseDetail: "./pages/miniCaseDetail.ts#miniCaseDetail",
  // sections (eigene Single Types)
  nav: "./sections/nav.ts#nav",
  footer: "./sections/footer.ts#footer",
  contactFormModal: "./sections/contactFormModal.ts#contactFormModal",
  maschinenraumTicker: "./sections/maschinenraumTicker.ts#maschinenraumTicker",
  newEdgeSystem: "./sections/newEdgeSystem.ts#newEdgeSystem",
  auditSlaStatus: "./sections/auditSlaStatus.ts#auditSlaStatus",
  caseSpotlight: "./sections/caseSpotlight.ts#caseSpotlight",
  videoShowcase: "./sections/videoShowcase.ts#videoShowcase",
  brandAssets: "./sections/brandAssets.ts#brandAssets",
  // sections (Bestandteile von home)
  hero: "./sections/hero.ts#hero",
  impactCounter: "./sections/impactCounter.ts#impactCounter",
  problemJourney: "./sections/problemJourney.ts#problemJourney",
  tickerScroll: "./sections/tickerScroll.ts#tickerScroll",
  cortex: "./sections/cortex.ts#cortex",
  positionedForImpact: "./sections/positionedForImpact.ts#positionedForImpact",
  horizontalScroll: "./sections/horizontalScroll.ts#horizontalScroll",
  derSchnitt: "./sections/derSchnitt.ts#derSchnitt",
  embeddedAI: "./sections/embeddedAI.ts#embeddedAI",
  threeStepsCTA: "./sections/threeStepsCTA.ts#threeStepsCTA",
  testimonialsSection: "./sections/testimonials.ts#testimonialsSection",
  clientLogos: "./sections/clientLogos.ts#clientLogos",
  clientLogosHeading: "./sections/clientLogos.ts#clientLogosHeading",
  structuredData: "./sections/structuredData.ts#structuredData",
  // collections
  testimonials: "./collections/testimonials.ts#testimonials",
  jobs: "./collections/jobs.ts#jobs",
  painPoints: "./painPoints.ts#painPoints",
  defaultPainPoint: "./painPoints.ts#DEFAULT_PAIN_POINT",
  painPointsEn: "./en/painPoints.ts#painPoints",
  defaultPainPointEn: "./en/painPoints.ts#DEFAULT_PAIN_POINT",
  // ── EN-Mirror: locale-Single-Types (<type>-en) ──
  homeEn: "./en/pages/home.ts#home",
  aboutEn: "./en/pages/about.ts#about",
  methodikEn: "./en/pages/methodik.ts#methodik",
  careersEn: "./en/pages/careers.ts#careers",
  kiAuditEn: "./en/pages/kiAudit.ts#kiAudit",
  cortexPageEn: "./en/pages/cortex.ts#cortexPage",
  webDesignEn: "./en/pages/webDesign.ts#webDesign",
  kiGlossarEn: "./en/pages/kiGlossar.ts#kiGlossar",
  impressumEn: "./en/pages/impressum.ts#impressum",
  contactEn: "./en/pages/contact.ts#contact",
  notFoundEn: "./en/pages/notFound.ts#notFound",
  painPointPageEn: "./en/pages/painPointAuswahlverfahren.ts#painPointPage",
  miniCaseDetailEn: "./en/pages/miniCaseDetail.ts#miniCaseDetail",
  navEn: "./en/sections/nav.ts#nav",
  footerEn: "./en/sections/footer.ts#footer",
  contactFormModalEn: "./en/sections/contactFormModal.ts#contactFormModal",
  maschinenraumTickerEn: "./en/sections/maschinenraumTicker.ts#maschinenraumTicker",
  newEdgeSystemEn: "./en/sections/newEdgeSystem.ts#newEdgeSystem",
  auditSlaStatusEn: "./en/sections/auditSlaStatus.ts#auditSlaStatus",
  caseSpotlightEn: "./en/sections/caseSpotlight.ts#caseSpotlight",
  videoShowcaseEn: "./en/sections/videoShowcase.ts#videoShowcase",
  brandAssetsEn: "./en/sections/brandAssets.ts#brandAssets",
  heroEn: "./en/sections/hero.ts#hero",
  impactCounterEn: "./en/sections/impactCounter.ts#impactCounter",
  problemJourneyEn: "./en/sections/problemJourney.ts#problemJourney",
  tickerScrollEn: "./en/sections/tickerScroll.ts#tickerScroll",
  cortexEn: "./en/sections/cortex.ts#cortex",
  positionedForImpactEn: "./en/sections/positionedForImpact.ts#positionedForImpact",
  horizontalScrollEn: "./en/sections/horizontalScroll.ts#horizontalScroll",
  derSchnittEn: "./en/sections/derSchnitt.ts#derSchnitt",
  embeddedAIEn: "./en/sections/embeddedAI.ts#embeddedAI",
  threeStepsCTAEn: "./en/sections/threeStepsCTA.ts#threeStepsCTA",
  testimonialsSectionEn: "./en/sections/testimonials.ts#testimonialsSection",
  clientLogosEn: "./en/sections/clientLogos.ts#clientLogos",
  clientLogosHeadingEn: "./en/sections/clientLogos.ts#clientLogosHeading",
  structuredDataEn: "./en/sections/structuredData.ts#structuredData",
  testimonialsEn: "./en/collections/testimonials.ts#testimonials",
  jobsEn: "./en/collections/jobs.ts#jobs",

};

// Synthetisches Entry-Modul: importiert alle Exporte, sammelt sie in __ALL__
let entry = "";
const names = Object.keys(MODULES);
names.forEach((name, i) => {
  const [path, exp] = MODULES[name].split("#");
  entry += `import { ${exp} as _${i} } from "${path}";\n`;
});
entry += `export const __ALL__ = {\n`;
names.forEach((name, i) => {
  entry += `  ${JSON.stringify(name)}: _${i},\n`;
});
entry += `};\n`;

const outfile = join(tmpdir(), "newedge-content-bundle.mjs");

await esbuild.build({
  stdin: { contents: entry, resolveDir: "src/content", loader: "ts" },
  bundle: true,
  format: "esm",
  platform: "node",
  outfile,
  logLevel: "warning",
});

const mod = await import(pathToFileURL(outfile).href);
const all = mod.__ALL__;

/* ── Bild-Registry (assets.ts) mitexportieren ──────────────────────────────
   Nicht per esbuild importieren — das würde die Bild-Binaries mitbundeln.
   Stattdessen die Keys aus dem Quelltext lesen; daraus entsteht im CMS pro
   Bild ein „Bild austauschen"-Eintrag (Collection `image-override`). */
const assetsSrc = readFileSync(join("src", "content", "assets.ts"), "utf8");
const imagesBlock = assetsSrc.split("export const IMAGES = {")[1]?.split("} as const;")[0] ?? "";
let currentCategory = "Allgemein";
const imageKeys = [];
for (const line of imagesBlock.split("\n")) {
  const comment = line.match(/^\s*\/\/\s*(.+?)\s*$/);
  if (comment) { currentCategory = comment[1]; continue; }
  const key = line.match(/^\s*"([^"]+)"\s*:/);
  if (key) imageKeys.push({ imageKey: key[1], category: currentCategory });
}
/* Zusätzliche Medien-Plätze, die nicht in der Bild-Registry stehen, aber im
   CMS befüllbar sein sollen (z. B. Videos, die erst später hochgeladen werden).
   Solange nichts hochgeladen ist, greift der im Code hinterlegte Fallback. */
const MEDIA_SLOTS = [
  { imageKey: "contact-reel", category: "Videos" },   // Kontaktseite: Portrait-Reel
];
all.__imageKeys__ = [...imageKeys, ...MEDIA_SLOTS];

const OUT = join(tmpdir(), "newedge-content.json");
writeFileSync(OUT, JSON.stringify(all, null, 2));
console.log("exported", Object.keys(all).length, "content roots →", OUT);
for (const [k, v] of Object.entries(all)) {
  const kind = Array.isArray(v) ? `array[${v.length}]` : typeof v === "object" ? `object{${Object.keys(v).length}}` : typeof v;
  console.log("  ", k.padEnd(22), kind);
}
