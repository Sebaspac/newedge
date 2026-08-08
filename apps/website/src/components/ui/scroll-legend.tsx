"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LegendItem {
  id: string;
  name: string;
}

interface ScrollLegendProps {
  items: LegendItem[];
  className?: string;
}

export function ScrollLegend({ items, className }: ScrollLegendProps) {
  const [activeSection, setActiveSection] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hide until past hero (100vh)
      setVisible(window.scrollY > window.innerHeight * 0.8);

      const sections = items.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(items[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3 transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            className="flex items-center gap-3 group cursor-pointer bg-transparent border-none p-0"
            onClick={() => scrollToSection(item.id)}
          >
            {/* Horizontal line indicator */}
            <div
              className={cn(
                "transition-all duration-300",
                activeSection === item.id
                  ? "w-8 h-[2px] bg-[#CCFF00]"
                  : "w-4 h-[1px] bg-[#999] group-hover:w-6 group-hover:bg-[#CCFF00]"
              )}
            />

            {/* Section name — only visible on hover */}
            <span
              className={cn(
                "text-[0.7rem] whitespace-nowrap transition-all duration-300",
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2 pointer-events-none",
                activeSection === item.id
                  ? "text-[#CCFF00] font-semibold"
                  : "text-[#888]"
              )}
              style={{ fontFamily: "Consolas, monospace" }}
            >
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
