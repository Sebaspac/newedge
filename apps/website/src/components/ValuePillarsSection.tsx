import { motion } from "framer-motion";
import { Target, Layers, ShieldCheck } from "lucide-react";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

const LIME = "#CCFF00";
const INK_DEEP = "#17172E";
const INK = "#3C3C47";
const PAPER_PURE = "#FFFFFF";
const HAIRLINE = "rgba(23,23,23,0.06)";

const EASE = [0.22, 1, 0.36, 1] as const;

const MONO: React.CSSProperties = {
  fontFamily: "Consolas, ui-monospace, SFMono-Regular, Menlo, monospace",
};

const pillars = [
  {
    Icon: Target,
    title: "Strategie & Klarheit",
    desc: "Von der KI-Strategie bis zur konkreten Umsetzung. Wir analysieren Ihre Prozesse, identifizieren echte Hebel und bauen Systeme, die wirken — nicht bloß beeindrucken.",
  },
  {
    Icon: Layers,
    title: "Nahtlose Integration",
    desc: "KI wird direkt in Ihre bestehenden Tools und Systeme eingebaut — ERP, CRM, interne Plattformen. Kein Bruch, kein Parallelbetrieb, keine Reibung.",
  },
  {
    Icon: ShieldCheck,
    title: "Datenhoheit & Sicherheit",
    desc: "DSGVO-konforme Architekturen, bei denen Sie die volle Kontrolle behalten. Ihre Daten bleiben Ihre Daten — intern, sicher, auditierbar.",
  },
];

export const ValuePillarsSection = () => {
  return (
    <section
      className="relative py-14 md:py-20"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[70vh]">

          {/* ── LEFT: pillar list ────────────────────────────────────────── */}
          <div
            className="lg:col-span-5 order-2 lg:order-1"
            style={{ borderTop: "none" }}
          >
            {pillars.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.1 + i * 0.08 }}
                className="grid grid-cols-12 gap-6 py-8"
                style={{
                  borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}`,
                  borderBottom: `1px solid ${HAIRLINE}`,
                }}
              >
                {/* Icon */}
                <div className="col-span-2 flex items-start pt-1">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      border: `1.5px solid rgba(23,23,23,0.22)`,
                      backgroundColor: "rgba(23,23,23,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ color: LIME, width: "18px", height: "18px" }} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="col-span-10">
                  <h3
                    style={{
                      color: INK_DEEP,
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      ...MONO,
                      color: INK,
                      opacity: 0.65,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── RIGHT: sticky heading ─────────────────────────────────────── */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 self-start order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <h2
                style={{
                  color: INK_DEEP,
                }}
              >
                Wir nutzen KI als{" "}
                <AnimatedTextCycle
                  words={["Freund", "Motor", "Helfer", "Vorteil"]}
                  interval={2800}
                  renderWord={(word) => (
                    <span style={{ color: LIME }}>{word}</span>
                  )}
                />
                <br />
                für Ihr Unternehmen.
              </h2>

              <p
                style={{
                  ...MONO,
                  color: INK,
                  opacity: 0.65,
                  maxWidth: "38ch",
                }}
              >
                KI entfaltet ihren vollen Mehrwert nur, wenn sie strategisch
                in Ihre Geschäftsziele integriert wird. Als spezialisierter
                Partner verbinden wir Beratung, Entwicklung und Integration.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
