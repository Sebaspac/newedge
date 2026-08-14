/**
 * Marken-CTAs (Rebrush 2026-07) — zentralisiert, damit alle Module
 * identische Buttons rendern. Referenz: Hero der Startseite.
 *
 * `EdgePillButton`  — primär: Pill mit Footer-Ink-Verlauf, weißes Label,
 *                     violetter Pfeil-Kreis; Hover: ganz Violett + Mini-Edge-Riss.
 * `EdgeTextButton`  — sekundär: ohne Farbe, nur Label + Pfeil.
 *                     `tone="light"` für dunkle Flächen (weißer Text).
 *
 * Rendert je nach Prop als <Link> (`to`), <a> (`href`) oder <button> (`onClick`).
 */
import { ArrowUpRight } from "lucide-react";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { EdgeRip } from "@/components/ui/EdgeRip";

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
/** Ink-Verlauf der Footer-Karte — Ruhezustand der primären Pill. */
const INK_GRADIENT = "linear-gradient(160deg, #1F1F1F 0%, #171717 45%, #101010 100%)";

interface EdgeCtaProps {
  children: React.ReactNode;
  /** Interner Link (react-router). */
  to?: string;
  /** Externer/harter Link. */
  href?: string;
  /** Button-Verhalten, falls kein Link. */
  onClick?: () => void;
  /** Nur relevant ohne `to`/`href`: `submit`, um als Formular-Absende-Button zu wirken. */
  type?: "button" | "submit";
  /** Deaktiviert den Button (z. B. während des Sendens). */
  disabled?: boolean;
  /** Textfarbe des sekundären Buttons: `dark` = Ink (Standard), `light` = Weiß für dunkle Flächen. */
  tone?: "dark" | "light";
  /** Füllung der primären Pill: `ink` = Ink-Verlauf (helle Flächen), `violet` = Violett, `frost` = transparent-weiß mit Violett-Hover (dunkle Flächen). */
  variant?: "ink" | "violet" | "frost";
}

const PILL_CLASS =
  "group relative inline-flex items-center gap-3 overflow-hidden transition-transform duration-200 hover:scale-[1.03]";

const PILL_STYLE: React.CSSProperties = {
  fontFamily: OUTFIT,
  fontSize: "15px",
  fontWeight: 600,
  padding: "10px 10px 10px 24px",
  background: INK_GRADIENT,
  color: "#fff",
  borderRadius: "999px",
};

/** Innenleben der Pill: Violett-Overlay (Hover), Label, Pfeil-Kreis, Mini-Riss (Hover). */
const PillInner = ({ children, variant = "ink" }: { children: React.ReactNode; variant?: "ink" | "violet" | "frost" }) => (
  <>
    {/* Hover-Overlay — Ink & Frost blenden auf Lime, Lime-Pill auf Ink (Inversion).
        Label-Farbe flippt mit, sonst wäre Weiß auf Lime bzw. Ink auf Ink unlesbar. */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      style={{ background: variant === "violet" ? INK_GRADIENT : LIME }}
    />
    <span
      className={`relative transition-colors duration-200 ${
        variant === "violet" ? "group-hover:text-white" : "group-hover:text-[#171717]"
      }`}
    >
      {children}
    </span>
    <span
      style={{
        position: "relative",
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        background: variant === "ink" ? LIME : variant === "violet" ? INK_DEEP : "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <ArrowUpRight style={{ width: "16px", height: "16px", color: variant === "violet" ? LIME : INK_DEEP }} />
    </span>
    {/* Kleiner Edge-Riss in der Lücke zwischen Label und Kreis — berührt keine Buchstaben */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      <EdgeRip style={{ top: "-1px", right: "46px", width: "9px", height: "20px" }} />
    </span>
  </>
);

/** Interner Pfad (`/…`) → geroutet + lokalisiert (LocaleLink); Anker (`#`) / extern (`http`, `//`) bleiben harte `<a>`-Links. */
const routeHref = (to?: string, href?: string): string | undefined =>
  to ?? (href && href.startsWith("/") && !href.startsWith("//") ? href : undefined);

export const EdgePillButton = ({ children, to, href, onClick, type = "button", disabled, variant = "ink" }: EdgeCtaProps) => {
  const inner = <PillInner variant={variant}>{children}</PillInner>;
  const bg = variant === "violet" ? LIME : variant === "frost" ? "rgba(255,255,255,0.14)" : INK_GRADIENT;
  const style: React.CSSProperties = {
    ...PILL_STYLE,
    background: bg,
    color: variant === "violet" ? INK_DEEP : "#fff",
    border: variant === "frost" ? "1px solid rgba(255,255,255,0.22)" : "none",
  };
  const routeTo = routeHref(to, href);
  if (routeTo)
    return (
      <Link to={routeTo} className={PILL_CLASS} style={style}>
        {inner}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={PILL_CLASS} style={style}>
        {inner}
      </a>
    );
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${PILL_CLASS} disabled:opacity-60 disabled:pointer-events-none`}
      style={{ ...style, cursor: "pointer" }}
    >
      {inner}
    </button>
  );
};

export const EdgeTextButton = ({ children, to, href, onClick, tone = "dark" }: EdgeCtaProps) => {
  const cls = "inline-flex items-center gap-2";
  const style: React.CSSProperties = {
    fontFamily: OUTFIT,
    fontSize: "15px",
    fontWeight: 600,
    color: tone === "light" ? "#fff" : INK_DEEP,
  };
  const inner = (
    <>
      {/* Dezenter Lime-Unterstrich nur unter dem Label, nicht unter dem Pfeil */}
      <span className="edge-underline">{children}</span>
      <ArrowUpRight style={{ width: "15px", height: "15px" }} />
    </>
  );
  const routeTo = routeHref(to, href);
  if (routeTo)
    return (
      <Link to={routeTo} className={cls} style={style}>
        {inner}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls} style={style}>
        {inner}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls} style={{ ...style, background: "none", border: "none", cursor: "pointer" }}>
      {inner}
    </button>
  );
};
