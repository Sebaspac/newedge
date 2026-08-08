import { motion, useScroll, useTransform } from "framer-motion";
import { memo, useRef } from "react";
import { LazyVideo } from "@/components/LazyVideo";
import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation";

interface AgentScrollSectionProps {
  children: React.ReactNode;
  videoSrc: string;
  gradient: string;
  imagePosition?: "left" | "right";
}

const AgentScrollSectionComponent = ({
  children,
  videoSrc,
  gradient,
  imagePosition = "left",
}: AgentScrollSectionProps) => {
  const { shouldAnimate } = useOptimizedAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Fade out video only when next section starts (at 85-100% progress)
  const videoOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  return (
    <>
      {/* Mobile/Tablet: Simple Stack Layout */}
      <div className="lg:hidden space-y-6 pb-12 relative">
        {/* Video Container - 16:9 */}
        <div className={`w-full aspect-video ${gradient} rounded-none flex items-center justify-center shadow-2xl relative overflow-hidden`}>
          <LazyVideo
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aspectRatio="16/9"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Text Content Below */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-20"
        >
          {children}
        </motion.div>
      </div>

      {/* Desktop: Sticky Video with Scrolling Text */}
      <div 
        ref={sectionRef}
        className="hidden lg:block relative"
      >
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Sticky Video Container - fixed position while scrolling */}
          <div className={`${imagePosition === "right" ? "order-2" : "order-1"} relative`}>
            <motion.div 
              className="sticky top-28"
              style={{ opacity: videoOpacity }}
            >
              {/* Video container with 16:9 aspect ratio */}
              <div className={`w-full ${gradient} rounded-none shadow-2xl relative overflow-hidden`}>
                <div className="aspect-video relative">
                  <LazyVideo
                    src={videoSrc}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    aspectRatio="16/9"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Text Content - scrolls normally past the sticky video */}
          <div className={`${imagePosition === "right" ? "order-1" : "order-2"} pb-[25vh]`}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: shouldAnimate ? 0.05 : 0,
                    delayChildren: shouldAnimate ? 0.03 : 0,
                  },
                },
              }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentScrollSection = memo(AgentScrollSectionComponent);
