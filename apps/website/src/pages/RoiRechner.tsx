import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IconArrowRight, IconBolt, IconCheck, IconShieldCheck } from "@tabler/icons-react";
import { EdgeIconBadge } from "@/components/ui/EdgeIconBadge";
import { MobileNavigation } from "@/components/MobileNavigation";
import SEOHead from "@/components/SEOHead";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { SpeakWithUsCta } from "@/components/SpeakWithUsCta";
import { useLanguage } from "@/contexts/LanguageContext";
import * as ROI_DE from "@/content/roiAudit";
import * as ROI_EN from "@/content/en/roiAudit";
import type { RoiUseCase, PainId } from "@/content/roiAudit";
import { ROI_ENDPOINT } from "@/utils/apiConfig";

const Footer = lazy(() => import("@/components/Footer").then((m) => ({ default: m.Footer })));

/* ── NEWEDGE CI (Rebrush 2026-07) ── */
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const FLASH       = "#FF1E00";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const PAPER = "#F2F2F2";
const PAPER_PURE = "#FFFFFF";
const HAIRLINE = "rgba(23,23,23,0.14)";
const EASE = [0.22, 1, 0.36, 1] as const;
const ROI_GRADIENT = "linear-gradient(150deg, #171717 0%, #333A00 45%, #CCFF00 100%)";

/** ROI-Report-Service (VPS, FastAPI): Lead speichern, PDF erzeugen, versenden.
    Kommt aus der gemeinsamen Netlify-Env `VITE_API_URL` (siehe utils/apiConfig).
    Leer = Test-Modus (zeigt Erfolg, sendet nicht) — für lokale Entwicklung. */
const ROI_WEBHOOK_URL = ROI_ENDPOINT;

const MATURITY_DE = [
  { id: "none", t: "Noch gar nicht", d: "Fast alles läuft manuell" },
  { id: "some", t: "Erste Tools", d: "ChatGPT, Zapier o. Ä. im Einsatz" },
  { id: "advanced", t: "Schon einige Automationen", d: "Läuft, aber unsystematisch" },
] as const;
const MATURITY_EN = [
  { id: "none", t: "Not yet", d: "Almost everything runs manually" },
  { id: "some", t: "First tools", d: "ChatGPT, Zapier or similar in use" },
  { id: "advanced", t: "Some automations already", d: "Running, but unsystematic" },
] as const;
type Maturity = (typeof MATURITY_DE)[number]["id"];
const READINESS: Record<Maturity, number> = { none: 0.85, some: 1.0, advanced: 1.1 };
const REALISM_DEFAULT: Record<Maturity, number> = { none: 32, some: 45, advanced: 55 };
const HOURS_PER_FTE = 1600;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/* ── Methodik: reale ROI-Spanne (Ausreißer gedeckelt), skaliert auf Reifegrad + Teamgröße, minus ~15 % laufende Kosten ── */
function ucValue(uc: RoiUseCase, t: number, readiness: number, teamFactor: number) {
  const lo = uc.roiMin;
  const hi = uc.roiMin > 0 ? Math.min(uc.roiMax, uc.roiMin * 3) : uc.roiMax;
  return (lo + t * (hi - lo)) * readiness * teamFactor;
}
const netOf = (v: number) => v * 0.85;
const leverImpl = (uc: RoiUseCase) => 1500 + (10 - uc.effort) * 900;

/* Locale-abhängige Zahlformate — Rechenwerte bleiben identisch, nur die Darstellung wechselt. */
const makeFmt = (en: boolean) => {
  const loc = en ? "en-US" : "de-DE";
  const dec = (s: string) => (en ? s : s.replace(".", ","));
  return {
    fmtEur(n: number) {
      if (n >= 1_000_000) return dec((n / 1_000_000).toFixed(1)) + (en ? "M €" : " Mio. €");
      if (n >= 1000) return Math.round(n / 1000) + (en ? "k €" : " Tsd. €");
      return Math.round(n) + " €";
    },
    fmtEurExact: (n: number) => n.toLocaleString(loc) + " €",
    fmtNum: (n: number) => Math.round(n).toLocaleString(loc),
    fmtDec: (n: number) => dec(n.toFixed(1)),
  };
};

function useAnimatedNumber(target: number) {
  const [display, setDisplay] = useState(target);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setDisplay(target); return; }
    let raf = 0; const from = display; const diff = target - from; const dur = 500; let start: number | null = null;
    if (diff === 0) return;
    const stepFn = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setDisplay(from + diff * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(stepFn);
    };
    raf = requestAnimationFrame(stepFn);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return display;
}

const labelStyle: React.CSSProperties = { fontFamily: OUTFIT, fontSize: "13px", fontWeight: 600, color: INK_DEEP };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", border: `1.5px solid ${HAIRLINE}`, borderRadius: "10px",
  fontSize: "15px", fontFamily: OUTFIT, color: INK_DEEP, background: PAPER_PURE, outline: "none",
};

type Field = { pf: (typeof ROI_DE.PAINFIELDS)[number]; rep: RoiUseCase; apps: string[] };

