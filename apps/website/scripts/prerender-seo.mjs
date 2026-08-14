/**
 * Prerender (Post-Build): Head, Textkörper, strukturierte Daten, Sitemap
 * --------------------------------------------------------------
 * Reine SPA — react-helmet flusht clientseitig nicht zuverlässig, deshalb
 * bekommt jede statische Route hier ihr korrektes <title>/<meta description>/
 * canonical/OG/Twitter + JSON-LD DIREKT ins ausgelieferte HTML gebacken
 * (für Crawler, die kein JS ausführen — AI-Suche, Social-Preview).
 *
 * Seit 2026-08 zusätzlich (SEO-AUDIT.md, strategische Punkte 1, 3 und 12):
 *   1. TEXTKÖRPER — jede Route bekommt einen echten, semantischen Textkörper
 *      (h1/h2/h3/p/ul/a) aus dem Content-Layer ins HTML geschrieben. Vorher
 *      lieferten alle 32 Seiten 0 Zeichen Fließtext aus.
 *   3. STRUKTURIERTE DATEN — zusätzlich zu Organization jetzt auch WebSite,
 *      BreadcrumbList und FAQPage, sprachabhängig, per JSON.stringify erzeugt.
 *  12. SITEMAP — wird hier aus derselben Routenliste erzeugt und nach
 *      dist/sitemap.xml geschrieben (public/sitemap.xml wurde entfernt, damit
 *      es keine zweite, handgepflegte Quelle mehr gibt, die auseinanderläuft).
 *
 * Bewusst KEIN React-SSR: Spline/Three.js, dynamische Routen und die
 * clientseitig injizierten Service-Schemas bleiben unberührt. Der Textkörper
 * wird stattdessen direkt aus den Content-Modulen gerendert — dieselbe Quelle,
 * aus der auch Titel und Beschreibung stammen (kein zweiter Pflege-Ort).
 *
 * Wie die Content-Module hier gelesen werden: `esbuild` bündelt sie
 * build-zeitlich zu einem Node-Modul (Alias `@` → src, Bild-Importe werden zu
 * Strings), das dann dynamisch importiert wird. Damit liegen die echten
 * Objekte vor statt regex-geparster Bruchstücke. Nur SEO-Werte, die in einer
 * .tsx-Seitenkomponente stehen (ROI-Rechner), werden weiterhin aus dem
 * Quelltext extrahiert.
 * --------------------------------------------------------------
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const BASE = "https://newedgebrand.com";
const OG_IMAGE = `${BASE}/og-default.jpg`;

if (!existsSync(join(DIST, "index.html"))) {
  console.error("[prerender-seo] dist/index.html fehlt — erst `vite build` laufen lassen.");
  process.exit(1);
}
/**
 * Vorlage = dist/index.html. Achtung: diese Datei ist zugleich das Ergebnis der
 * Startseite — ein zweiter Lauf ohne dazwischenliegenden `vite build` würde
 * sonst auf die bereits injizierten Tags draufschreiben (doppelter Textkörper,
 * doppelte canonical, doppeltes JSON-LD). Deshalb wird die Vorlage zuerst auf
 * den Auslieferungsstand von index.html zurückgesetzt: alles, was dieses
 * Skript selbst einfügt, fliegt raus. Im Quell-index.html existiert keines
 * dieser Tags, das Entfernen kann also nichts Handgepflegtes treffen.
 */
const sanitize = (html) =>
  html
    .replace(/<div id="seo-prerender"[\s\S]*?<\/div>/gi, "")
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "")
    .replace(/\s*<meta name="description"[^>]*>/gi, "")
    .replace(/\s*<link rel="canonical"[^>]*>/gi, "")
    .replace(/\s*<link rel="alternate" hreflang="[^"]*"[^>]*>/gi, "")
    .replace(/\s*<meta property="og:locale(?::alternate)?"[^>]*>/gi, "");

const template = sanitize(readFileSync(join(DIST, "index.html"), "utf8"));

/* ══════════════════════════════════════════════════════════════
   A — Content-Layer laden (esbuild-Bundle → dynamischer Import)
   ══════════════════════════════════════════════════════════════ */

/**
 * Content-Module, die für Head, Textkörper und Schema gebraucht werden.
 * Schlüssel = Namensraum im gebündelten Modul.
 * Die Sektions-Module der Startseite stehen in der Reihenfolge, in der sie in
 * `src/pages/Index.tsx` gerendert werden — daraus entsteht die Gliederung des
 * Startseiten-Textkörpers.
 */
