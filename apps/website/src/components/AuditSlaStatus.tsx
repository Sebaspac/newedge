import { useEffect, useState } from "react";
import { auditSlaStatus as SLA_STATIC } from "@/content/sections/auditSlaStatus";
import { auditSlaStatus as auditSlaStatusEn } from "@/content/en/sections/auditSlaStatus";
import { useLocalized } from "@/hooks/useLocalized";

/* ── Design tokens (Ink & Edge) ── */
const LIME = "#CCFF00";
const GLOW = "#CCFF00";
const INK_DEEP = "#171717";
const MONO: React.CSSProperties = { fontFamily: "Consolas, ui-monospace, SFMono-Regular, Menlo, monospace" };

const LS_KEY = "ne-audit-sla-deadline";
const SLA_HOURS = 24;

/** Startet die 24h-SLA-Uhr. Wird beim erfolgreichen Audit-Submit aufgerufen. */
export function startAuditSla() {
  try {
    localStorage.setItem(LS_KEY, String(Date.now() + SLA_HOURS * 3600_000));
    window.dispatchEvent(new Event("ne-audit-sla-started"));
  } catch {
    /* storage blocked: Countdown entfällt, Submit bleibt erfolgreich */
  }
}

function readDeadline(): number | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function fmtRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * Status-Karte nach Audit-Anfrage: lebender 24h-Countdown mit Stationen.
 * Rendert nichts, solange keine Anfrage läuft.
 */
export const AuditSlaStatus = () => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const auditSlaStatus = useLocalized("audit-sla-status", SLA_STATIC, auditSlaStatusEn);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setDeadline(readDeadline());
    const onStart = () => setDeadline(readDeadline());
    window.addEventListener("ne-audit-sla-started", onStart);
    return () => window.removeEventListener("ne-audit-sla-started", onStart);
  }, []);

  useEffect(() => {
    if (!deadline) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!deadline) return null;

  const remaining = deadline - now;
  /* 12h nach Ablauf verschwindet die Karte wieder */
  if (remaining < -12 * 3600_000) return null;

  const elapsedPct = Math.min(100, Math.max(0, 100 - (remaining / (SLA_HOURS * 3600_000)) * 100));
  const delivered = remaining <= 0;

  const stepDone = [true, elapsedPct > 5, delivered];
  const steps = auditSlaStatus.steps.map((s, i) => ({ label: s.label, done: stepDone[i] }));

  return (
    <section aria-label={auditSlaStatus.sectionAriaLabel} className="max-w-[1200px] mx-auto px-6 lg:px-8 py-10">
      <div style={{ background: INK_DEEP, border: "1px solid rgba(255,255,255,0.22)", padding: "clamp(24px, 4vw, 40px)" }}>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-6">
          <h2 className="m-0" style={{ color: "#F2F2F2" }}>
            {delivered ? auditSlaStatus.heading.delivered : auditSlaStatus.heading.pending}
          </h2>
          {!delivered && (
            <span style={{ ...MONO, fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)", color: GLOW, fontVariantNumeric: "tabular-nums" }} aria-live="off">
              {fmtRemaining(remaining)}
            </span>
          )}
        </div>

        {/* Fortschritt */}
        <div aria-hidden style={{ height: "1px", background: "rgba(255,255,255,0.14)", position: "relative", marginBottom: "20px" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${elapsedPct}%`, background: LIME }} />
        </div>

        <ol className="m-0 p-0 flex flex-wrap gap-x-8 gap-y-2" style={{ listStyle: "none" }}>
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-2" style={{ ...MONO, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: s.done ? "#F2F2F2" : "rgba(255,255,255,0.45)" }}>
              <span aria-hidden style={{ color: s.done ? GLOW : "rgba(255,255,255,0.22)" }}>{s.done ? "✓" : "○"}</span>
              {s.label}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
