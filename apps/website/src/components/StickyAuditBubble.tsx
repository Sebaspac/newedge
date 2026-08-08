import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath } from "@/utils/localePath";

const StickyAuditBubble = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Show only after scrolling past the hero section
  useEffect(() => {
    const onScroll = () => {
      // Hero is typically 100dvh, so ~window.innerHeight
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect mobile menu open state by observing the menu overlay in the DOM
  useEffect(() => {
    const check = () => {
      // MobileNavigation uses a fixed overlay with role or specific structure
      // Check for the mobile menu overlay (AnimatePresence renders a fixed div)
      const overlay = document.querySelector('[data-mobile-menu="open"]');
      setMenuOpen(!!overlay);
    };

    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    check();
    return () => observer.disconnect();
  }, []);

  if (location.pathname === "/ki-audit") return null;

  const visible = pastHero && !menuOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{
            top: 0,
            left: 0,
            right: typeof window !== "undefined" ? window.innerWidth - 70 : 1000,
            bottom: typeof window !== "undefined" ? window.innerHeight - 90 : 800,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          onDragStart={(_, info) => {
            dragStartPos.current = { x: info.point.x, y: info.point.y };
            setIsDragging(true);
            document.body.style.userSelect = "none";
            document.body.style.webkitUserSelect = "none";
          }}
          onDragEnd={(_, info) => {
            const dx = Math.abs(info.point.x - dragStartPos.current.x);
            const dy = Math.abs(info.point.y - dragStartPos.current.y);
            if (dx < 5 && dy < 5) {
              navigate(localizePath("/ki-audit", language));
              window.scrollTo(0, 0);
            }
            document.body.style.userSelect = "";
            document.body.style.webkitUserSelect = "";
            setTimeout(() => setIsDragging(false), 50);
          }}
          onClick={() => {
            if (!isDragging) { navigate(localizePath("/ki-audit", language)); window.scrollTo(0, 0); }
          }}
          className="fixed bottom-8 right-8 z-[9999] cursor-grab active:cursor-grabbing flex flex-col items-center gap-2"
          style={{ touchAction: "none", userSelect: "none", WebkitUserSelect: "none" }}
        >
          {/* Label */}
          <motion.div
            className="rounded-none bg-foreground px-3 py-1.5 text-background text-xs font-mono font-bold tracking-wide whitespace-nowrap shadow-glow select-none pointer-events-none"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Kostenlose Analyse sichern
          </motion.div>

          {/* Bubble */}
          <div className="relative">
            <motion.div
              className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-glow"
              animate={{
                boxShadow: [
                  "0 0 20px hsl(var(--primary-glow) / 0.4)",
                  "0 0 40px hsl(var(--primary-glow) / 0.7)",
                  "0 0 20px hsl(var(--primary-glow) / 0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyAuditBubble;
