import { motion, Variants } from "framer-motion";

interface AnimatedDeliverablesListProps {
  items: string[];
  gradient: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};

const bulletVariants: Variants = {
  hidden: { scale: 0 },
  visible: { 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 }
  }
};

export const AnimatedDeliverablesList = ({ items, gradient }: AnimatedDeliverablesListProps) => {
  return (
    <motion.ul 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-3"
    >
      {items.map((item, idx) => (
        <motion.li
          key={idx}
          variants={itemVariants}
          whileHover={{ x: 8 }}
          className="group flex items-center gap-4 cursor-default py-1"
        >
          {/* Animierter Bullet-Point mit Glow */}
          <motion.span
            variants={bulletVariants}
            className={`relative flex-shrink-0 w-3 h-3 rounded-full bg-gradient-to-r ${gradient} transition-transform duration-200 group-hover:scale-150`}
          >
            {/* Pulsierender Glow-Ring */}
            <span 
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-60 blur-md scale-150 transition-opacity duration-300`}
            />
          </motion.span>
          
          {/* Animierter Text */}
          <motion.span 
            className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200"
          >
            {item}
          </motion.span>
        </motion.li>
      ))}
    </motion.ul>
  );
};
