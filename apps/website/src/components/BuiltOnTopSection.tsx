import {
  IconMessageChatbot,
  IconRobot,
  IconRouteAltRight,
  IconLayoutDashboard,
  IconTools,
  IconTag,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { EdgeIconBadge } from "@/components/ui/EdgeIconBadge";
import { EdgePillButton } from "@/components/ui/EdgeCta";
import { builtOnTop as BOT_STATIC } from "@/content/sections/builtOnTop";
import { builtOnTop as builtOnTopEn } from "@/content/en/sections/builtOnTop";
import type { BuiltOnTopItem } from "@/content/sections/builtOnTop";
import { useLocalizedStatic } from "@/hooks/useLocalized";

/* ── Design tokens (identisch zur Infrastruktur-Section) ── */
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const HAIRLINE = "rgba(23,23,23,0.14)";

/** Icon-Key aus dem Content-Layer → Tabler-Icon (Content bleibt serialisierbar). */
const ICONS: Record<BuiltOnTopItem["icon"], Icon> = {
  chat: IconMessageChatbot,
  agent: IconRobot,
  process: IconRouteAltRight,
  dashboard: IconLayoutDashboard,
  project: IconTools,
  whitelabel: IconTag,
};

/**
 * „Darauf aufgebaut" — Folge-Modul zur lokalen Infrastruktur.
 * Zeigt als Karten-Raster, was auf dem Fundament entsteht (Firmen-GPT,
 * Agenten, Prozesse, Dashboards, interne Projekte, White Label).
 * Bewusst hell und rasterförmig — als Gegenstück zur dunklen
 * Diagramm-Karte des Infrastruktur-Moduls davor.
 */
export const BuiltOnTopSection = () => {
  const builtOnTop = useLocalizedStatic(BOT_STATIC, builtOnTopEn);

  const scrollToCta = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("cta")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section aria-label={builtOnTop.ariaLabel} className="relative">
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 w-full" style={{ paddingTop: "clamp(56px, 8vh, 96px)", paddingBottom: "clamp(56px, 8vh, 96px)" }}>

        {/* ── Header: Eyebrow + Headline + Subline ── */}
        <p
          style={{
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(23,23,23,0.68)",
            marginBottom: "12px",
          }}
        >
          {builtOnTop.eyebrow}
        </p>
        <h2 style={{ color: INK_DEEP }}>{builtOnTop.heading}</h2>
        <p style={{ color: INK, maxWidth: "62ch", marginBottom: "clamp(36px, 5vh, 56px)" }}>
          {builtOnTop.subtitle}
        </p>

        {/* ── Karten-Raster: 1 / 2 / 3 Spalten ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "16px" }}>
          {builtOnTop.items.map(({ icon, title, desc }) => (
            <div
              key={title}
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                border: `1px solid ${HAIRLINE}`,
                boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <EdgeIconBadge icon={ICONS[icon]} size="md" />
              <h3 style={{ color: INK_DEEP, marginTop: "2px" }}>{title}</h3>
              <p style={{ color: INK, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: "clamp(28px, 4vh, 40px)" }}>
          <EdgePillButton onClick={scrollToCta}>
            {builtOnTop.cta.replace(/\s*→\s*$/, "")}
          </EdgePillButton>
        </div>
      </div>
    </section>
  );
};
