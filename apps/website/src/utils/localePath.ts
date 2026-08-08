/**
 * Locale-Routing-Helfer für das `/en`-Präfix.
 * --------------------------------------------------------------
 * DE-Routen bleiben unter `/…`, EN-Routen liegen unter `/en/…`.
 * `localizePath` präfixt interne Absolut-Pfade sprachrichtig; Anker
 * (`#…`), externe Links (`http…`, `//…`) und Nicht-Pfade bleiben unberührt.
 * --------------------------------------------------------------
 */
export type Lang = "de" | "en";

/** Entfernt ein führendes `/en`-Segment (macht aus EN- wieder DE-Pfad). */
export function stripLocale(to: string): string {
  if (to === "/en") return "/";
  if (to.startsWith("/en/")) return to.slice(3) || "/";
  return to;
}

/** Präfixt einen internen Pfad mit dem Locale-Segment (EN → `/en/…`, DE unverändert). */
export function localizePath(to: string, language: Lang): string {
  // Nur interne Absolut-Pfade lokalisieren; Anker/extern/relativ unangetastet lassen.
  if (!to || to[0] !== "/" || to.startsWith("//")) return to;
  const base = stripLocale(to);
  if (language !== "en") return base;
  return base === "/" ? "/en" : `/en${base}`;
}

/** Aktuellen Pfad in die jeweils andere Sprache überführen (für den Toggle). */
export function switchLocalePath(pathname: string, next: Lang): string {
  return localizePath(stripLocale(pathname), next);
}
