/**
 * Head-Prerender (Post-Build)
 * --------------------------------------------------------------
 * Reine SPA — react-helmet flusht clientseitig nicht zuverlässig, deshalb
 * bekommt jede statische Route hier ihr korrektes <title>/<meta description>/
 * canonical/OG/Twitter + Organization-JSON-LD DIREKT ins ausgelieferte HTML
 * gebacken (für Crawler, die kein JS ausführen — AI-Suche, Social-Preview).
 *
 * Die SEO-Werte werden build-zeitlich aus den Content-Quelldateien EXTRAHIERT
 * (kein zweiter Pflege-Ort → driftfrei). Wird nach `vite build` ausgeführt.
 *
 * Bewusst KEIN React-SSR: Spline/Three.js, dynamische Routen und die
 * clientseitig injizierten WebSite/FAQPage/Service-Schemas bleiben unberührt.
 * --------------------------------------------------------------
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const BASE = "https://newedgebrand.com";
const OG_IMAGE = `${BASE}/og-default.jpg`;

if (!existsSync(join(DIST, "index.html"))) {
  console.error("[prerender-seo] dist/index.html fehlt — erst `vite build` laufen lassen.");
  process.exit(1);
}
const template = readFileSync(join(DIST, "index.html"), "utf8");

/* ── Extraktion aus den Quelldateien ── */
const cache = new Map();
const read = (f) => {
  if (!cache.has(f)) cache.set(f, readFileSync(join(ROOT, f), "utf8"));
  return cache.get(f);
};
/** Erstes `key: "…"` (mit escapten Quotes) ab `from` im Quelltext. */
const strAfter = (src, key, from = 0) => {
  const re = new RegExp(key + '\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"');
  const m = re.exec(src.slice(from));
  return m ? m[1].replace(/\\"/g, '"') : null;
};
/** seo{title,description|descriptionTemplate} aus einer Content-Page-Datei. */
const seoFromPage = (file, anchor = "seo:") => {
  const src = read(file);
  const from = Math.max(0, src.indexOf(anchor));
  const title = strAfter(src, "title", from);
  let description = strAfter(src, "description", from);
  if (!description) {
    const tmpl = strAfter(src, "descriptionTemplate", from);
    if (tmpl) description = tmpl.replace(/\{total\}\s*/g, "").replace(/\s{2,}/g, " ").trim();
  }
  return { title, description };
};
/** seo eines Pain-Point-Slugs aus painPoints.ts (Anker = slug). */
const seoFromSlug = (file, slug) => seoFromPage(file, `slug: "${slug}"`);
/** roi-rechner: seoTitle/seoDescription (occ 0 = DE, 1 = EN) aus der .tsx. */
const seoFromRoi = (file, occ) => {
  const src = read(file);
  let idx = -1;
  for (let i = 0; i <= occ; i++) idx = src.indexOf("seoTitle:", idx + 1);
  return { title: strAfter(src, "seoTitle", idx), description: strAfter(src, "seoDescription", idx) };
};

/* ── Organization-JSON-LD (das einzige Helmet-only Schema; WebSite/FAQPage/
   Service werden clientseitig injiziert). Locale-abhängig, aus structuredData. ── */
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

/* ── Routen (statische, SEO-relevante Seiten) ── */
const SLUGS = ["auswahlverfahren", "compliance", "kpi-dashboard", "ki-kundensupport", "entscheidungsinstanzen", "health-care", "handel-supply-chain", "professional-services"];
const PAGES = [
  { path: "/", get: () => seoFromPage("src/content/pages/home.ts") },
  // { path: "/about", get: () => seoFromPage("src/content/pages/about.ts") },  // Über uns vorerst ausgeblendet
  { path: "/methodik", get: () => seoFromPage("src/content/pages/methodik.ts") },
  { path: "/kontakt", get: () => seoFromPage("src/content/pages/contact.ts") },
  { path: "/ki-audit", get: () => seoFromPage("src/content/pages/kiAudit.ts") },
  { path: "/cortex", get: () => seoFromPage("src/content/pages/cortex.ts") },
  { path: "/websites", get: () => seoFromPage("src/content/pages/webDesign.ts") },
  { path: "/ki-glossar", get: () => seoFromPage("src/content/pages/kiGlossar.ts") },
  { path: "/roi-rechner", get: () => seoFromRoi("src/pages/RoiRechner.tsx", 0) },
  ...SLUGS.map((s) => ({ path: `/loesungen/${s}`, get: () => seoFromSlug("src/content/painPoints.ts", s) })),
];
const PAGES_EN = [
  { path: "/", get: () => seoFromPage("src/content/en/pages/home.ts") },
  // { path: "/about", get: () => seoFromPage("src/content/en/pages/about.ts") },  // Über uns vorerst ausgeblendet
  { path: "/methodik", get: () => seoFromPage("src/content/en/pages/methodik.ts") },
  { path: "/kontakt", get: () => seoFromPage("src/content/en/pages/contact.ts") },
  { path: "/ki-audit", get: () => seoFromPage("src/content/en/pages/kiAudit.ts") },
  { path: "/cortex", get: () => seoFromPage("src/content/en/pages/cortex.ts") },
  { path: "/websites", get: () => seoFromPage("src/content/en/pages/webDesign.ts") },
  { path: "/ki-glossar", get: () => seoFromPage("src/content/en/pages/kiGlossar.ts") },
  { path: "/roi-rechner", get: () => seoFromRoi("src/pages/RoiRechner.tsx", 1) },
  ...SLUGS.map((s) => ({ path: `/loesungen/${s}`, get: () => seoFromSlug("src/content/en/painPoints.ts", s) })),
];

/* ── HTML zusammensetzen ── */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const replaceMeta = (html, selectorAttr, value) => {
  // ersetzt content="…" im ersten <meta …selectorAttr…>
  const re = new RegExp(`(<meta[^>]*${selectorAttr}[^>]*content=")[^"]*(")`, "i");
  return re.test(html) ? html.replace(re, `$1${esc(value)}$2`) : html;
};

const buildHtml = (seo, canonicalPath, lang) => {
  const url = BASE + canonicalPath;
  let html = template;
  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(seo.title)}</title>`);
  // description + canonical direkt nach <title> injizieren (index.html hat beides statisch nicht)
  html = html.replace(
    /<\/title>/i,
    `</title>\n    <meta name="description" content="${esc(seo.description)}" />\n    <link rel="canonical" href="${esc(url)}" />`
  );
  // OG / Twitter aktualisieren (statische Tags aus index.html überschreiben)
  html = replaceMeta(html, 'property="og:title"', seo.title);
  html = replaceMeta(html, 'name="twitter:title"', seo.title);
  html = replaceMeta(html, 'property="og:description"', seo.description);
  html = replaceMeta(html, 'name="twitter:description"', seo.description);
  html = replaceMeta(html, 'property="og:url"', url);
  html = replaceMeta(html, 'property="og:image"', OG_IMAGE);
  // Organization-JSON-LD vor </head>
  const ld = `<script type="application/ld+json">${JSON.stringify(orgLd(lang))}</script>`;
  html = html.replace(/<\/head>/i, `  ${ld}\n  </head>`);
  return html;
};

const writeRoute = (path, html) => {
  const out = path === "/" ? join(DIST, "index.html") : join(DIST, path.replace(/^\//, ""), "index.html");
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, html, "utf8");
};

let ok = 0, skip = 0;
for (const { list, lang, prefix } of [
  { list: PAGES, lang: "de", prefix: "" },
  { list: PAGES_EN, lang: "en", prefix: "/en" },
]) {
  for (const r of list) {
    let seo;
    try { seo = r.get(); } catch (e) { seo = null; }
    if (!seo || !seo.title || !seo.description) {
      console.warn(`[prerender-seo] SKIP ${prefix}${r.path} — Titel/Description nicht extrahierbar`);
      skip++;
      continue;
    }
    const canonicalPath = prefix + (r.path === "/" ? (prefix ? "" : "/") : r.path);
    writeRoute(prefix + r.path, buildHtml(seo, canonicalPath || "/", lang));
    ok++;
  }
}
console.log(`[prerender-seo] ${ok} Routen gebacken, ${skip} übersprungen.`);
