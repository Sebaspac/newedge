import { motion } from "framer-motion";
import { img } from "@/content";
import { brandAssets as BA_STATIC } from "@/content/sections/brandAssets";
import { brandAssets as brandAssetsEn } from "@/content/en/sections/brandAssets";
import { useLocalized } from "@/hooks/useLocalized";

interface LoadingScreenProps {
  progress: number;
}

export const LoadingScreen = ({ progress }: LoadingScreenProps) => {
  // Logo aus dem Content-Layer (CMS-austauschbar); Fallback: statisch
  const assets = useLocalized("brand-assets", BA_STATIC, brandAssetsEn);
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0.95,
        filter: "blur(10px)"
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {/* Nur das Logo */}
      <motion.img
        src={img(assets.loadingLogo.src)}
        alt={assets.loadingLogo.alt}
        className="w-32 h-32 md:w-40 md:h-40"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      />
    </motion.div>
  );
};
