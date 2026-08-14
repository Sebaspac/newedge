import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { cn } from "@/lib/utils";

type MarqueeAnimationProps = {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  direction?: "left" | "right";
  baseVelocity: number;
};

function MarqueeAnimation({
  children,
  className,
  style,
  direction = "left",
  baseVelocity = 10,
}: MarqueeAnimationProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (direction === "left") {
      directionFactor.current = 1;
    } else {
      directionFactor.current = -1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden max-w-[100vw] whitespace-nowrap flex relative">
      <motion.div
        className={cn(
          // marquee-track + *:shrink-0 halten jede Kopie auf ihrer Content-Breite (nowrap).
          // Ohne das schrumpfen die Flex-Items auf Container-/Viewport-Breite und ihr
          // überlaufender Text überlappt die Nachbar-Kopie (v. a. auf Mobile, wo die
          // globale Regel `* { max-width: 100% }` sonst greift — .marquee-track ist davon
          // in index.css ausgenommen).
          "marquee-track flex whitespace-nowrap *:shrink-0 *:me-10",
          className
        )}
        style={{ x, ...style }}
      >
        <span>{children}</span>
        <span>{children}</span>
        <span>{children}</span>
        <span>{children}</span>
      </motion.div>
    </div>
  );
}

export { MarqueeAnimation };