/* ── UI-Wörterbuch: DE 1:1 aus dem Original, EN als Spiegel ── */
const T_DE = {
  seoTitle: "KI-ROI berechnen — Potenzial für den Mittelstand | NEWEDGE",
  seoDescription: "Berechnen Sie kostenlos, was KI Ihrem Betrieb bringt — in Euro, freigesetzten Stunden und Wachstum. Branchenspezifisch, aus über 40 realen Automatisierungen.",
  seoCanonical: "/roi-rechner",
  heroTitle: <>Welche Rollen Ihre <span className="edge-mark">KI-Abteilung</span> zuerst braucht.</>,
  heroSub: "Wählen Sie Ihre Branche und die Mitglieder Ihrer künftigen KI-Abteilung. Sie sehen das Potenzial in Euro, freigesetzten Stunden und Wachstums-Kapazität — pro Rolle, aus über 40 realen Automatisierungen.",
  stepOf: (n: number) => `Schritt ${n} von 3`,
  s1Title: "Ihre Branche",
  s1Sub: "Wir gleichen mit realen Automatisierungs-Werten aus Ihrem Anwendungsfeld ab.",
  teamLabel: (n: number) => `Teamgröße · ${n} Mitarbeitende`,
  next: "Weiter",
  s2Title: "Ihre KI-Abteilung",
  s2Sub: (label: string) => `Welche Rollen würden Ihnen in „${label}" am meisten Arbeit abnehmen? Mehrfachauswahl.`,
  eg: "z. B. ",
  hoursWeek: (h: number) => `~${String(h).replace(".", ",")} Std./Woche`,
  toolsQuestion: "Welche dieser Tools nutzen Sie schon?",
  back: "← Zurück",
  s3Title: "Ihr Startpunkt",
  s3Sub: "Wie weit sind Sie mit Automatisierung? Danach richtet sich, wie schnell sich das Potenzial für Sie auszahlt.",
  viewAnalysis: "Analyse ansehen",
  changeAnswers: "← Antworten ändern",
  auditEyebrow: "Ihr Kurz-Audit",
  benefitTitle: "Das bekommen Sie zurück.",
  benefitSub: "Alle Werte sind Ihr jährlicher Rückfluss aus Automatisierung — nicht Ihre Kosten.",
  emptyNoBranche: "Wählen Sie Ihre Branche. Wir gleichen mit Werten aus über 40 realen Automatisierungen ab.",
  emptyNoRoles: "Wählen Sie die Rollen Ihrer KI-Abteilung. Ihr Potenzial erscheint hier sofort.",
  lensMoney: "Geld",
  lensTime: "Zeit",
  lensGrowth: "Wachstum",
  hrsUnit: "Std.",
  fteUnit: "Vollzeitkräfte",
  quickWinLabel: "Schneller Erfolg",
  moneySub: "Das sparen Sie pro Jahr — nach Abzug der laufenden Kosten",
  timeSub: "freigesetzte Arbeitszeit / Jahr",
  growthSub: "Kapazität, die frei wird",
  moneyRange: (lo: string, hi: string) => `konservativ ${lo} … ambitioniert ${hi}`,
  timeRange: (fte: string) => `≈ ${fte} Vollzeitkräfte, die Sie für anderes einsetzen können`,
  growthRange: (hours: string) => `${hours} Std./Jahr — Zeit für Wachstum, ohne neu einzustellen`,
  benchmarkShort: "Genutztes Potenzial",
  benchmark: (label: string, full: string, share: number) => (
    <>Betriebe in „{label}" holen mit einer vollen KI-Abteilung typischerweise <strong>{full}/Jahr</strong> heraus. Ihre Auswahl deckt davon <strong>{share}%</strong> ab.</>
  ),
  stackTitle: (n: number) => `Ihre Tools · ${n} im Einsatz`,
  stackNote: "Diese Tools binden wir direkt an — Ihre KI-Abteilung baut auf dem auf, was schon läuft, statt es zu ersetzen.",
  growthLever: (fte: string, sub: string) => (
    <><strong>{fte} Vollzeitkräfte</strong> frei — genug, um z. B. „{sub}" auszubauen, Durchlaufzeiten zu senken oder mehr Aufträge zu stemmen, ohne einzustellen.</>
  ),
  byRole: "Nach Rolle",
  realismTitle: "Wie vorsichtig rechnen wir?",
  realismValue: (r: number): string => (r < 33 ? "sehr konservativ" : r < 67 ? "ausgewogen" : "ambitioniert"),
  payback: (p: number) => (p < 1 ? "< 1 Mon." : `${Math.round(p)} Mon.`),
  paybackLab: "Investition wieder drin nach",
  entryVal: (price: string) => `ab ${price}`,
  entryLab: (note: string) => `Einstieg · ${note}`,
  footnoteModeled: "Geschätzte Richtwerte für diese Branche, angepasst an Ihren Stand und Ihre Teamgröße, abzüglich ~15 % laufender Kosten.",
  footnoteReal: "Spannen aus realen Automatisierungen, angepasst an Ihren Stand und Ihre Teamgröße, abzüglich ~15 % laufender Kosten. Die Investition umfasst das KI-Audit plus die geschätzte Umsetzung.",
  roadmapTitle: "Ihre KI-Abteilung im Einsatz",
  roadmapSub: "Sortiert nach dem besten Verhältnis von Wirkung zu Aufwand. Die schnellsten Erfolge zuerst — inklusive der Programme, mit denen wir jede Rolle aufbauen.",
  effortWord: "Aufwand",
  effortLow: "niedrig",
  effortMid: "mittel",
  effortHigh: "hoch",
  perYearShort: "/J",
  reportTitle: "Report als PDF + Umsetzungsplan",
  reportSub: "Speichern Sie Ihr Audit inkl. Umsetzungsplan direkt als PDF — oder lassen Sie es sich persönlich per E-Mail schicken.",
  savePdf: "Als PDF speichern",
  phName: "Name",
  phCompany: "Unternehmen",
  phEmail: "E-Mail",
  sendingLabel: "Wird gesendet …",
  requestReport: "Report anfordern",
  noSharing: "Ihre Daten bleiben bei uns.",
  sendError: "Senden fehlgeschlagen — bitte versuchen Sie es erneut oder schreiben Sie direkt an info@newedgebrand.com.",
  leadSuccess: (email: string) => (
    <>Unterwegs an <strong>{email}</strong>. Ihr Report kommt in wenigen Minuten per E-Mail.</>
  ),
  ctaEyebrow: "Bereit loszulegen?",
  ctaLine1: "Sprechen Sie",
  ctaLine2: "direkt mit uns.",
};

