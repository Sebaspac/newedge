import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/**
 * Wraps children in an inline-block element that subtly follows the cursor.
 * No-op on mobile / touch.
 */
export const MagneticButton = ({ children, strength = 0.25, className = "" }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(mvY, { stiffness: 200, damping: 18, mass: 0.4 });

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    mvX.set(relX * strength);
    mvY.set(relY * strength);
  };

  const handleLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
