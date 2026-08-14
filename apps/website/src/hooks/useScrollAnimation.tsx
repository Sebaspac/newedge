import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

// Animation variants for different types of scroll animations
export const scrollAnimations = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    }
  },
  
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    }
  },
  
  fadeRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    }
  },
  
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    }
  },
  
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  },
  
  staggerItem: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    }
  }
};

// Hook for scroll-triggered animations
export const useScrollAnimation = (animationType: keyof typeof scrollAnimations = 'fadeUp', threshold = 0.2) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-10% 0px -10% 0px",
    amount: threshold 
  });

  return {
    ref,
    initial: "hidden",
    animate: isInView ? "visible" : "hidden",
    variants: scrollAnimations[animationType]
  };
};

// Component wrapper for easy use
interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: keyof typeof scrollAnimations;
  delay?: number;
  threshold?: number;
  className?: string;
}

export const ScrollAnimation = ({ 
  children, 
  animation = 'fadeUp', 
  delay = 0, 
  threshold = 0.2,
  className = ""
}: ScrollAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-10% 0px -10% 0px",
    amount: threshold 
  });

  const variants: Variants = {
    ...scrollAnimations[animation],
    visible: {
      ...scrollAnimations[animation].visible,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: delay
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};