const T_EN: typeof T_DE = {
  seoTitle: "Calculate AI ROI — potential for mid-sized firms | NEWEDGE",
  seoDescription: "Calculate for free what AI can do for your business — the value in euros, freed-up hours and growth. Industry-specific, from 40+ real automations.",
  seoCanonical: "/en/roi-rechner",
  heroTitle: <>Which roles your <span className="edge-mark">AI department</span> needs first.</>,
  heroSub: "Choose your industry and the members of your future AI department. You'll see the potential in euros, freed-up hours and growth capacity — per role, from over 40 real automations.",
  stepOf: (n) => `Step ${n} of 3`,
  s1Title: "Your industry",
  s1Sub: "We benchmark against real automation values from your field.",
  teamLabel: (n) => `Team size · ${n} employees`,
  next: "Next",
  s2Title: "Your AI department",
  s2Sub: (label) => `Which roles would take the most work off your plate in “${label}”? Select as many as you like.`,
  eg: "e.g. ",
  hoursWeek: (h) => `~${h} hrs/week`,
  toolsQuestion: "Which of these tools do you already use?",
  back: "← Back",
  s3Title: "Your starting point",
  s3Sub: "How far along are you with automation? That determines how fast the potential pays off for you.",
  viewAnalysis: "View analysis",
  changeAnswers: "← Change answers",
  auditEyebrow: "Your quick audit",
  benefitTitle: "This is what you get back.",
  benefitSub: "Every number is your annual return from automation — not your cost.",
  emptyNoBranche: "Choose your industry. We benchmark against values from over 40 real automations.",
  emptyNoRoles: "Choose the roles of your AI department. Your potential shows up here instantly.",
  lensMoney: "Money",
  lensTime: "Time",
  lensGrowth: "Growth",
  hrsUnit: "hrs",
  fteUnit: "FTEs",
  quickWinLabel: "Quick win",
  moneySub: "What you save per year — after running costs",
  timeSub: "freed-up working time / year",
  growthSub: "Capacity you free up",
  moneyRange: (lo, hi) => `conservative ${lo} … ambitious ${hi}`,
  timeRange: (fte) => `≈ ${fte} full-time equivalents you can deploy elsewhere`,
  growthRange: (hours) => `${hours} hrs/year — time to grow, without hiring`,
  benchmarkShort: "Potential used",
  benchmark: (label, full, share) => (
    <>Businesses in “{label}” typically get <strong>{full}/year</strong> out of a full AI department. Your selection covers <strong>{share}%</strong> of that.</>
  ),
  stackTitle: (n) => `Your tools · ${n} in use`,
  stackNote: "We connect these tools directly — your AI department builds on what's already running instead of replacing it.",
  growthLever: (fte, sub) => (
    <><strong>{fte} full-time equivalents</strong> freed up — enough to e.g. grow “{sub}”, cut turnaround times or take on more orders without hiring.</>
  ),
  byRole: "By role",
  realismTitle: "How cautiously do we calculate?",
  realismValue: (r) => (r < 33 ? "very conservative" : r < 67 ? "balanced" : "ambitious"),
  payback: (p) => (p < 1 ? "< 1 mo." : `${Math.round(p)} mo.`),
  paybackLab: "Investment recovered after",
  entryVal: (price) => `from ${price}`,
  entryLab: (note) => `Entry · ${note}`,
  footnoteModeled: "Estimated benchmark values for this industry, adjusted to your stage and team size, minus ~15% running costs.",
  footnoteReal: "Ranges from real automations, adjusted to your stage and team size, minus ~15% running costs. The investment covers the AI audit plus the estimated implementation.",
  roadmapTitle: "Your AI department at work",
  roadmapSub: "Sorted by the best ratio of impact to effort. The fastest wins first — including the tools we build each role with.",
  effortWord: "Effort",
  effortLow: "low",
  effortMid: "medium",
  effortHigh: "high",
  perYearShort: "/yr",
  reportTitle: "Report as PDF + implementation plan",
  reportSub: "Save your audit incl. the implementation plan straight to PDF — or have it sent to you personally by email.",
  savePdf: "Save as PDF",
  phName: "Name",
  phCompany: "Company",
  phEmail: "Email",
  sendingLabel: "Sending …",
  requestReport: "Request report",
  noSharing: "Your data stays with us.",
  sendError: "Sending failed — please try again or write to us directly at info@newedgebrand.com.",
  leadSuccess: (email) => (
    <>On its way to <strong>{email}</strong>. Your report will arrive by email in a few minutes.</>
  ),
  ctaEyebrow: "Ready to get started?",
  ctaLine1: "Talk to us",
  ctaLine2: "directly.",
};