const CONTENT_MODULES = {
  de: {
    painPoints: "@/content/painPoints",
    home: "@/content/pages/home",
    methodik: "@/content/pages/methodik",
    contact: "@/content/pages/contact",
    kiAudit: "@/content/pages/kiAudit",
    cortexPage: "@/content/pages/cortex",
    webDesign: "@/content/pages/webDesign",
    kiGlossar: "@/content/pages/kiGlossar",
    sicherheit: "@/content/pages/sicherheit",
    impressum: "@/content/pages/impressum",
    nav: "@/content/sections/nav",
    secHero: "@/content/sections/hero",
    secStatementStats: "@/content/sections/statementStats",
    secDiamondModel: "@/content/sections/diamondModel",
    secCortex: "@/content/sections/cortex",
    secBuiltOnTop: "@/content/sections/builtOnTop",
    secEmbeddedAI: "@/content/sections/embeddedAI",
    secDerSchnitt: "@/content/sections/derSchnitt",
    secTeamSupport: "@/content/sections/teamSupport",
    secThreeStepsCTA: "@/content/sections/threeStepsCTA",
  },
  en: {
    painPoints: "@/content/en/painPoints",
    home: "@/content/en/pages/home",
    methodik: "@/content/en/pages/methodik",
    contact: "@/content/en/pages/contact",
    kiAudit: "@/content/en/pages/kiAudit",
    cortexPage: "@/content/en/pages/cortex",
    webDesign: "@/content/en/pages/webDesign",
    kiGlossar: "@/content/en/pages/kiGlossar",
    sicherheit: "@/content/en/pages/sicherheit",
    impressum: "@/content/en/pages/impressum",
    nav: "@/content/en/sections/nav",
    secHero: "@/content/en/sections/hero",
    secStatementStats: "@/content/en/sections/statementStats",
    secDiamondModel: "@/content/en/sections/diamondModel",
    secCortex: "@/content/en/sections/cortex",
    secBuiltOnTop: "@/content/en/sections/builtOnTop",
    secEmbeddedAI: "@/content/en/sections/embeddedAI",
    secDerSchnitt: "@/content/en/sections/derSchnitt",
    secTeamSupport: "@/content/en/sections/teamSupport",
    secThreeStepsCTA: "@/content/en/sections/threeStepsCTA",
  },
};

