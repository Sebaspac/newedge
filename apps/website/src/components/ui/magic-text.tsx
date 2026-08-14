"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
export interface MagicTextProps {
  text: string;
}
interface WordProps {
  children: string;
  progress: any;
  range: number[];
}
const Word: React.FC<WordProps> = ({
  children,
  progress,
  range
}) => {
  const opacity = useTransform(progress, range, [0, 1]);
  // Kein italic: Outfit hat keinen Kursivschnitt, der Browser würde die Schrift
  // synthetisch scheren — bei bis zu 60px besonders sichtbar. Kursiv war die
  // Signatur des abgelösten DM Serif.
  return <span className="relative mt-3 mr-2 text-3xl md:text-5xl lg:text-6xl font-semibold">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{
      opacity: opacity
    }} className="text-accent-foreground">{children}</motion.span>
    </span>;
};
export const MagicText: React.FC<MagicTextProps> = ({
  text
}) => {
  const container = useRef(null);
  const {
    scrollYProgress
  } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"]
  });
  const words = text.split(" ");
  return <p ref={container} className="flex flex-wrap justify-center leading-tight p-4 text-black">
      {words.map((word, i) => {
      const start = i / words.length;
      const end = start + 1 / words.length;
      return <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>;
    })}
    </p>;
};