const RoiRechner = () => {
  const { language } = useLanguage();
  const en = language === "en";
  const C = en ? ROI_EN : ROI_DE; // Content-Modul (DE-Original / EN-Mirror, strukturidentisch)
  const T = en ? T_EN : T_DE;
  const MATURITY = en ? MATURITY_EN : MATURITY_DE;
  const { fmtEur, fmtEurExact, fmtNum, fmtDec } = makeFmt(en);
  const effortLabel = (e: number) => (e >= 8 ? T.effortLow : e >= 6 ? T.effortMid : T.effortHigh);

  const [step, setStep] = useState(1);
  const [brancheId, setBrancheId] = useState<string | null>(null);
  const [team, setTeam] = useState(12);
  const [selected, setSelected] = useState<Set<PainId>>(new Set());
  const [usedApps, setUsedApps] = useState<Set<string>>(new Set());
  const [maturity, setMaturity] = useState<Maturity | null>(null);
  const [realism, setRealism] = useState(45);
  const [lens, setLens] = useState<"geld" | "zeit" | "wachstum">("geld");

  const [lead, setLead] = useState({ name: "", email: "", company: "" });
  const [leadDone, setLeadDone] = useState(false);
  const [leadError, setLeadError] = useState(false);
  const [sending, setSending] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // verstecktes Bot-Feld — Menschen lassen es leer
  const [revealed, setRevealed] = useState(false); // Analyse erst nach den Fragen zeigen

  const branche = useMemo(() => C.BRANCHES.find((b) => b.id === brancheId) || null, [brancheId, C]);
  const teamFactor = clamp(team / 20, 0.7, 2.0);
  const readiness = maturity ? READINESS[maturity] : 1.0;
  const t = realism / 100;

  // Ein repräsentativer Use Case je Persona für die gewählte Branche (bester Score aus den gebündelten Industrien)
  const fields = useMemo<Field[]>(() => {
    if (!branche) return [];
    const pooled = branche.industryIds.flatMap((iid) => C.ROI_INDUSTRIES.find((i) => i.id === iid)?.useCases || []);
    return C.PAINFIELDS.map((pf) => {
      const cands = pooled.filter((u) => C.NR_TO_PAIN[u.nr] === pf.id);
      if (!cands.length) return null;
      const rep = cands.slice().sort((a, b) => b.score - a.score || b.roiMax - a.roiMax)[0];
      // Kuratierte, real in DE je Branche genutzte Apps für dieses Feld (anklickbar)
      const apps = C.ROI_APPS[branche.id]?.[pf.id] ?? [];
      return { pf, rep, apps };
    }).filter(Boolean) as Field[];
  }, [branche, C]);

  const estimated = useMemo(
    () => !!branche && branche.industryIds.some((iid) => C.ROI_INDUSTRIES.find((i) => i.id === iid)?.estimated),
    [branche, C]
  );

  const calc = useMemo(() => {
    if (!branche || fields.length === 0) return null;
    const sel = fields.filter((f) => selected.has(f.pf.id));
    const rows = sel.map((f) => ({ ...f, net: netOf(ucValue(f.rep, t, readiness, teamFactor)) })).sort((a, b) => b.net - a.net);
    const totalNet = rows.reduce((s, r) => s + r.net, 0);
    const netLo = sel.reduce((s, f) => s + netOf(ucValue(f.rep, 0, readiness, teamFactor)), 0);
    const netHi = sel.reduce((s, f) => s + netOf(ucValue(f.rep, 1, readiness, teamFactor)), 0);
    const invest = C.ROI_ENTRY.price + sel.reduce((s, f) => s + leverImpl(f.rep), 0);
    const payback = totalNet > 0 ? invest / (totalNet / 12) : 0;
    const fullNet = fields.reduce((s, f) => s + netOf(ucValue(f.rep, t, readiness, teamFactor)), 0);
    const share = fullNet > 0 ? Math.round((totalNet / fullNet) * 100) : 0;
    const hoursYear = sel.reduce((s, f) => s + f.rep.hours * 46 * teamFactor, 0);
    const fte = hoursYear / HOURS_PER_FTE;
    return { sel, rows, totalNet, netLo, netHi, invest, payback, fullNet, share, hoursYear, fte, maxNet: rows[0]?.net || 1, topField: rows[0] };
  }, [branche, fields, selected, t, readiness, teamFactor, C]);

  const animatedNet = useAnimatedNumber(calc?.totalNet || 0);

  const toggle = (id: PainId) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleApp = (app: string) =>
    setUsedApps((prev) => { const n = new Set(prev); n.has(app) ? n.delete(app) : n.add(app); return n; });
  const chooseMaturity = (m: Maturity) => { setMaturity(m); setRealism(REALISM_DEFAULT[m]); };

  const submitLead = async () => {
    if (!calc || !branche) return;
    setSending(true);
    setLeadError(false);
    // Voller berechneter Stand — Kontrakt: apps/lead-api/sample_roi_lead.json.
    // Alle Zahlen kommen von hier (eine Rechen-Wahrheit, Service rechnet nichts nach).
    const payload = {
      ...lead,
      website: honeypot,
      lang: language,
      branche: branche.label,
      brancheCool: branche.cool,
      team,
      maturity,
      realism,
      usedApps: Array.from(usedApps),
      totalNet: Math.round(calc.totalNet),
      netLo: Math.round(calc.netLo),
      netHi: Math.round(calc.netHi),
      fullNet: Math.round(calc.fullNet),
      share: calc.share,
      hoursYear: Math.round(calc.hoursYear),
      fte: Math.round(calc.fte * 100) / 100,
      invest: Math.round(calc.invest),
      payback: Math.round(calc.payback * 10) / 10,
      entryPrice: C.ROI_ENTRY.price,
      entryNote: C.ROI_ENTRY.note,
      estimated,
      rows: calc.rows.map((r) => ({
        name: r.pf.name,
        sub: r.pf.sub,
        prozess: r.rep.prozess,
        net: Math.round(r.net),
        hoursWeek: r.rep.hours,
        effort: r.rep.effort,
        quickWin: r.rep.quickWin,
        tools: r.apps,
      })),
      submittedAt: new Date().toISOString(),
    };
    try {
      if (ROI_WEBHOOK_URL) {
        const res = await fetch(ROI_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        await new Promise((r) => setTimeout(r, 800)); // Test-Modus ohne konfigurierten Endpoint
      }
      setLeadDone(true);
    } catch {
      setLeadError(true); // Erfolg NUR bei echtem Erfolg — kein stilles Verschlucken mehr
    }
    setSending(false);
  };

  const canNext = (step === 1 && !!brancheId) || (step === 2 && selected.size > 0) || (step === 3 && !!maturity);

  return (
    <>
      <SEOHead
        title={T.seoTitle}
        description={T.seoDescription}
        canonical={T.seoCanonical}
      />
      <style>{`
        .roi-range{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:99px;outline:none;cursor:pointer}
        .roi-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:${LIME};cursor:pointer;box-shadow:0 2px 8px rgba(23,23,23,0.22);border:2px solid #fff}
        .roi-range::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:${LIME};border:2px solid #fff;cursor:pointer}
        .roi-input:focus{border-color:${LIME} !important;box-shadow:0 0 0 3px rgba(204,255,0,0.22)}
        .lk-fill{transition:width .35s cubic-bezier(.22,1,.36,1)}
        @media print {
          @page { margin: 14mm; }
          body { background:#fff !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          nav, .roi-noprint { display:none !important; }
          #roi-report { box-shadow:none !important; }
        }
      `}</style>

      <div className="min-h-screen overflow-x-hidden" style={{ background: PAPER, color: INK }}>
        <NoiseOverlay opacity={0.03} fixed zIndex={2} />
        <MobileNavigation onContactClick={() => {}} theme="dark" />

        {/* ── HERO (nur Phase 1) ── */}
        <section className="roi-noprint" style={{ display: revealed ? "none" : "block", maxWidth: "1140px", margin: "0 auto", padding: "clamp(104px,15vh,150px) clamp(20px,4vw,40px) clamp(20px,3vw,32px)", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <h1 style={{ color: INK_DEEP, textWrap: "balance", maxWidth: "20ch", margin: "0 auto" }}>
              {T.heroTitle}
            </h1>
            <p style={{ fontFamily: OUTFIT, color: INK, maxWidth: "62ch", margin: "20px auto 0", fontSize: "17px" }}>
              {T.heroSub}
            </p>
          </motion.div>
        </section>

        {/* ── MAIN ── */}
        <section style={{ maxWidth: "1140px", margin: "0 auto", padding: `${revealed ? "clamp(104px,15vh,150px)" : "0"} clamp(20px,4vw,40px) clamp(72px,9vw,112px)` }}>
          <div className="max-w-[900px] mx-auto">

            {/* PHASE 1 — Fragen (Analyse verborgen) */}
            <div style={{ display: revealed ? "none" : "block" }}>
              <div style={{ background: PAPER_PURE, borderRadius: "18px", border: `1px solid ${HAIRLINE}`, boxShadow: "0 18px 50px -30px rgba(23,23,23,0.45)", padding: "clamp(24px,3vw,40px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
                  {[1, 2, 3].map((i) => (
                    <span key={i} style={{ width: i === step ? "22px" : "8px", height: "8px", borderRadius: "99px", background: i === step ? LIME : i < step ? LIME : HAIRLINE, transition: "all .3s ease" }} />
                  ))}
                  <span style={{ marginLeft: "auto", fontFamily: OUTFIT, fontSize: "13px", fontWeight: 500, color: "#5E5E5A" }}>{T.stepOf(step)}</span>
                </div>

                {/* STEP 1 — Branche + Team */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <StepHead title={T.s1Title} sub={T.s1Sub} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                      {C.BRANCHES.map((b) => {
                        const active = brancheId === b.id;
                        return (
                          <button key={b.id} type="button" onClick={() => { setBrancheId(b.id); setSelected(new Set()); }}
                            style={{ textAlign: "left", border: `1.5px solid ${active ? LIME : HAIRLINE}`, background: active ? "rgba(204,255,0,0.14)" : PAPER_PURE, borderRadius: "12px", padding: "14px 16px", cursor: "pointer", transition: "border-color .18s, background .18s" }}>
                            <div style={{ fontFamily: OUTFIT, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: INK_DEEP, marginBottom: "3px" }}>{b.cool}</div>
                            <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "15px", color: INK_DEEP }}>{b.label}</div>
                            <div style={{ fontFamily: OUTFIT, fontSize: "12.5px", color: "#5E5E5A", marginTop: "2px" }}>{b.sub}</div>
                          </button>
                        );
                      })}
                    </div>
                    <RangeField label={T.teamLabel(team)} min={1} max={150} value={team} onChange={setTeam} />
                    <PrimaryButton disabled={!canNext} onClick={() => setStep(2)}>{T.next}</PrimaryButton>
                  </motion.div>
                )}

                {/* STEP 2 — KI-Abteilung (Personas) */}
                {step === 2 && branche && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <StepHead title={T.s2Title} sub={T.s2Sub(branche.label)} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                      {fields.map(({ pf, rep, apps }) => {
                        const active = selected.has(pf.id);
                        return (
                          <div key={pf.id}
                            style={{ border: `1.5px solid ${active ? LIME : HAIRLINE}`, background: active ? "rgba(204,255,0,0.14)" : PAPER_PURE, borderRadius: "12px", overflow: "hidden", transition: "border-color .18s, background .18s" }}>
                            <button type="button" onClick={() => toggle(pf.id)}
                              style={{ display: "block", width: "100%", textAlign: "left", border: "none", background: "transparent", padding: "14px 16px", cursor: "pointer" }}>
                              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                                <div>
                                  <span style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "15px", color: INK_DEEP }}>{pf.name}</span>
                                  <span style={{ fontFamily: OUTFIT, fontSize: "12.5px", color: "#5E5E5A", marginLeft: "8px" }}>{pf.sub}</span>
                                </div>
                                <span style={{ width: "20px", height: "20px", flex: "none", borderRadius: "6px", border: `1.5px solid ${active ? LIME : HAIRLINE}`, background: active ? LIME : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {active && <IconCheck size={13} stroke={3} color={INK_DEEP} />}
                                </span>
                              </div>
                              <div style={{ fontFamily: OUTFIT, fontSize: "12.5px", color: INK, marginTop: "5px", lineHeight: 1.5 }}>{T.eg}{rep.prozess}</div>
                              <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontFamily: OUTFIT, fontSize: "12px", color: "#5E5E5A" }}>
                                <span>{T.hoursWeek(rep.hours)}</span>
                                {rep.quickWin && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: INK_DEEP }}><IconBolt size={12} stroke={2.4} /> {T.quickWinLabel}</span>}
                              </div>
                            </button>
                            {/* Tools, die man je nach Anwendungsfeld schon nutzt — anklickbar */}
                            {active && apps.length > 0 && (
                              <div style={{ padding: "0 16px 14px" }}>
                                <div style={{ fontFamily: OUTFIT, fontSize: "11.5px", fontWeight: 600, color: "#5E5E5A", margin: "0 0 8px" }}>{T.toolsQuestion}</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                                  {apps.map((app) => {
                                    const on = usedApps.has(app);
                                    return (
                                      <button key={app} type="button" onClick={() => toggleApp(app)}
                                        style={{ fontFamily: OUTFIT, fontSize: "12px", fontWeight: 500, padding: "5px 11px", borderRadius: "99px", cursor: "pointer", transition: "all .15s", border: `1px solid ${on ? LIME : HAIRLINE}`, background: on ? LIME : PAPER_PURE, color: on ? INK_DEEP : INK }}>
                                        {app}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <PrimaryButton disabled={!canNext} onClick={() => setStep(3)}>{T.next}</PrimaryButton>
                    <BackLink onClick={() => setStep(1)} label={T.back} />
                  </motion.div>
                )}

                {/* STEP 3 — Reifegrad */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <StepHead title={T.s3Title} sub={T.s3Sub} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                      {MATURITY.map((m) => {
                        const active = maturity === m.id;
                        return (
                          <button key={m.id} type="button" onClick={() => chooseMaturity(m.id)}
                            style={{ textAlign: "left", border: `1.5px solid ${active ? LIME : HAIRLINE}`, background: active ? "rgba(204,255,0,0.14)" : PAPER_PURE, borderRadius: "12px", padding: "15px 18px", cursor: "pointer", transition: "border-color .18s, background .18s" }}>
                            <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "15px", color: INK_DEEP, marginBottom: "2px" }}>{m.t}</div>
                            <div style={{ fontFamily: OUTFIT, fontSize: "13px", color: INK }}>{m.d}</div>
                          </button>
                        );
                      })}
                    </div>
                    <PrimaryButton disabled={!canNext} onClick={() => { setRevealed(true); setTimeout(() => { const el = document.getElementById("audit"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); }}>{T.viewAnalysis}</PrimaryButton>
                    <BackLink onClick={() => setStep(2)} label={T.back} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* PHASE 2 — nur die Analyse (nach den Fragen) */}
            <div id="audit" style={{ display: revealed ? "block" : "none" }}>
              {revealed && (
                <button type="button" onClick={() => setRevealed(false)}
                  style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: OUTFIT, fontSize: "13px", fontWeight: 600, color: "#5E5E5A", padding: "0 0 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  {T.changeAnswers}
                </button>
              )}
              <div style={{ background: ROI_GRADIENT, borderRadius: "18px", padding: "clamp(24px,3vw,36px)", color: "#fff", boxShadow: "0 20px 50px -24px rgba(23,23,23,0.45)" }}>
                <div style={{ fontFamily: OUTFIT, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.72, marginBottom: "16px" }}>
                  {branche ? `${T.auditEyebrow} · ${branche.cool}` : T.auditEyebrow}
                </div>

                {!branche || !calc || calc.sel.length === 0 ? (
                  <div style={{ fontFamily: OUTFIT, fontSize: "15px", opacity: 0.8, lineHeight: 1.6, padding: "8px 0 6px" }}>
                    {branche ? T.emptyNoRoles : T.emptyNoBranche}
                  </div>
                ) : (
                  <>
                    {/* Benefit-Headline: stellt klar, dass die Werte Rückflüsse sind, keine Kosten */}
                    <div style={{ fontFamily: OUTFIT, fontSize: "clamp(20px,2.2vw,26px)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.15, marginBottom: "6px" }}>
                      {T.benefitTitle}
                    </div>
                    <div style={{ fontFamily: OUTFIT, fontSize: "13px", lineHeight: 1.5, opacity: 0.78, marginBottom: "18px" }}>
                      {T.benefitSub}
                    </div>

                    {/* Lens-Umschalter: Geld · Zeit · Wachstum */}
                    <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.14)", borderRadius: "99px", padding: "3px", marginBottom: "16px" }}>
                      {([["geld", T.lensMoney], ["zeit", T.lensTime], ["wachstum", T.lensGrowth]] as const).map(([id, lbl]) => (
                        <button key={id} type="button" onClick={() => setLens(id)}
                          style={{ border: "none", cursor: "pointer", fontFamily: OUTFIT, fontSize: "12.5px", fontWeight: 600, padding: "6px 15px", borderRadius: "99px", background: lens === id ? "#fff" : "transparent", color: lens === id ? INK_DEEP : "rgba(255,255,255,0.92)", transition: "background .18s" }}>
                          {lbl}
                        </button>
                      ))}
                    </div>

                    <div style={{ fontFamily: OUTFIT, fontSize: "clamp(38px,6vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums", marginBottom: "4px" }}>
                      {lens === "geld" ? fmtEur(animatedNet) : lens === "zeit" ? `${fmtNum(calc.hoursYear)} ${T.hrsUnit}` : `${fmtDec(calc.fte)} ${T.fteUnit}`}
                    </div>
                    <div style={{ fontFamily: OUTFIT, fontSize: "13px", opacity: 0.72, marginBottom: "6px" }}>
                      {lens === "geld" ? T.moneySub : lens === "zeit" ? T.timeSub : T.growthSub}
                    </div>
                    <div style={{ fontFamily: OUTFIT, fontSize: "12px", opacity: 0.62, marginBottom: "22px" }}>
                      {lens === "geld"
                        ? T.moneyRange(fmtEur(calc.netLo), fmtEur(calc.netHi))
                        : lens === "zeit"
                        ? T.timeRange(fmtDec(calc.fte))
                        : T.growthRange(fmtNum(calc.hoursYear))}
                    </div>

                    {/* Benchmark — entschärft: EINE Zahl (genutztes Potenzial) + Balken oben,
                        die volle Euro/Prozent-Rechnung nur dezent darunter (kein Kopfrechnen im ersten Blick) */}
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", fontFamily: OUTFIT, fontSize: "13px", opacity: 0.92, marginBottom: "10px" }}>
                        <span>{T.benchmarkShort}</span>
                        <span style={{ fontWeight: 700, fontSize: "16px" }}>{calc.share}%</span>
                      </div>
                      <div style={{ position: "relative", height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.22)", overflow: "hidden" }}>
                        <div className="lk-fill" style={{ height: "100%", width: `${clamp(calc.share, 2, 100)}%`, background: "#fff", borderRadius: "99px" }} />
                      </div>
                      <div style={{ fontFamily: OUTFIT, fontSize: "11.5px", lineHeight: 1.5, opacity: 0.55, marginTop: "10px" }}>
                        {T.benchmark(branche.label, fmtEur(calc.fullNet), calc.share)}
                      </div>
                    </div>

                    {/* Aktueller Tool-Stack — aus den Anwendungsfeldern angeklickt */}
                    {usedApps.size > 0 && (
                      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
                        <div style={{ fontFamily: OUTFIT, fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.6, marginBottom: "10px" }}>
                          {T.stackTitle(usedApps.size)}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                          {Array.from(usedApps).map((app) => (
                            <span key={app} style={{ fontFamily: OUTFIT, fontSize: "11.5px", fontWeight: 500, padding: "4px 9px", borderRadius: "99px", background: "rgba(255,255,255,0.14)", color: "#fff" }}>{app}</span>
                          ))}
                        </div>
                        <div style={{ fontFamily: OUTFIT, fontSize: "12.5px", lineHeight: 1.5, opacity: 0.82 }}>
                          {T.stackNote}
                        </div>
                      </div>
                    )}

                    {/* Wachstums-Hebel — nur in der Wachstums-Lens */}
                    {lens === "wachstum" && calc.topField && (
                      <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
                        <div style={{ fontFamily: OUTFIT, fontSize: "13px", lineHeight: 1.55, opacity: 0.95 }}>
                          {T.growthLever(fmtDec(calc.fte), calc.topField.pf.sub)}
                        </div>
                      </div>
                    )}

                    {/* Nach Rolle (KI-Abteilung) */}
                    <div style={{ fontFamily: OUTFIT, fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.6, marginBottom: "10px" }}>{T.byRole}</div>
                    <div style={{ marginBottom: "22px" }}>
                      {calc.rows.map((r) => (
                        <div key={r.pf.id} style={{ marginBottom: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: OUTFIT, fontSize: "13px", marginBottom: "4px" }}>
                            <span style={{ opacity: 0.92 }}>{r.pf.sub}</span>
                            <span style={{ fontWeight: 500 }}>{fmtEur(r.net)}</span>
                          </div>
                          <div style={{ height: "8px", borderRadius: "99px", background: "rgba(255,255,255,0.14)", overflow: "hidden" }}>
                            <div className="lk-fill" style={{ height: "100%", width: `${clamp(Math.round((r.net / calc.maxNet) * 100), 6, 100)}%`, background: r.rep.quickWin ? "#CCFF00" : "rgba(255,255,255,0.92)", borderRadius: "99px" }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Realitäts-Regler */}
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px 14px", marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: OUTFIT, fontSize: "12.5px", marginBottom: "6px", opacity: 0.9 }}>
                        <span>{T.realismTitle}</span>
                        <span style={{ fontWeight: 500 }}>{T.realismValue(realism)}</span>
                      </div>
                      <input type="range" className="roi-range" min={0} max={100} step={1} value={realism}
                        style={{ background: `linear-gradient(to right,#fff ${realism}%, rgba(255,255,255,0.22) ${realism}%)` }}
                        onChange={(e) => setRealism(+e.target.value)} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "6px" }}>
                      <Mini val={T.payback(calc.payback)} lab={T.paybackLab} />
                      <Mini val={T.entryVal(fmtEurExact(C.ROI_ENTRY.price))} lab={T.entryLab(C.ROI_ENTRY.note)} />
                    </div>
                    <div style={{ fontFamily: OUTFIT, fontSize: "11.5px", opacity: 0.55, lineHeight: 1.5, marginTop: "8px" }}>
                      {estimated ? T.footnoteModeled : T.footnoteReal}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── VOLL-AUDIT / Tool-Roadmap + Report (nur nach den Fragen) ── */}
          {revealed && branche && calc && calc.sel.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, ease: EASE }} style={{ marginTop: "clamp(24px,3vw,36px)" }}>
              <div style={{ background: PAPER_PURE, borderRadius: "18px", border: `1px solid ${HAIRLINE}`, padding: "clamp(24px,3vw,40px)" }}>
                <h2 style={{ color: INK_DEEP, marginBottom: "6px" }}>{T.roadmapTitle}</h2>
                <p style={{ fontFamily: OUTFIT, color: INK, fontSize: "15px", marginBottom: "24px" }}>
                  {T.roadmapSub}
                </p>
                <div>
                  {calc.rows.map((r, i) => (
                    <div key={r.pf.id} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "16px 0", borderTop: `1px solid ${HAIRLINE}` }}>
                      <span style={{ width: "26px", height: "26px", flex: "none", borderRadius: "50%", background: LIME, color: INK_DEEP, fontFamily: OUTFIT, fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                          <span style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "15px", color: INK_DEEP }}>{r.pf.sub}</span>
                          {r.rep.quickWin && <span style={{ fontFamily: OUTFIT, fontSize: "11px", fontWeight: 600, color: INK_DEEP, background: "rgba(23,23,23,0.06)", padding: "2px 8px", borderRadius: "6px" }}>{T.quickWinLabel}</span>}
                        </div>
                        <div style={{ fontFamily: OUTFIT, fontSize: "12.5px", color: "#5E5E5A" }}>{T.eg}{r.rep.prozess} · {T.effortWord} {effortLabel(r.rep.effort)}{r.apps.length > 0 ? ` · Tools: ${r.apps.slice(0, 5).join(" · ")}` : ""}</div>
                      </div>
                      <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "15px", color: INK_DEEP, whiteSpace: "nowrap" }}>{fmtEur(r.net)}<span style={{ fontSize: "12px", fontWeight: 400, color: "#5E5E5A" }}>{T.perYearShort}</span></div>
                    </div>
                  ))}
                </div>

                {/* Lead-Gate: PDF-Report */}
                <div className="roi-noprint" style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: "26px", paddingTop: "24px" }}>
                  <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "16px", color: INK_DEEP, marginBottom: "4px" }}>{T.reportTitle}</div>
                  <p style={{ fontFamily: OUTFIT, fontSize: "13.5px", color: INK, marginBottom: "16px" }}>{T.reportSub}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "18px" }}>
                    <PrimaryButton inline onClick={() => window.print()}>{T.savePdf}</PrimaryButton>
                  </div>
                  {!leadDone ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "12px", marginBottom: "14px" }}>
                        <input className="roi-input" style={inputStyle} placeholder={T.phName} value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                        <input className="roi-input" style={inputStyle} placeholder={T.phCompany} value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} />
                        <input className="roi-input" type="email" style={inputStyle} placeholder={T.phEmail} value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
                      </div>
                      {/* Honeypot — unsichtbar für Menschen, Bots füllen es aus */}
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
                        value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
                        <PrimaryButton inline disabled={sending || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)} onClick={submitLead}>{sending ? T.sendingLabel : T.requestReport}</PrimaryButton>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: OUTFIT, fontSize: "12.5px", color: "#5E5E5A" }}><IconShieldCheck size={14} stroke={1.8} /> {T.noSharing}</span>
                      </div>
                      {leadError && (
                        <div style={{ fontFamily: OUTFIT, fontSize: "13px", color: "#B91C1C", marginTop: "12px" }}>{T.sendError}</div>
                      )}
                    </>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <EdgeIconBadge icon={IconCheck} size="md" tone="ink" />
                      <div style={{ fontFamily: OUTFIT, fontSize: "15px", color: INK_DEEP }}>{T.leadSuccess(lead.email)}</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* CTA — Standard „Sprechen Sie direkt mit uns" (direkt nach dem PDF-Report) */}
        {revealed && branche && calc && calc.sel.length > 0 && (
          <div id="kontakt" className="roi-noprint">
            <SpeakWithUsCta
              eyebrow={T.ctaEyebrow}
              headingLine1={T.ctaLine1}
              headingLine2={T.ctaLine2}
              phoneHref="tel:+4917660431467"
              phoneLabel="+49 176 60 431 467"
            />
          </div>
        )}

        <div className="roi-noprint">
          <Suspense fallback={<div style={{ minHeight: 200 }} />}>
            <Footer />
          </Suspense>
        </div>
      </div>
    </>
  );
};