/** Quelldatei je Namensraum — für <lastmod> in der Sitemap. */
const moduleFile = (spec) => join(ROOT, spec.replace(/^@\//, "src/") + ".ts");

let esbuild;
try {
  esbuild = (await import("esbuild")).default;
} catch {
  console.error("[prerender-seo] esbuild nicht auffindbar — `npm install` im Website-Paket ausführen.");
  process.exit(1);
}

const CACHE_DIR = join(ROOT, "node_modules/.cache/prerender-seo");
mkdirSync(CACHE_DIR, { recursive: true });
const entryFile = join(CACHE_DIR, "content-entry.mjs");
// Fester Name: das Bündel wird bei jedem Lauf neu geschrieben und genau einmal
// importiert — es darf sich also nichts ansammeln.
const bundleFile = join(CACHE_DIR, "content-bundle.mjs");

writeFileSync(
  entryFile,
  Object.entries(CONTENT_MODULES)
    .flatMap(([lang, mods]) => Object.entries(mods).map(([ns, spec]) => `export * as ${lang}_${ns} from "${spec}";`))
    .join("\n"),
  "utf8"
);

await esbuild.build({
  entryPoints: [entryFile],
  outfile: bundleFile,
  bundle: true,
  format: "esm",
  platform: "node",
  alias: { "@": join(ROOT, "src") },
  // Bild-/Medien-Importe kommen in den Content-Modulen nur als `import type`
  // vor; der `text`-Loader ist die Absicherung, falls doch einmal ein echter
  // Asset-Import dazukommt — dann wird daraus ein Dateipfad-String statt eines
  // Build-Abbruchs.
  loader: {
    ".png": "text", ".jpg": "text", ".jpeg": "text", ".webp": "text",
    ".svg": "text", ".gif": "text", ".avif": "text", ".mp4": "text", ".webm": "text",
  },
  logLevel: "warning",
});

const bundle = await import(pathToFileURL(bundleFile).href);
/** Content-Zugriff: `C("de").painPoints`, `C("en").cortexPage` … */
const C = (lang) =>
  new Proxy(
    {},
    {
      get: (_t, ns) => {
        const mod = bundle[`${lang}_${String(ns)}`];
        if (!mod) return undefined;
        // Module exportieren genau ein Content-Objekt (ggf. plus Konstanten).
        return mod[String(ns)] ?? mod[Object.keys(mod)[0]];
      },
    }
  );
const painPointsOf = (lang) => bundle[`${lang}_painPoints`].painPoints;

/* ══════════════════════════════════════════════════════════════
   B — Extraktion aus .tsx-Quelltext (nur noch ROI-Rechner)
   ══════════════════════════════════════════════════════════════ */
const cache = new Map();
const read = (f) => {
  if (!cache.has(f)) cache.set(f, readFileSync(join(ROOT, f), "utf8"));
  return cache.get(f);
};
const strAfter = (src, key, from = 0) => {
  const re = new RegExp(key + '\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"');
  const m = re.exec(src.slice(from));
  return m ? m[1].replace(/\\"/g, '"') : null;
};
const ROI_FILE = "src/pages/RoiRechner.tsx";
/** Startindex des UI-Wörterbuchs T_DE bzw. T_EN in RoiRechner.tsx. */
const roiBlock = (lang) => {
  const src = read(ROI_FILE);
  const i = src.indexOf(lang === "en" ? "const T_EN" : "const T_DE");
  return i < 0 ? "" : src.slice(i, src.indexOf("\n};", i));
};
const seoFromRoi = (lang) => {
  const b = roiBlock(lang);
  return { title: strAfter(b, "seoTitle"), description: strAfter(b, "seoDescription") };
};

/* ══════════════════════════════════════════════════════════════
   C — Textkörper aus dem Content-Layer
   ══════════════════════════════════════════════════════════════ */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (s) => String(s).replace(/\s+/g, " ").trim();

/**
 * Container (Objekte/Arrays), die nie in den Textkörper wandern.
 *
 * Zwei Gruppen, und die zweite ist eine bewusste inhaltliche Entscheidung:
 *   (a) Chrome/Technik — Bilder, Formulare, Diagramm-Beschriftungen, ARIA-Texte,
 *       Navigations-Rohdaten. Ergibt keinen Fließtext.
 *   (b) Zahlen- und Referenz-Behauptungen — `stats`, `metrics`, `badges`,
 *       `logos`, `trustBar`, `proof`, `partners`, `miniCases`,
 *       `testimonialHero`. Diese Felder tragen unbelegte Kennzahlen
 *       („30 % Zeit zurück", „4x") bzw. Namenslisten und Zitate, die als
 *       Referenzen gelesen werden. Im gerenderten Layout stehen sie mit
 *       Kontext, Disclaimer und Szenario-Band; als nackter Fließtext im
 *       ausgelieferten HTML wären sie eine Ergebniszusage. Deshalb nicht
 *       gebacken.
 */
const SKIP_CONTAINERS = new Set([
  // (a)
  "seo", "image", "images", "video", "logo", "diagram", "a11y", "contact", "toast",
  "toolbar", "countLabel", "portrait", "portraitDuo", "banner", "person", "founderBadge",
  "avatars", "photos", "providers", "fields", "message", "filterButtons", "megaMenu",
  "featured", "angebot", "painPoints", "industrien", "mobile", "spokes", "captionShapes",
  "axisBottomByScene", "cycleWords", "howTo", "letter", "titles", "showreel", "founder",
  // Button-Beschriftungen liegen teils als Objekt vor ({ label: "…" }) und
  // würden sonst als Überschrift gelesen.
  "primaryCta", "secondaryCta", "ctaPrimary", "ctaSecondary",
  // (b)
  "stats", "metrics", "badges", "logos", "trustBar", "proof", "partners",
  "miniCases", "testimonialHero", "trustChips",
]);

/** Strings, die als Fließtext ausgegeben werden. */
const TEXT_KEYS = new Set([
  "sub", "subtitle", "subline", "intro", "body", "text", "desc", "description",
  "paragraph", "paragraphs", "lead", "closing", "def", "a", "teaser", "transparency",
  "statement", "frage", "situation", "result",
]);

/** Strings, die eine Überschrift bilden (Reihenfolge = Priorität). */
const HEADING_KEYS = ["heading", "h2", "headline", "title", "q", "term", "name", "label"];

/** Mehrteilige Überschriften (Feld-Gruppen, in Lesereihenfolge). */
const HEADING_GROUPS = [
  ["h1Line1", "h1Line2Highlighted"],
  ["h2Line1", "h2Line2Highlighted"],
  ["headlineLine1", "headlineLine2"],
  ["headingLine1", "headingLine2"],
  ["headlinePrefix", "headlineAccent", "headlineSuffix"],
  ["headingLead", "headingHighlight"],
  ["titleLine1", "titleLine2", "titleAccent"],
];

/** Label-Felder, die eine Unterüberschrift über einer Liste sind. */
const LABEL_HEADING_KEYS = new Set(["label", "passtLabel", "passtNichtLabel", "listLabel", "uebernahmeLabel"]);

/** Aus einem Objekt zusammengesetzte Überschrift („lead" + „highlight" …). */
const objectHeading = (v) =>
  clean(Object.values(v).filter((x) => typeof x === "string").join(" "));

/** Überschrift eines Abschnitts-Objekts + die dabei verbrauchten Feldnamen. */
const headingOf = (o) => {
  for (const group of HEADING_GROUPS) {
    if (group.some((k) => typeof o[k] === "string")) {
      const text = clean(group.map((k) => o[k]).filter((v) => typeof v === "string").join(" "));
      if (text) return { text, used: group };
    }
  }
  for (const k of HEADING_KEYS) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return { text: clean(v), used: [k] };
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const text = objectHeading(v);
      if (text) return { text, used: [k] };
    }
  }
  return null;
};

/** Vergleichszeile aus painPoints (`compare.rows`): Kriterium / NEWEDGE / Alternative. */
const isCompareRow = (v) => v && typeof v === "object" && typeof v.k === "string" && typeof v.ne === "string";

/**
 * Rendert ein Content-Objekt rekursiv zu semantischem Markup.
 * Strings werden per Allowlist ausgegeben (TEXT_KEYS / Überschriften-Felder),
 * Objekte und Arrays per Blocklist (SKIP_CONTAINERS) durchlaufen. Alles, was
 * nicht erkannt wird, fällt still raus — so landet garantiert kein
 * Button-Label, kein Platzhalter und kein ARIA-Text im Textkörper.
 */
const renderSection = (obj, level, out) => {
  if (!obj || typeof obj !== "object" || level > 5) return;
  const used = new Set();
  const h = headingOf(obj);
  if (h) {
    h.used.forEach((k) => used.add(k));
    out.push({ tag: `h${Math.min(level, 6)}`, text: h.text });
  }
  for (const [key, val] of Object.entries(obj)) {
    if (used.has(key) || SKIP_CONTAINERS.has(key)) continue;
    if (typeof val === "string") {
      if (TEXT_KEYS.has(key) && val.trim()) out.push({ tag: "p", text: clean(val) });
      // `h3` ist in painPoints.ts der beschreibende Untertitel unter der h2 —
      // und `*Label` die Überschrift über einer Aufzählung.
      else if ((key === "h3" || LABEL_HEADING_KEYS.has(key)) && val.trim())
        out.push({ tag: `h${Math.min(level + 1, 6)}`, text: clean(val) });
      continue;
    }
    if (Array.isArray(val)) {
      if (!val.length) continue;
      if (val.every((v) => typeof v === "string")) {
        // Fließtext-Felder als Absätze, Aufzählungen als Liste.
        if (TEXT_KEYS.has(key)) val.forEach((v) => out.push({ tag: "p", text: clean(v) }));
        else out.push({ tag: "ul", items: val.map(clean) });
        continue;
      }
      if (val.every(isCompareRow)) {
        out.push({ tag: "ul", items: val.map((r) => `${clean(r.k)}: ${clean(r.ne)}`) });
        continue;
      }
      val.forEach((item) => renderSection(item, level + 1, out));
      continue;
    }
    if (val && typeof val === "object") renderSection(val, level + 1, out);
  }
};

/** FAQ-Blöcke ausdrücklich als h3 + p (unabhängig von der Schachteltiefe). */
const renderFaq = (faq, out) => {
  const items = Array.isArray(faq) ? faq : Array.isArray(faq?.items) ? faq.items : [];
  const heading = !Array.isArray(faq) && typeof faq?.heading === "string" ? faq.heading : null;
  if (heading) out.push({ tag: "h2", text: clean(heading) });
  for (const it of items) {
    if (!it?.q || !it?.a) continue;
    out.push({ tag: "h3", text: clean(it.q) });
    out.push({ tag: "p", text: clean(it.a) });
  }
};

/** Alle FAQ-Paare einer Seite einsammeln (für FAQPage-JSON-LD). */
const collectFaq = (page) => {
  const faq = page?.faq;
  const items = Array.isArray(faq) ? faq : Array.isArray(faq?.items) ? faq.items : [];
  return items.filter((it) => it?.q && it?.a).map((it) => ({ q: clean(it.q), a: clean(it.a) }));
};

/* ── Seitentyp-spezifische Gliederungen ── */

/** Blueprint- und Branchenseiten (painPoints.ts). */
const bodyPainPoint = (pp) => {
  const out = [];
  renderSection(pp.hero, 2, out);
  for (const key of ["definition", "feature1", "feature2", "feature3", "integrations", "compare", "featureCards"]) {
    renderSection(pp[key], 2, out);
  }
  renderFaq(pp.faq, out);
  renderSection(pp.closingCta, 2, out);
  return out;
};

/** Landingpages mit Abschnitts-Objekten (Cortex, KI-Audit, Methodik, …). */
const bodyFromPage = (page, order) => {
  const out = [];
  for (const key of order) {
    if (key === "faq") renderFaq(page.faq, out);
    else renderSection(page[key], 2, out);
  }
  return out;
};

/** Startseite: die Sektions-Module in der Reihenfolge von Index.tsx. */
const bodyHome = (lang) => {
  const c = C(lang);
  const out = [];
  for (const sec of [
    c.secHero, c.secStatementStats, c.secDiamondModel, c.secCortex, c.secBuiltOnTop,
    c.secEmbeddedAI, c.secDerSchnitt, c.secTeamSupport, c.secThreeStepsCTA,
  ]) {
    renderSection(sec, 2, out);
  }
  return out;
};

/**
 * KI-Glossar: Beschreibung und Subline stehen als Vorlage mit `{total}` im
 * Content. Der Platzhalter wird mit der TATSÄCHLICHEN Anzahl der Begriffe im
 * Glossar gefüllt — dieselbe Zahl, die die Seite zur Laufzeit selbst einsetzt.
 * (Vorher wurde `{total}` beim Extrahieren ersatzlos gestrichen, seit der
 * Umstellung auf `descriptionTemplate` fiel die Seite ganz durchs Raster und
 * bekam gar keinen Head.)
 */
const glossarTotal = (g) =>
  Object.values(g.glossary ?? {}).reduce((n, arr) => n + (Array.isArray(arr) ? arr.length : 0), 0);

const glossarSeo = (g) => {
  const total = glossarTotal(g);
  return {
    title: g.seo.title,
    description: g.seo.description || String(g.seo.descriptionTemplate || "").replace(/\{total\}/g, total),
    canonical: g.seo.canonical,
  };
};

const bodyGlossar = (g) => {
  const total = glossarTotal(g);
  const out = [];
  if (g.hero?.headline) out.push({ tag: "h2", text: clean(g.hero.headline) });
  const subline = g.hero?.subline || String(g.hero?.sublineTemplate || "").replace(/\{total\}/g, total);
  if (subline) out.push({ tag: "p", text: clean(subline) });
  // Buchstaben-Gruppen als h2 — dieselben Gruppentitel, die die Seite sichtbar
  // rendert. renderSection würde die Map-Schlüssel (A, B, …) verschlucken und
  // die Begriffe direkt als h3 unter die h1 hängen.
  for (const [letter, terms] of Object.entries(g.glossary || {})) {
    if (!Array.isArray(terms) || !terms.length) continue;
    out.push({ tag: "h2", text: letter });
    for (const t of terms) {
      if (t?.term) out.push({ tag: "h3", text: clean(t.term) });
      if (t?.def) out.push({ tag: "p", text: clean(t.def) });
    }
  }
  renderSection(g.cta, 2, out);
  return out;
};

/** ROI-Rechner: Inhalte liegen im UI-Wörterbuch der .tsx-Seite. */
const bodyRoi = (lang) => {
  const b = roiBlock(lang);
  const out = [];
  const jsx = /heroTitle:\s*<>([\s\S]*?)<\/>/.exec(b);
  if (jsx) out.push({ tag: "h2", text: clean(jsx[1].replace(/<[^>]*>/g, "")) });
  const push = (key, tag) => {
    const v = strAfter(b, key);
    if (v) out.push({ tag, text: clean(v) });
  };
  push("heroSub", "p");
  push("s1Title", "h2"); push("s1Sub", "p");
  push("s2Title", "h2");
  push("s3Title", "h2"); push("s3Sub", "p");
  push("benefitTitle", "h2"); push("benefitSub", "p");
  push("roadmapTitle", "h2"); push("roadmapSub", "p");
  push("reportTitle", "h2"); push("reportSub", "p");
  return out;
};

/* ── Interne Verlinkung (Quelle: nav.ts) ── */
const navLinks = (lang) => {
  const nav = C(lang).nav;
  const p = lang === "en" ? "/en" : "";
  const links = [
    { href: p || "/", label: clean(C(lang).home.seo.title.split("|")[0]) },
    { href: p + nav.angebot.to, label: clean(nav.angebot.label) },
    ...nav.painPoints.map((i) => ({ href: p + i.to, label: clean(i.label) })),
    ...nav.industrien.map((i) => ({ href: p + i.to, label: clean(i.label) })),
    { href: p + "/cortex", label: clean(C(lang).cortexPage.seo.title.split("|")[0].split(":")[0]) },
    { href: p + "/ki-audit", label: clean(C(lang).kiAudit.seo.title.split("|")[0].split(":")[0]) },
    { href: p + "/ki-glossar", label: clean(C(lang).kiGlossar.seo.title.split("|")[0].split(":")[0]) },
    // Diese drei stehen im echten Footer, nicht in nav.ts. Ohne sie wären sie
    // im ausgelieferten HTML Waisen: für Crawler, die kein JavaScript
    // ausführen, gäbe es außer der Sitemap keinen Weg dorthin.
    { href: p + "/websites", label: clean(C(lang).webDesign.seo.title.split("|")[0]) },
    { href: p + "/roi-rechner", label: clean((seoFromRoi(lang).title || "").split("|")[0].split("—")[0]) },
    { href: p + "/sicherheit", label: clean(C(lang).sicherheit.seo.title.split("|")[0]) },
    { href: p + "/kontakt", label: clean(C(lang).contact.seo.title.split("|")[0].split("&")[0]) },
  ];
  // Selbstlinks sind erlaubt und schaden nicht; Duplikate werden entfernt.
  const seen = new Set();
  return links.filter((l) => (seen.has(l.href) ? false : seen.add(l.href)));
};

/**
 * Baut aus den Blöcken das ausgelieferte Markup.
 *
 * Platzierung: als ERSTES Kind von <div id="root">, nicht davor.
 * Begründung — die Vorgabe war „muss beim Hydrieren verschwinden, damit Nutzer
 * ihn nie doppelt sehen". Genau das garantiert diese Position ohne eine Zeile
 * zusätzliches JavaScript: `createRoot(rootElement).render(...)` in
 * src/main.tsx leert den Container beim ersten Render. Ein Block VOR dem
 * Container bräuchte ein eigenes Aufräum-Skript, und wenn das (Fehler beim
 * Laden, blockiertes Inline-Skript) nicht läuft, bliebe der Doppeltext dauerhaft
 * im DOM. Zusätzlich ist der Block per Inline-Style aus dem Sichtfeld gerückt
 * (nicht `display:none`, das würde ihn für Text-Extraktoren unsichtbar machen) —
 * er kann das Layout also auch in der Sekunde vor dem Mount nicht stören.
 * Für nicht-rendernde Crawler steht er trotzdem ganz normal im HTML-Quelltext.
 */
const renderBody = (blocks, links) => {
  const parts = [];
  let h1Done = false;
  for (const b of blocks) {
    if (b.tag === "ul") {
      if (!b.items?.length) continue;
      parts.push(`<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`);
      continue;
    }
    if (!b.text) continue;
    let tag = b.tag;
    if (tag.startsWith("h")) {
      if (!h1Done) { tag = "h1"; h1Done = true; }
      else if (tag === "h1") tag = "h2";
    }
    parts.push(`<${tag}>${esc(b.text)}</${tag}>`);
  }
  parts.push(`<nav>${links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join(" ")}</nav>`);
  return (
    `<div id="seo-prerender" aria-hidden="true" ` +
    `style="position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden">` +
    parts.join("") +
    `</div>`
  );
};

/* ══════════════════════════════════════════════════════════════
   D — JSON-LD
   ══════════════════════════════════════════════════════════════ */

/** Organization/LocalBusiness — sprachabhängig, wie bisher. */
const orgLd = (lang) => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
  "@id": `${BASE}/#organization`,
  name: "NEWEDGE Brand",
  alternateName: "NEWEDGE",
  url: BASE,
  logo: `${BASE}/logo.png`,
  description:
    lang === "en"
      ? "NEWEDGE builds the AI department for mid-sized companies – from the first analysis through Cortex, the secure entry point for AI, to running automations day to day. From Munich, for the DACH region."
      : "NEWEDGE baut die KI-Abteilung für den Mittelstand – von der ersten Analyse über den sicheren KI-Einstiegspunkt Cortex bis zum laufenden Betrieb von Automatisierungen. Aus München, für den DACH-Raum.",
  address: { "@type": "PostalAddress", addressLocality: "München", addressRegion: "Bayern", addressCountry: "DE" },
  email: "info@newedgebrand.com",
  sameAs: ["https://www.linkedin.com/company/new-edge-brand/"],
});

