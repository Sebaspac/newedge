import { useCountUp } from "@/hooks/useCountUp";
import { impactCounter as IMPACT_STATIC, type Metric as MetricData } from "@/content/sections/impactCounter";
import { impactCounter as impactCounterEn } from "@/content/en/sections/impactCounter";
import { useHomeSection } from "@/hooks/useHomeContent";

/* ── Design tokens (Ink & Edge) ── */
const INK_DEEP = "#17172E";
const HAIRLINE = "#E6E6E6";
const DISPLAY: React.CSSProperties = { fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 700 };
const MONO: React.CSSProperties = { fontFamily: "Consolas, ui-monospace, SFMono-Regular, Menlo, monospace" };

/* KPI BAR — NEWEDGE in Zahlen (Struktur V2, 02).
   `value` zählt hoch; `prefix`/`suffix` bleiben statisch. */

function Metric({ prefix, value, suffix, label }: MetricData) {
  const [ref, current] = useCountUp(value, 1100);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col items-start py-7 md:py-9 px-6 md:px-10"
      style={{ background: "#FFFFFF" }}
    >
      <span
        style={{
          ...DISPLAY,
          fontSize: "clamp(1.85rem, 3.4vw, 2.75rem)",
          lineHeight: 1,
          color: INK_DEEP,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        {prefix}
        {current}
        {suffix}
      </span>
      <span
        className="mt-2 uppercase"
        style={{ ...MONO, fontSize: "10px", letterSpacing: "0.2em", color: "#8A8494" }}
      >
        {label}
      </span>
    </div>
  );
}

export const ImpactCounterBand = () => {
  // Inhalte live aus dem CMS (Strapi „Home"); Fallback: statischer Content-Layer
  const impactCounter = useHomeSection("impactCounter", IMPACT_STATIC, impactCounterEn);

  return (
    <section aria-label={impactCounter.ariaLabel} className="relative">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-14 md:pt-20">
        <p className="uppercase mb-0" style={{ ...MONO, fontSize: "14px", letterSpacing: "0.16em", color: INK_DEEP, opacity: 0.6 }}>
          {impactCounter.eyebrow}
        </p>

        <div
          className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ border: `1px solid ${HAIRLINE}`, background: HAIRLINE }}
        >
          {impactCounter.metrics.map((m) => (
            <Metric key={m.label} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
};
