import { motion } from "framer-motion";
import { IconHeadset, IconUsers, IconTopologyStar3 } from "@tabler/icons-react";
import { EdgeIconBadge } from "@/components/ui/EdgeIconBadge";
import { teamSupport as teamSupportStatic, img } from "@/content";
import { teamSupport as teamSupportEn } from "@/content/en/sections/teamSupport";
import { useLocalizedStatic } from "@/hooks/useLocalized";

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Dekorative Icons je Feature-Spalte (Reihenfolge = Content-Reihenfolge). */
const FEATURE_ICONS = [IconHeadset, IconUsers, IconTopologyStar3];

interface TeamSupportSectionProps {
  /** Trigger-Anker für den schwebenden Founder-Badge (Index.tsx) — hier blendet er wieder aus. */
  sectionRef?: React.RefObject<HTMLElement>;
}

/**
 * Team-Support-Modul (Referenz-Layout in NEWEDGE-CI): ein Ansprechpartner,
 * die Manpower einer ganzen Agentur — Kicker, zentrierte Headline, Absatz,
 * dunkle Team-Banner-Pill mit echten Avataren, drei Feature-Spalten.
 */
export const TeamSupportSection = ({ sectionRef }: TeamSupportSectionProps = {}) => {
  const teamSupport = useLocalizedStatic(teamSupportStatic, teamSupportEn);
  return (
  <section ref={sectionRef as React.RefObject<HTMLElement>} aria-label={teamSupport.kicker}>
    <div
      className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center"
      style={{ paddingTop: "clamp(56px,7vw,96px)", paddingBottom: "clamp(56px,7vw,96px)" }}
    >
      {/* Team-Banner-Pill: echte Avatare + Zusage — jetzt vor der Headline, zentriert (kein Eyebrow mehr) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        style={{
          background: `linear-gradient(120deg, #1F1F1F 0%, ${INK_DEEP} 60%, #101010 100%)`,
          borderRadius: "999px",
          padding: "14px clamp(24px, 3vw, 40px)",
          marginBottom: "clamp(28px, 4vh, 40px)",
        }}
      >
        <div className="flex items-center">
          {teamSupport.banner.avatars.map((a, i) => (
            <img
              key={a.src}
              src={img(a.src)}
              alt={a.alt}
              loading="lazy"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${i === 1 ? LIME : "rgba(255,255,255,0.22)"}`,
                marginLeft: i === 0 ? 0 : "-12px",
                position: "relative",
                zIndex: teamSupport.banner.avatars.length - i,
                display: "block",
              }}
            />
          ))}
        </div>
        <p style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "clamp(15px, 1.4vw, 18px)", color: "#fff", textAlign: "left" }}>
          {teamSupport.banner.textLead}
          <span style={{ color: LIME }}>{teamSupport.banner.textHighlight}</span>
        </p>
      </motion.div>

      {/* Headline + Absatz */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
      >
        <h2
          style={{
            color: INK_DEEP,
          }}
        >
          {teamSupport.headingLead}
          <span className="edge-mark">{teamSupport.headingHighlight}</span>
        </h2>
        <p
          className="mx-auto"
          style={{
            color: INK,
            maxWidth: "62ch",
            marginBottom: "clamp(36px, 5vh, 52px)",
          }}
        >
          {teamSupport.paragraph}
        </p>
      </motion.div>

      {/* Drei Feature-Spalten */}
      <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
        {teamSupport.features.map((f, i) => {
          const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: EASE }}
              className="flex flex-col items-center"
            >
              <EdgeIconBadge
                icon={Icon}
                size="xl"
                style={{ marginBottom: "22px", boxShadow: "0 12px 32px rgba(204,255,0,0.22)" }}
              />
              <h3
                style={{
                  color: INK_DEEP,
                  maxWidth: "16ch",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: INK,
                  maxWidth: "34ch",
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
  );
};