/**
 * WebSite — @id identisch mit dem clientseitig injizierten Schema
 * (StructuredData.tsx), damit Google beide als dieselbe Entität liest und
 * nicht als Dublette.
 */
const websiteLd = (lang) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE}/#website`,
  url: lang === "en" ? `${BASE}/en` : BASE,
  name: "NEWEDGE Brand",
  alternateName: "NEWEDGE",
  inLanguage: lang === "en" ? "en" : "de-DE",
  publisher: { "@id": `${BASE}/#organization` },
});

/**
 * BreadcrumbList — zwei Stufen: Startseite → aktuelle Seite.
 * Bewusst OHNE Zwischenstufe für /loesungen bzw. /industrien: diese Pfade sind
 * in App.tsx keine eigenen Routen (nur `:slug`-Kinder), eine Krume dorthin
 * zeigte also auf eine 404-Adresse. Die Namen stammen aus dem jeweiligen
 * SEO-Titel, es wird kein Label erfunden.
 */
const breadcrumbLd = (lang, canonicalPath, pageTitle) => {
  const homePath = lang === "en" ? "/en" : "/";
  const homeName = clean(C(lang).home.seo.title.split("|")[0]);
  const items = [{ "@type": "ListItem", position: 1, name: homeName, item: BASE + (homePath === "/" ? "/" : homePath) }];
  if (canonicalPath !== homePath && canonicalPath !== "/") {
    items.push({ "@type": "ListItem", position: 2, name: clean(pageTitle.split("|")[0]), item: BASE + canonicalPath });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${BASE}${canonicalPath}#breadcrumb`,
    itemListElement: items,
  };
};