/* ── Bausteine ── */
function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ fontFamily: OUTFIT, fontSize: "21px", fontWeight: 700, color: INK_DEEP, marginBottom: "6px" }}>{title}</div>
      <div style={{ fontFamily: OUTFIT, fontSize: "14px", color: INK, lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}

function RangeField({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ ...labelStyle, marginBottom: "12px" }}>{label}</div>
      <input type="range" className="roi-range" min={min} max={max} step={1} value={value}
        style={{ background: `linear-gradient(to right, ${LIME} ${pct}%, ${HAIRLINE} ${pct}%)` }}
        onChange={(e) => onChange(clamp(parseInt(e.target.value, 10) || min, min, max))} />
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, inline }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; inline?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = INK_DEEP; e.currentTarget.style.color = "#FFFFFF"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = LIME; e.currentTarget.style.color = INK_DEEP; }}
      style={{ width: inline ? "auto" : "100%", marginTop: inline ? 0 : "8px", padding: "14px 26px", background: LIME, color: INK_DEEP, border: "none", borderRadius: "12px", fontFamily: OUTFIT, fontSize: "16px", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 10px 26px -12px rgba(23,23,23,0.22)", transition: "background .18s" }}>
      {children}
      <IconArrowRight size={18} stroke={2.4} />
    </button>
  );
}

function BackLink({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} style={{ display: "inline-block", marginTop: "14px", background: "none", border: "none", cursor: "pointer", fontFamily: OUTFIT, fontSize: "13px", color: "#5E5E5A" }}>{label}</button>
  );
}

function Mini({ val, lab }: { val: string; lab: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: "12px", padding: "13px 15px" }}>
      <div style={{ fontFamily: OUTFIT, fontSize: "19px", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{val}</div>
      <div style={{ fontFamily: OUTFIT, fontSize: "11px", opacity: 0.66, marginTop: "3px" }}>{lab}</div>
    </div>
  );
}

export default RoiRechner;
