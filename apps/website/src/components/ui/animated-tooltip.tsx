"use client";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedTooltip = ({
  items,
  className,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event: React.MouseEvent) => {
    const halfWidth = (event.target as HTMLElement).offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {items.map((item, idx) => (
        <div
          className="-mr-4 relative group"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "normal",
                }}
                className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center rounded-xl bg-black z-50 shadow-xl px-4 py-3 w-[220px]"
              >
                <div className="absolute inset-x-4 z-30 w-[40%] -bottom-px bg-gradient-to-r from-transparent via-amber-500 to-transparent h-px" />
                <div className="absolute left-4 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent h-px" />
                <p className="text-white font-bold text-xs text-center leading-snug">
                  {item.name}
                </p>
                <p className="text-white/60 text-[10px] text-center mt-1 leading-snug">
                  {item.designation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            onMouseMove={handleMouseMove}
            className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-white bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black text-lg sm:text-xl cursor-pointer shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:z-30"
          >
            {item.icon || String(idx + 1).padStart(2, "0")}
          </div>
        </div>
      ))}
    </div>
  );
};
