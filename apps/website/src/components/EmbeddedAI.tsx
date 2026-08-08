import { motion } from "framer-motion";
import { EdgePillButton } from "@/components/ui/EdgeCta";
import { MitStudyGrid } from "@/components/ui/MitStudyGrid";
import { embeddedAI as EAI_STATIC } from "@/content/sections/embeddedAI";
import { embeddedAI as embeddedAiEn } from "@/content/en/sections/embeddedAI";
import { videoShowcase as videoShowcaseStatic } from "@/content";
import { videoShowcase as videoShowcaseEn } from "@/content/en/sections/videoShowcase";
import { useHomeSection } from "@/hooks/useHomeContent";
import { useLocalized } from "@/hooks/useLocalized";
import { useLanguage } from "@/contexts/LanguageContext";

/* ── Design tokens ── */
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const HEAD: React.CSSProperties = { fontFamily: OUTFIT, fontWeight: 700 };
const BODY: React.CSSProperties = { fontFamily: OUTFIT, fontWeight: 400 };
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * „Was wir machen"-Modul: links die MIT-Studie-Grafik (5/100 + Beschreibung —
 * „nur 5 von 100 erzielen messbaren Return"), rechts Ein externer Head of AI +
 * „Wir übernehmen"-Liste + CTA. Mobile stapelt DOM-Reihenfolge: Grafik → Text.
 */
interface EmbeddedAIProps {
  /** Optional: Anker für scroll-getriggerte Overlays (Founder-Badge). */
  sectionRef?: React.RefObject<HTMLElement>;
}

export const EmbeddedAI = ({ sectionRef }: EmbeddedAIProps = {}) => {
  const { language } = useLanguage();
  // Inhalte live aus dem CMS (locale-fähig); Fallback: sprachrichtiger Content-Layer
  const embeddedAI = useHomeSection("embeddedAI", EAI_STATIC, embeddedAiEn);
  const videoShowcase = useLocalized("video-showcase", videoShowcaseStatic, videoShowcaseEn);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label={embeddedAI.ariaLabel}
      className="relative"
      style={{ overflowX: "clip" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">

          {/* ── LINKS: MIT-Studie-Grafik (5/100 + Beschreibung) ── */}
          <div className="w-full mx-auto lg:mx-0" style={{ maxWidth: "540px" }}>
            <MitStudyGrid lang={language} />
          </div>

          {/* ── RECHTS: Head of AI + Wir übernehmen + CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            <h2 style={{ color: INK_DEEP }}>
              {embeddedAI.heading.lead}<span className="edge-mark">{embeddedAI.heading.highlight}</span>
            </h2>
            <p style={{ ...BODY, color: INK, maxWidth: "52ch", marginBottom: "28px" }}>
              {embeddedAI.paragraphs[0]}
            </p>

            <p className="uppercase mb-4" style={{ ...BODY, fontWeight: 700, fontSize: "14px", letterSpacing: "0.03em", color: INK_DEEP }}>
              {embeddedAI.uebernahmeLabel}
            </p>
            <ul className="m-0 p-0 grid sm:grid-cols-2 gap-x-8 gap-y-3" style={{ listStyle: "none", marginBottom: "24px" }}>
              {embeddedAI.uebernahme.map((u, i) => (
                <li key={u} className="flex items-center gap-3">
                  <span
                    style={{
                      ...HEAD,
                      fontSize: "12px",
                      color: INK_DEEP,
                      background: LIME,
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ ...BODY, fontWeight: 500, fontSize: "14.5px", color: INK_DEEP }}>{u}</span>
                </li>
              ))}
            </ul>

            <p style={{ ...HEAD, fontWeight: 600, color: INK_DEEP, maxWidth: "46ch", marginBottom: "28px" }}>
              {embeddedAI.paragraphs[1]}
            </p>

            <EdgePillButton to={videoShowcase.ctaPrimary.to}>{videoShowcase.ctaPrimary.label}</EdgePillButton>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
