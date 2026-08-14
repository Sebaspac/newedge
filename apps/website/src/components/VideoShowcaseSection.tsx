import { motion } from "framer-motion";
import { EdgePillButton, EdgeTextButton } from "@/components/ui/EdgeCta";
import { videoShowcase as videoShowcaseStatic } from "@/content";
import { videoShowcase as videoShowcaseEn } from "@/content/en/sections/videoShowcase";
import { hero as HERO_STATIC } from "@/content/sections/hero";
import { hero as heroEn } from "@/content/en/sections/hero";
import { useHomeSection } from "@/hooks/useHomeContent";
import { useLocalized } from "@/hooks/useLocalized";

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Gradient-Showcase-Karte mit Erklärvideo — Referenz-Layout:
 * Text links, Click-to-Play-Video rechts, alles in einer großen
 * abgerundeten Verlaufs-Karte auf Papier-Hintergrund.
 */
export const VideoShowcaseSection = () => {
  // Text/CTAs live aus dem CMS (Strapi Single-Type „video-showcase"); Fallback: statisch
  const videoShowcase = useLocalized("video-showcase", videoShowcaseStatic, videoShowcaseEn);
  const video = useHomeSection("hero", HERO_STATIC, heroEn)?.video;

  return (
    <section aria-label={videoShowcase.heading}>
      <div
        className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "clamp(48px,6vw,80px)", paddingBottom: "clamp(48px,6vw,80px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="grid lg:grid-cols-[1fr_1fr] items-center gap-8 lg:gap-12 lg:min-h-[394px]"
          style={{
            borderRadius: "24px",
            padding: "clamp(20px,2.2vw,30px)",
            background:
              "radial-gradient(150% 150% at 100% 100%, #CCFF00 0%, #6B7A00 26%, #2E3300 48%, #171717 70%)",
            overflow: "hidden",
          }}
        >
          {/* ── Text links ── */}
          <div>
            <h2
              style={{
                color: "#fff",
              }}
            >
              {videoShowcase.heading}
            </h2>
            {/* Subtitle bewusst entfernt — nur der Titel bleibt. */}
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4 max-md:justify-center" style={{ marginTop: "24px" }}>
              <EdgePillButton to={videoShowcase.ctaPrimary.to}>{videoShowcase.ctaPrimary.label}</EdgePillButton>
              {/* Heller Text-Button — die Karte ist dunkel */}
              <EdgeTextButton to="/kontakt" tone="light">
                {videoShowcase.ctaSecondary.label}
              </EdgeTextButton>
            </div>
          </div>

          {/* ── Video rechts — native YouTube-Vorschau (kein Custom-Facade) ── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "480px",
              marginLeft: "auto",
              marginRight: "auto",
              aspectRatio: "16 / 9",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(23,23,23,0.4)",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1&color=white`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