/**
 * WebPage je Route — trägt das Frischesignal `dateModified`.
 *
 * Das Datum ist die mtime der Content-Quelldatei, also derselbe Wert wie
 * `<lastmod>` in der Sitemap. Fehlt die Datei, entfällt das Feld ersatzlos:
 * lieber kein Datum als ein erfundenes.
 */
const webPageLd = (lang, canonicalPath, seo, lastmod) => {
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE}${canonicalPath}#webpage`,
    url: BASE + canonicalPath,
    name: clean(seo.title),
    inLanguage: lang === "en" ? "en" : "de",
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
  };
  if (seo.description) ld.description = clean(seo.description);
  if (lastmod) ld.dateModified = lastmod;
  return ld;
};

const faqLd = (canonicalPath, faq) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${BASE}${canonicalPath}#faq`,
  mainEntity: faq.map((e) => ({
    "@type": "Question",
    name: e.q,
    acceptedAnswer: { "@type": "Answer", text: e.a },
  })),
});

/* ══════════════════════════════════════════════════════════════
   E — Routen
   ══════════════════════════════════════════════════════════════ */
/**
 * Hier stehen ausschließlich die KANONISCHEN Slugs — identisch mit dem Feld
 * `slug` in painPoints.ts und mit `seo.canonical`. Die alten Slugs
 * (auswahlverfahren, compliance, kpi-dashboard, ki-kundensupport,
 * entscheidungsinstanzen) leben nur noch als Alias-Keys in der painPoints-Map
 * weiter und bekommen bewusst KEINEN eigenen Head gebacken — sonst entstünde
 * Duplicate Content.
 *
 * Hier stehen NUR die vier Blueprints. Nicht mehr enthalten:
 *   - "foerderungen-entscheidungsinstanzen": ist eine BRANCHE, ihre kanonische
 *     URL lautet /industrien/<slug> (steht unten in INDUSTRY_SLUGS).
 *   - "health-care", "handel-supply-chain", "professional-services": 2026-08
 *     abgekündigt (siehe INDUSTRY_SLUGS).
 */
