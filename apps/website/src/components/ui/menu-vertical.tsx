/**
 * MenuVertical — großes vertikales Menü (Referenz: 21st.dev „Menu Vertical"),
 * adaptiert auf die NEWEDGE-CI (Violett-Akzent statt Orange, Outfit-Font) und
 * unseren Stack (framer-motion statt motion/react, react-router statt next/link).
 *
 * Interaktion: beim Hover/Tap slidet ein Pfeil von links rein, das Label rückt
 * nach und färbt sich in der Akzentfarbe. `whileTap` sorgt dafür, dass der
 * Effekt auch auf Touch (Mobile-Drawer) auslöst.
 */
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LocaleLink as Link } from "@/components/LocaleLink";

const FLASH = "#FF1E00";
const INK_DEEP = "#171717";
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

type MenuItem = {
  label: string;
  href: string;
};

interface MenuVerticalProps {
  menuItems: MenuItem[];
  /** Akzentfarbe beim Hover/Tap (Standard: NEWEDGE-Violett). */
  color?: string;
  /** Skew des Labels beim Hover/Tap (Standard 0). */
  skew?: number;
  /** Tailwind-Textgröße der Labels (Standard text-4xl). */
  textClassName?: string;
  /** Callback bei Klick — z. B. um den Mobile-Drawer zu schließen. */
  onItemClick?: () => void;
}

const MotionLink = motion.create(Link);

export const MenuVertical = ({
  menuItems = [],
  color = FLASH,
  skew = 0,
  textClassName = "text-4xl",
  onItemClick,
}: MenuVerticalProps) => {
  return (
    <div className="flex w-fit flex-col gap-3">
      {menuItems.map((item, index) => (
        <motion.div
          key={`${item.href}-${index}`}
          className="group/nav flex items-center gap-2 cursor-pointer"
          style={{ color: INK_DEEP, fontFamily: OUTFIT }}
          initial="initial"
          whileHover="hover"
          whileTap="hover"
        >
          <motion.div
            aria-hidden
            variants={{
              initial: { x: "-100%", color: "inherit", opacity: 0 },
              hover: { x: 0, color, opacity: 1 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="z-0"
          >
            <ArrowRight strokeWidth={3} className="size-8" />
          </motion.div>

          <MotionLink
            to={item.href}
            onClick={onItemClick}
            variants={{
              initial: { x: -40, color: "inherit" },
              hover: { x: 0, color, skewX: skew },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`font-semibold ${textClassName} no-underline`}
          >
            {item.label}
          </MotionLink>
        </motion.div>
      ))}
    </div>
  );
};
