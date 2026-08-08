import { useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export const useHeroScrollAnimation = () => {
  const container = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  return {
    container,
    style: {
      scale,
      rotate,
      opacity,
    },
  };
};
