import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
  renderWord?: (word: string) => React.ReactNode;
}

export default function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
  renderWord,
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        const newWidth = elements[currentIndex].getBoundingClientRect().width;
        setWidth(`${newWidth}px`);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, words.length]);

  const containerVariants = {
    hidden: { y: -20, opacity: 0, filter: "blur(8px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
    exit: {
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: { duration: 0.3, ease: "easeIn" as const },
    },
  };

  return (
    <>
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        {words.map((word, i) => (
          <span key={i} className={className}>
            {renderWord ? renderWord(word) : word}
          </span>
        ))}
      </div>

      <span
        className="inline-flex relative align-baseline"
        style={{ width, transition: "width 0.3s ease", overflow: "visible", whiteSpace: "nowrap" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={className}
          >
            {renderWord ? renderWord(words[currentIndex]) : words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