const SLUGS = ["entscheidungen-fallpruefung", "dokumente-prozesse", "steuerung-reporting", "service-fallbearbeitung"];

/**
 * Branchenseiten. Ihr `seo.canonical` in painPoints.ts lautet /industrien/<slug>,
 * ausgeliefert wurden sie früher nur unter /loesungen/<slug>. Deshalb bekommen
 * sie hier zusätzlich ihre kanonische Route gebacken.
 *
 * ABGEKÜNDIGT 2026-08: "health-care", "handel-supply-chain" und
 * "professional-services" bekommen KEINEN Head und KEINEN Sitemap-Eintrag mehr.
 * Ihre `seo.description` trägt unbelegte Ergebniszahlen; gebacken landete das
 * als fertiges Google-Snippet im HTML — für Seiten, die nirgends verlinkt sind.
 */
const INDUSTRY_SLUGS = ["foerderungen-entscheidungsinstanzen", "versicherungen", "bildung", "immobilien"];

const CORTEX_ORDER = ["hero", "problem", "solution", "ablauf", "warum", "garantie", "fit", "faq", "cta"];
const METHODIK_ORDER = ["hero", "manifest", "stufenSection", "stufen", "ziel", "cta"];
const WEBDESIGN_ORDER = ["hero", "prozess", "cases", "finalCta"];
const CONTACT_ORDER = ["hero"];
// `legal` bewusst nicht dabei: nur ein Linklabel auf /impressum, kein Fließtext.
const SICHERHEIT_ORDER = ["hero", "summary", "sections", "grenzen", "cta"];
// Rechtsseite: Impressum + Datenschutz. Bekommt einen eigenen Kopf, damit sie
// nicht über den SPA-Fallback als Dublette der Startseite ausgeliefert wird.
// `page` liefert die H1 („Impressum & Datenschutz"), die beiden Sektionen
// ihre H2 + H3-Unterabschnitte — exakt die Gliederung, die der Client rendert.
const IMPRESSUM_ORDER = ["page", "impressumSection", "datenschutzSection"];

