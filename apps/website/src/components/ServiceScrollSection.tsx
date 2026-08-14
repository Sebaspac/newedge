import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LucideIcon } from "lucide-react";
import { LazyVideo } from "./LazyVideo";
import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceScrollSectionProps {
  children: React.ReactNode;
  gradient: string;
  imagePosition?: "left" | "right";
  videoSrc?: string;
  icon?: LucideIcon;
  animationBelow?: React.ReactNode;
}

export const ServiceScrollSection = ({
  children,
  gradient,
  imagePosition = "right",
  videoSrc,
  icon: Icon,
  animationBelow,
}: ServiceScrollSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { shouldAnimate, whileHover } = useOptimizedAnimation();
  const isMobile = useIsMobile();
  
  // Scroll-based animations - disabled on mobile for performance
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Always call hooks, then conditionally use the values
  const imageOpacityTransform = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const imageScaleTransform = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
  const imageYTransform = useTransform(scrollYProgress, [0, 0.4], [0, -15]);
  
  // Use static values on mobile, animated values on desktop
  const imageOpacity = isMobile ? 1 : imageOpacityTransform;
  const imageScale = isMobile ? 1 : imageScaleTransform;
  const imageY = isMobile ? 0 : imageYTransform;

  const isEven = imagePosition === "right";

  return (
    <>
      {/* Mobile/Tablet: Stack Layout with Scroll Effect */}
      <div ref={sectionRef} className="lg:hidden space-y-4 pb-6 relative">
        {/* Video with Scroll Effect */}
        <motion.div
          style={{
            opacity: imageOpacity,
            scale: imageScale,
            y: imageY,
          }}
          className="sticky top-20 z-10"
        >
          <div
            className={`w-full aspect-video sm:aspect-[4/3] bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl relative overflow-hidden`}
          >
            {videoSrc ? (
              <>
                <LazyVideo
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover"
                  aspectRatio="16/9"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </>
            ) : Icon ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <Icon className="w-24 h-24 sm:w-32 sm:h-32 text-white drop-shadow-2xl relative z-10" />
              </>
            ) : null}
          </div>
        </motion.div>

        {/* Text Content Below - appears as image fades */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-20"
        >
          {children}
        </motion.div>

        {/* Animation Below on Mobile */}
        {animationBelow && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative z-20"
          >
            {animationBelow}
          </motion.div>
        )}
      </div>

      {/* Desktop: Grid Layout */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
        className="hidden lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start"
      >
        {/* Image Left */}
        {!isEven && (
          <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: shouldAnimate ? 0.6 : 0 },
            },
          }}
            className="sticky top-24 order-2 lg:order-1 space-y-6"
          >
            <motion.div
              {...(shouldAnimate && whileHover)}
              className={`w-full aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg relative overflow-hidden transition-transform duration-200`}
            >
              {videoSrc ? (
                <>
                  <LazyVideo
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover"
                    aspectRatio="16/9"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </>
              ) : Icon ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Icon className="w-40 h-40 text-white drop-shadow-2xl" />
                </>
              ) : null}
            </motion.div>
            {animationBelow && animationBelow}
          </motion.div>
        )}

        {/* Content */}
        <div className={!isEven ? "order-1 lg:order-2" : ""}>
          {children}
        </div>

        {/* Image Right */}
        {isEven && (
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: shouldAnimate ? 0.6 : 0 },
              },
            }}
            className="sticky top-24 space-y-6"
          >
            <motion.div
              {...(shouldAnimate && whileHover)}
              className={`w-full aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg relative overflow-hidden transition-transform duration-200`}
            >
              {videoSrc ? (
                <>
                  <LazyVideo
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover"
                    aspectRatio="16/9"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </>
              ) : Icon ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Icon className="w-40 h-40 text-white drop-shadow-2xl" />
                </>
              ) : null}
            </motion.div>
            {animationBelow && animationBelow}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};
