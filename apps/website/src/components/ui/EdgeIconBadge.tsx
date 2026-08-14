import type { CSSProperties } from "react";
import type { Icon } from "@tabler/icons-react";

/* ──────────────────────────────────────────────
   EdgeIconBadge — Icon-Badge im Board-Stil (2026-07)
   ----------------------------------------------
   Einheitlicher Icon-Look der Website: runder Kreis mit
   Tabler-Icon. Auf hellen Flächen Ink-Badge mit Lime-Icon,
   auf dunklen Flächen invertiert (Lime-Badge, Ink-Icon) —
   Lime nie als Strichfarbe auf hellem Grund.
   Optional `number` für Stations-/Schritt-Reihen: kleiner
   Lime-Punkt mit Ink-Ziffer oben rechts am Badge.
────────────────────────────────────────────── */

const LIME = "#CCFF00";
const INK = "#171717";

const SIZES = {
  /** Listen/Bullets */
  sm: { badge: 30, icon: 16, stroke: 2 },
  /** Karten/Feature-Flächen */
  md: { badge: 40, icon: 20, stroke: 1.9 },
  /** Stationen/Prozess-Reihen */
  lg: { badge: 52, icon: 26, stroke: 1.75 },
  /** Hero-artige Einzel-Features (z.B. Team-Support-Spalten) */
  xl: { badge: 68, icon: 30, stroke: 1.7 },
} as const;

export type EdgeIconBadgeSize = keyof typeof SIZES;

export const EdgeIconBadge = ({
  icon: IconCmp,
  size = "sm",
  tone = "ink",
  number,
  className = "",
  style,
}: {
  icon: Icon;
  size?: EdgeIconBadgeSize;
  /** ink = schwarzes Badge/Lime-Icon (helle Flächen); lime = invertiert (dunkle Flächen) */
  tone?: "ink" | "lime";
  /** Optionale Stations-Nummer als Lime-Punkt am Badge (nur sinnvoll ab size "lg") */
  number?: number;
  className?: string;
  style?: CSSProperties;
}) => {
  const s = SIZES[size];
  const bg = tone === "ink" ? INK : LIME;
  const fg = tone === "ink" ? LIME : INK;
  return (
    <span
      className={`relative shrink-0 flex items-center justify-center rounded-full ${className}`}
      style={{ width: `${s.badge}px`, height: `${s.badge}px`, background: bg, ...style }}
    >
      <IconCmp size={s.icon} stroke={s.stroke} color={fg} aria-hidden />
      {number !== undefined && (
        <span
          className="absolute flex items-center justify-center rounded-full"
          style={{
            top: "-4px",
            right: "-4px",
            width: "20px",
            height: "20px",
            background: LIME,
            color: INK,
            fontWeight: 700,
            fontSize: "11px",
            // Auf Lime-Badges braucht der Punkt eine Kante zum Badge
            boxShadow: tone === "lime" ? `0 0 0 1.5px ${INK}` : "none",
          }}
        >
          {number}
        </span>
      )}
    </span>
  );
};
