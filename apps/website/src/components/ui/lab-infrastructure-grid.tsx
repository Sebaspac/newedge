import React from "react";
import { motion } from "framer-motion";

interface InfrastructureItem {
  title: string;
  description: string;
}

interface LabInfrastructureGridProps {
  items: InfrastructureItem[];
  colorScheme?: "amber" | "indigo";
}

export const LabInfrastructureGrid: React.FC<LabInfrastructureGridProps> = ({ items, colorScheme = "amber" }) => {
  const isIndigo = colorScheme === "indigo";
  const accentRgba = isIndigo ? "rgba(99,102,241," : "rgba(251,191,36,";
  const borderColor = isIndigo ? "border-indigo-400/30" : "border-amber-400/30";
  const bgColor = isIndigo ? "bg-indigo-50" : "bg-amber-50";
  const textColor = isIndigo ? "text-indigo-600" : "text-amber-600";
  const gradientFrom = isIndigo ? "from-indigo-400/40" : "from-amber-400/40";
  const gradientVia = isIndigo ? "via-indigo-400/10" : "via-amber-400/10";
  const gradientViaBorder = isIndigo ? "via-indigo-400/10" : "via-amber-400/10";

  return (
    <div className="relative">
      {/* SVG Connection Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`line-gradient-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`${accentRgba}0.08)`} />
            <stop offset="50%" stopColor={`${accentRgba}0.25)`} />
            <stop offset="100%" stopColor={`${accentRgba}0.08)`} />
          </linearGradient>
        </defs>
        {/* Horizontal lines */}
        <line x1="33.3%" y1="50%" x2="66.6%" y2="50%" stroke={`url(#line-gradient-${colorScheme})`} strokeWidth="1" />
        <line x1="0%" y1="50%" x2="33.3%" y2="50%" stroke={`url(#line-gradient-${colorScheme})`} strokeWidth="1" />
        <line x1="66.6%" y1="50%" x2="100%" y2="50%" stroke={`url(#line-gradient-${colorScheme})`} strokeWidth="1" />
        {/* Vertical connector dots */}
        {[16.65, 50, 83.3].map((cx, i) => (
          <circle key={i} cx={`${cx}%`} cy="50%" r="3" fill={`${accentRgba}0.3)`} />
        ))}
      </svg>

      {/* Top Row - 3 items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/5 relative z-10">
        {items.slice(0, 3).map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white p-5 sm:p-6 group hover:bg-gray-50/80 transition-all duration-500 relative"
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border ${borderColor} ${bgColor} flex items-center justify-center`}>
                <span className={`text-[10px] font-mono font-bold ${textColor}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-black font-bold text-sm sm:text-base leading-snug">
                  {item.title}
                </h4>
                <p className="text-black/45 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className={`absolute top-0 right-0 w-px h-8 bg-gradient-to-b ${gradientFrom} to-transparent`} />
              <div className={`absolute top-0 right-0 h-px w-8 bg-gradient-to-l ${gradientFrom} to-transparent`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vertical connectors */}
      <div className="hidden sm:grid grid-cols-3 relative z-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex justify-center">
            <div className={`w-px h-8 bg-gradient-to-b ${gradientFrom} ${gradientViaBorder} ${gradientFrom}`} />
          </div>
        ))}
      </div>

      {/* Bottom Row - 2 items centered */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/5 sm:max-w-[66.7%] sm:mx-auto relative z-10">
        {items.slice(3).map((item, i) => (
          <motion.div
            key={i + 3}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: (i + 3) * 0.1 }}
            className="bg-white p-5 sm:p-6 group hover:bg-gray-50/80 transition-all duration-500 relative"
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border ${borderColor} ${bgColor} flex items-center justify-center`}>
                <span className={`text-[10px] font-mono font-bold ${textColor}`}>
                  {String(i + 4).padStart(2, "0")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-black font-bold text-sm sm:text-base leading-snug">
                  {item.title}
                </h4>
                <p className="text-black/45 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className={`absolute top-0 right-0 w-px h-8 bg-gradient-to-b ${gradientFrom} to-transparent`} />
              <div className={`absolute top-0 right-0 h-px w-8 bg-gradient-to-l ${gradientFrom} to-transparent`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
