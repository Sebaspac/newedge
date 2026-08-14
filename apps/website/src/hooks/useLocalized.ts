import { useLanguage } from "@/contexts/LanguageContext";
import { useCms } from "@/hooks/useCms";

/**
 * Locale-fähiger Single-Type-Hook (Aufsatz auf `useCms`).
 * --------------------------------------------------------------
 * Wählt anhand der aktiven Sprache den CMS-Single-Type + statischen Fallback:
 *   • DE → `/api/<apiBase>`      · Fallback `deStatic`
 *   • EN → `/api/<apiBase>-en`   · Fallback `enStatic`
 * DE und EN sind getrennte, je vollständig editierbare CMS-Einträge.
 * Ohne erreichbares CMS greift der sprachrichtige statische Fallback.
 * --------------------------------------------------------------
 */
export function useLocalized<T>(apiBase: string, deStatic: T, enStatic: unknown): T {
  const { language } = useLanguage();
  const api = language === "en" ? `${apiBase}-en` : apiBase;
  // EN- und DE-Fallback sind strukturgleich (Mirror), differieren nur in
  // Literal-Werten → EN als `unknown` annehmen und auf die DE-Form casten.
  const fallback = (language === "en" ? enStatic : deStatic) as T;
  return useCms(api, fallback);
}

/**
 * Rein statischer, locale-abhängiger Content (kein CMS-Single-Type dahinter,
 * z. B. Home-Sektionen, die nicht Teil des `/api/home`-Aggregats sind).
 * Wählt EN/DE anhand der aktiven Sprache.
 */
export function useLocalizedStatic<T>(deStatic: T, enStatic: unknown): T {
  const { language } = useLanguage();
  return (language === "en" ? enStatic : deStatic) as T;
}