/** Eine Route: Pfad, SEO-Werte, Textkörper-Blöcke, FAQ, Quelldatei (lastmod). */
const routesFor = (lang) => {
  const c = C(lang);
  const M = CONTENT_MODULES[lang];
  const page = (path, ns, order, changefreq = "monthly", priority = "0.8") => ({
    path,
    seo: c[ns].seo,
    blocks: bodyFromPage(c[ns], order),
    faq: collectFaq(c[ns]),
    src: moduleFile(M[ns]),
    changefreq,
    priority,
  });

  const painPointRoute = (prefix, slug) => {
    const pp = painPointsOf(lang)[slug];
    return {
      path: `${prefix}/${slug}`,
      seo: pp.seo,
      blocks: bodyPainPoint(pp),
      faq: collectFaq(pp),
      src: moduleFile(M.painPoints),
      changefreq: "monthly",
      priority: "0.8",
    };
  };

  return [
    {
      path: "/",
      seo: c.home.seo,
      blocks: bodyHome(lang),
      faq: [],
      src: moduleFile(M.home),
      changefreq: "weekly",
      priority: "1.0",
    },
    page("/methodik", "methodik", METHODIK_ORDER),
    page("/kontakt", "contact", CONTACT_ORDER, "monthly", "0.7"),
    page("/ki-audit", "kiAudit", CORTEX_ORDER, "monthly", "0.9"),
    page("/cortex", "cortexPage", CORTEX_ORDER, "monthly", "0.9"),
    page("/websites", "webDesign", WEBDESIGN_ORDER),
    page("/sicherheit", "sicherheit", SICHERHEIT_ORDER, "monthly", "0.7"),
    page("/impressum", "impressum", IMPRESSUM_ORDER, "yearly", "0.3"),
    {
      path: "/ki-glossar",
      seo: glossarSeo(c.kiGlossar),
      blocks: bodyGlossar(c.kiGlossar),
      faq: [],
      src: moduleFile(M.kiGlossar),
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      path: "/roi-rechner",
      seo: seoFromRoi(lang),
      blocks: bodyRoi(lang),
      faq: [],
      src: join(ROOT, ROI_FILE),
      changefreq: "monthly",
      priority: "0.7",
    },
    ...SLUGS.map((s) => painPointRoute("/loesungen", s)),
    ...INDUSTRY_SLUGS.map((s) => painPointRoute("/industrien", s)),
  ];
};

/* ══════════════════════════════════════════════════════════════
   F — HTML zusammensetzen
   ══════════════════════════════════════════════════════════════ */
const replaceMeta = (html, selectorAttr, value) => {
  const re = new RegExp(`(<meta[^>]*${selectorAttr}[^>]*content=")[^"]*(")`, "i");
  return re.test(html) ? html.replace(re, `$1${esc(value)}$2`) : html;
};

const buildHtml = ({ seo, canonicalPath, lang, body, schemas }) => {
  const url = BASE + canonicalPath;
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(seo.title)}</title>`);
  // hreflang: Die Seite liegt zweisprachig unter denselben Slugs (DE unter "/",
  // EN unter "/en"). Ohne diese Tags behandelt Google beide Fassungen als
  // konkurrierende Duplikate statt als Sprachvarianten. Muss HIER stehen: der
  // Crawler sieht das vorgerenderte HTML, nicht das, was React-Helmet nachträgt.
  const pfadOhneSprache = canonicalPath.replace(/^\/en(?=\/|$)/, "") || "/";
  const urlDe = BASE + (pfadOhneSprache === "/" ? "" : pfadOhneSprache);
  const urlEn = BASE + "/en" + (pfadOhneSprache === "/" ? "" : pfadOhneSprache);
  const alternates =
    `\n    <link rel="alternate" hreflang="de" href="${esc(urlDe)}" />` +
    `\n    <link rel="alternate" hreflang="en" href="${esc(urlEn)}" />` +
    `\n    <link rel="alternate" hreflang="x-default" href="${esc(urlDe)}" />`;

  html = html.replace(
    /<\/title>/i,
    `</title>\n    <meta name="description" content="${esc(seo.description)}" />\n    <link rel="canonical" href="${esc(url)}" />${alternates}\n    <meta property="og:locale" content="${lang === "en" ? "en_US" : "de_DE"}" />\n    <meta property="og:locale:alternate" content="${lang === "en" ? "de_DE" : "en_US"}" />`
  );
  html = html.replace(/<html([^>]*)\slang="[^"]*"/i, `<html$1 lang="${lang}"`);
  html = replaceMeta(html, 'property="og:title"', seo.title);
  html = replaceMeta(html, 'name="twitter:title"', seo.title);
  html = replaceMeta(html, 'property="og:description"', seo.description);
  html = replaceMeta(html, 'name="twitter:description"', seo.description);
  html = replaceMeta(html, 'property="og:url"', url);
  html = replaceMeta(html, 'property="og:image"', OG_IMAGE);

  const ld = schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n  ");
  html = html.replace(/<\/head>/i, `  ${ld}\n  </head>`);

  // Textkörper als erstes Kind von #root (siehe Kommentar bei renderBody).
  html = html.replace(/(<div id="root"[^>]*>)/i, `$1${body}`);
  return html;
};

const writeRoute = (path, html) => {
  const out = path === "/" ? join(DIST, "index.html") : join(DIST, path.replace(/^\//, ""), "index.html");
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, html, "utf8");
};

/* ══════════════════════════════════════════════════════════════
   G — Ausführen
   ══════════════════════════════════════════════════════════════ */
let ok = 0, skip = 0;
const sitemapEntries = [];
const measured = [];

for (const { lang, prefix } of [{ lang: "de", prefix: "" }, { lang: "en", prefix: "/en" }]) {
  for (const r of routesFor(lang)) {
    if (!r.seo || !r.seo.title || !r.seo.description) {
      console.warn(`[prerender-seo] SKIP ${prefix}${r.path} — Titel/Description nicht extrahierbar`);
      skip++;
      continue;
    }
    // canonical kommt aus dem Content (`seo.canonical`), NICHT aus dem
    // Ausgabepfad. Die EN-Werte enthalten das /en-Präfix bereits — deshalb nur
    // beim Routen-Fallback präfixen.
    const routeCanonical = prefix + (r.path === "/" ? (prefix ? "" : "/") : r.path);
    const canonicalPath = r.seo.canonical || routeCanonical || "/";

    // Änderungsdatum = mtime der Content-Quelldatei. Kein erfundenes Datum:
    // dieselbe Zahl, die auch als <lastmod> in die Sitemap geht.
    let lastmod;
    try { lastmod = statSync(r.src).mtime.toISOString().slice(0, 10); } catch { lastmod = null; }

    const schemas = [orgLd(lang), websiteLd(lang), breadcrumbLd(lang, canonicalPath, r.seo.title)];
    schemas.push(webPageLd(lang, canonicalPath, r.seo, lastmod));
    if (r.faq.length) schemas.push(faqLd(canonicalPath, r.faq));

    const body = renderBody(r.blocks, navLinks(lang));
    writeRoute(prefix + r.path, buildHtml({ seo: r.seo, canonicalPath, lang, body, schemas }));
    ok++;

    // Nachmessung: reiner Fließtext (ohne Markup) im ausgelieferten Body.
    const plain = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    measured.push({ route: prefix + r.path, chars: plain.length, faq: r.faq.length });

    // Sitemap-Eintrag (nur kanonische Pfade, keine Aliasse, keine
    // abgekündigten Branchen — die stehen gar nicht erst in den Routenlisten).
    sitemapEntries.push({ loc: canonicalPath, lastmod, changefreq: r.changefreq, priority: r.priority });
  }
}

/* ── Sitemap ── */
const abs = (p) => BASE + (p === "/" ? "/" : p);
const sitemapXml = () => {
  const urls = sitemapEntries
    .map((e) => {
      const ohneSprache = e.loc.replace(/^\/en(?=\/|$)/, "") || "/";
      const de = abs(ohneSprache);
      const en = BASE + "/en" + (ohneSprache === "/" ? "" : ohneSprache);
      return [
        "  <url>",
        `    <loc>${esc(abs(e.loc))}</loc>`,
        `    <xhtml:link rel="alternate" hreflang="de" href="${esc(de)}" />`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${esc(en)}" />`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(de)}" />`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        `    <changefreq>${e.changefreq}</changefreq>`,
        `    <priority>${e.priority}</priority>`,
        "  </url>",
      ].filter(Boolean).join("\n");
    })
    .join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    "<!--",
    "  AUTOMATISCH ERZEUGT von scripts/prerender-seo.mjs — nicht von Hand bearbeiten.",
    "  Quelle sind dieselben Routenlisten, aus denen auch die Heads gebacken werden;",
    "  damit können Sitemap und ausgelieferte Seiten nicht mehr auseinanderlaufen.",
    "  Enthalten sind ausschließlich kanonische Pfade — keine Alias-Slugs und keine",
    "  abgekündigten Branchenseiten.",
    "-->",
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
};
writeFileSync(join(DIST, "sitemap.xml"), sitemapXml(), "utf8");

