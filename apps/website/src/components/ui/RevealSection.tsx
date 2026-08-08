import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface RevealSectionProps extends Omit<HTMLMotionProps<"section">, "children"> {
  children: ReactNode;
  delay?: number;
  y?: number;
}

/**
 * Section wrapper with a subtle fade + lift on first viewport entry.
 */
export const RevealSection = ({
  children,
  delay = 0,
  y = 40,
  className,
  ...rest
}: RevealSectionProps) => (
  <motion.section
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    {...rest}
  >
    {children}
  </motion.section>
);

export default RevealSection;
