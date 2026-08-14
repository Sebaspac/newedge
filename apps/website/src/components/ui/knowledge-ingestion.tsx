import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, FileText, FileCode, Wrench, ClipboardList, Sheet } from "lucide-react";

interface DocumentTile {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const documentTypes: DocumentTile[] = [
  { id: "pdf", icon: <FileText className="w-4 h-4" />, label: "PDF", color: "#CCFF00" },
  { id: "cad", icon: <FileCode className="w-4 h-4" />, label: "CAD", color: "#CCFF00" },
  { id: "sop", icon: <ClipboardList className="w-4 h-4" />, label: "SOP", color: "#CCFF00" },
  { id: "ticket", icon: <Wrench className="w-4 h-4" />, label: "Ticket", color: "#CCFF00" },
  { id: "sheet", icon: <Sheet className="w-4 h-4" />, label: "Sheet", color: "#CCFF00" },
];

interface AnimatingDoc {
  id: string;
  startX: number;
  startY: number;
  icon: React.ReactNode;
  color: string;
}

export const KnowledgeIngestion: React.FC = () => {
  const [animatingDocs, setAnimatingDocs] = useState<AnimatingDoc[]>([]);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const startAnimation = () => {
      const randomDoc = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      const startPositions = [
        { x: 60, y: containerSize.height * 0.15 },
        { x: 60, y: containerSize.height * 0.35 },
        { x: 60, y: containerSize.height * 0.55 },
        { x: 60, y: containerSize.height * 0.75 },
      ];
      const randomPos = startPositions[Math.floor(Math.random() * startPositions.length)];

      const newDoc: AnimatingDoc = {
        id: `${randomDoc.id}-${Date.now()}`,
        startX: randomPos.x,
        startY: randomPos.y,
        icon: randomDoc.icon,
        color: randomDoc.color,
      };

      setAnimatingDocs((prev) => [...prev, newDoc]);

      setTimeout(() => {
        setIsGlowing(true);
        setTimeout(() => {
          setIsGlowing(false);
          setIsBouncing(true);
          setTimeout(() => {
            setIsBouncing(false);
          }, 600);
        }, 300);
      }, 1800);

      setTimeout(() => {
        setAnimatingDocs((prev) => prev.filter((doc) => doc.id !== newDoc.id));
      }, 2500);
    };

    intervalRef.current = window.setInterval(startAnimation, 2000);
    startAnimation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [containerSize]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-purple-800/30 to-purple-900/30 rounded-3xl border border-purple-500/30 backdrop-blur-sm overflow-hidden"
    >
      {/* Document source tiles */}
      <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 md:gap-4">
        {documentTypes.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.4, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-800/40 backdrop-blur-md border border-purple-500/30 flex items-center justify-center text-purple-300"
            style={{ filter: "blur(1px)" }}
          >
            {doc.icon}
          </motion.div>
        ))}
      </div>

      {/* Animating documents */}
      <AnimatePresence>
        {animatingDocs.map((doc) => {
          // Calculate percentage-based start positions
          const startXPercent = (doc.startX / containerSize.width) * 100;
          const startYPercent = (doc.startY / containerSize.height) * 100;
          
          return (
            <motion.div
              key={doc.id}
              className="absolute w-10 h-10 md:w-12 md:h-12 rounded-lg backdrop-blur-md border flex items-center justify-center text-white shadow-lg"
              initial={{
                left: `${startXPercent}%`,
                top: `${startYPercent}%`,
                x: "-50%",
                y: "-50%",
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                left: [`${startXPercent}%`, "45%", "50%"],
                top: [`${startYPercent}%`, "50%", "50%"],
                x: "-50%",
                y: "-50%",
                scale: [0.8, 0.6, 0.2],
                opacity: [0, 1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                times: [0, 0.5, 1],
                ease: "easeInOut",
              }}
              style={{
                backgroundColor: `${doc.color}40`,
                borderColor: `${doc.color}80`,
                boxShadow: `0 0 20px ${doc.color}40`,
              }}
            >
              {doc.icon}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Central database icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={
            isBouncing
              ? {
                  scale: [1, 1.1, 0.95, 1.05, 1],
                  y: [0, -8, 4, -2, 0],
                }
              : {}
          }
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={
              isGlowing
                ? {
                    boxShadow: [
                      "0 0 0px rgba(168, 85, 247, 0)",
                      "0 0 40px rgba(168, 85, 247, 0.6)",
                      "0 0 60px rgba(168, 85, 247, 0.4)",
                      "0 0 0px rgba(168, 85, 247, 0)",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
          <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-2xl border-4 border-purple-400/50">
            <Database className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        </motion.div>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-purple-900/50 backdrop-blur-md rounded-lg px-3 py-1.5 md:px-4 md:py-2 border border-purple-500/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-purple-200 text-xs md:text-sm">Active Processing</span>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeIngestion;