/* ── Precache-Revision der Startseite nachziehen ──────────────────────────────
   vite-plugin-pwa berechnet das Precache-Manifest während `vite build` — also
   BEVOR dieses Skript index.html den Head und den Textkörper einsetzt. Die in
   sw.js hinterlegte `revision` gehört damit zu einer Datei, die so nie
   ausgeliefert wird. Solange sich auch die Bundle-Hashes ändern, fällt das
   nicht auf; ändert sich nur dieses Skript (neue Route, anderer Textkörper),
   bliebe die Startseite bei wiederkehrenden Besuchern mit installiertem
   Service Worker auf dem alten Stand stehen. Deshalb wird die Revision hier
   auf die Prüfsumme der TATSÄCHLICH ausgelieferten Datei gesetzt.
   Schlägt das Ersetzen fehl (anderes Workbox-Format), wird nur gewarnt — der
   Build darf daran nicht scheitern. */
const swFile = join(DIST, "sw.js");
if (existsSync(swFile)) {
  const realRev = createHash("md5").update(readFileSync(join(DIST, "index.html"))).digest("hex");
  const sw = readFileSync(swFile, "utf8");
  const re = /(\{url:"index\.html",revision:")[0-9a-f]{32}(")/;
  if (re.test(sw)) {
    writeFileSync(swFile, sw.replace(re, `$1${realRev}$2`), "utf8");
    console.log(`[prerender-seo] sw.js: Precache-Revision von index.html auf ${realRev} korrigiert.`);
  } else {
    console.warn("[prerender-seo] WARNUNG: Precache-Eintrag für index.html in sw.js nicht gefunden — Revision nicht korrigiert.");
  }
}

/* ── Bericht ── */
const min = Math.min(...measured.map((m) => m.chars));
const total = measured.reduce((s, m) => s + m.chars, 0);
console.log(`[prerender-seo] ${ok} Routen gebacken, ${skip} übersprungen.`);
console.log(`[prerender-seo] Sitemap: ${sitemapEntries.length} URLs → dist/sitemap.xml`);
console.log(`[prerender-seo] Fließtext im Body: min ${min} Zeichen, Summe ${total} Zeichen über ${measured.length} Seiten.`);
if (min === 0) {
  console.error("[prerender-seo] FEHLER: mindestens eine Route hat 0 Zeichen Fließtext.");
  process.exit(1);
}
if (process.env.PRERENDER_VERBOSE) {
  for (const m of measured) console.log(`  ${m.route.padEnd(48)} ${String(m.chars).padStart(7)} Zeichen  ${m.faq} FAQ`);
}
