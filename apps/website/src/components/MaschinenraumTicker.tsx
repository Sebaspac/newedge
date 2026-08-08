import { useMemo } from "react";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { maschinenraumTicker as TICKER_STATIC } from "@/content/sections/maschinenraumTicker";
import { maschinenraumTicker as maschinenraumTickerEn } from "@/content/en/sections/maschinenraumTicker";
import { useLocalized } from "@/hooks/useLocalized";

/* ── Design tokens ── */
const LIME = "#CCFF00";
const MONO: React.CSSProperties = { fontFamily: "Consolas, ui-monospace, SFMono-Regular, Menlo, monospace" };

function fmt(d: Date) {
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

export const MaschinenraumTicker = () => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const maschinenraumTicker = useLocalized("maschinenraum-ticker", TICKER_STATIC, maschinenraumTickerEn);
  const items = useMemo(() => {
    const now = Date.now();
    return maschinenraumTicker.events.map((e) => ({
      ...e,
      time: fmt(new Date(now - e.minsAgo * 60_000)),
    }));
  }, [maschinenraumTicker.events]);

  return (
    <div
      aria-label={maschinenraumTicker.ariaLabel}
      className="relative overflow-hidden"
      style={{
        // Gleicher Verlauf wie die Footer-Karte darunter — nahtloser Übergang.
        background: "linear-gradient(160deg, #1F1F1F 0%, #171717 45%, #101010 100%)",
        borderTop: "1px solid rgba(255,255,255,0.14)",
        borderBottom: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <div
        className="flex w-max items-center py-2 hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animation: "ne-ticker 64s linear infinite" }}
      >
        {[...Array(2)].flatMap((_, dup) =>
          items.map((e, i) => (
            <Link
              key={`${dup}-${i}`}
              to={e.href}
              className="flex items-center gap-2 px-7 whitespace-nowrap"
              style={{ ...MONO, fontSize: "10px", letterSpacing: "0.16em", textDecoration: "none" }}
            >
              <span style={{ color: LIME }}>{e.time}</span>
              <span style={{ color: "rgba(255,255,255,0.68)" }}>{e.text}</span>
              <span aria-hidden style={{ color: "rgba(255,255,255,0.14)" }}>·</span>
            </Link>
          ))
        )}
      </div>
      <style>{`@keyframes ne-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
};
