import { motion } from "framer-motion";
import { LocaleLink as Link } from "@/components/LocaleLink";
import React, { useState, useEffect } from "react";

type SweepColor = "lime" | "dark" | "white" | "silver";

interface SweepProps {
  sweepColor?: SweepColor;
  hoverTextColor?: string;
  duration?: number;
  exitDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

// ── Sweep overlay
// Enter: scaleY 0→1 from bottom (transformOrigin bottom)
// Exit:  scaleY 1→0 from top    (transformOrigin top → bottom disappears first = wipes upward)
const SweepOverlay = ({
  hovered,
  sweepColor = "lime",
  duration = 0.48,
  exitDuration,
}: {
  hovered: boolean;
  sweepColor?: SweepColor;
  duration?: number;
  exitDuration?: number;
}) => {
  const bg =
    sweepColor === "white"  ? "rgba(204,255,0,0.45)" // weicher Lime-Tint für weiße Buttons
    : sweepColor === "dark" ? "#CCFF00"   // Lime für Ghost/Dark-Buttons
    : sweepColor === "silver" ? "#CCFF00" // Lime für Light-BG-Buttons
    : "#171717";                          // Ink für Hover auf Lime-Buttons

  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");

  useEffect(() => {
    if (hovered) {
      setPhase("in");
    } else if (phase === "in") {
      setPhase("out");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  // transformOrigin: bottom for enter, top for exit (so bottom edge rises on exit)
  const transformOrigin = phase === "out" ? "50% 0%" : "50% 100%";

  return (
    <motion.span
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        pointerEvents: "none",
        zIndex: 0,
        transformOrigin,
      }}
      animate={{ scaleY: phase === "in" ? 1 : 0 }}
      initial={{ scaleY: 0 }}
      transition={{
        duration: phase === "out" ? (exitDuration ?? duration) : duration,
        ease: phase === "in" ? [0.16, 1, 0.3, 1] : [0.55, 0, 0.45, 1],
      }}
      onAnimationComplete={() => {
        if (phase === "out") setPhase("idle");
      }}
    />
  );
};

// ── <SweepButton> — wraps a <button>
export interface SweepButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    SweepProps {
  sweepColor?: SweepColor;
  hoverTextColor?: string;
  duration?: number;
  exitDuration?: number;
}

export const SweepButton: React.FC<SweepButtonProps> = ({
  children,
  sweepColor = "lime",
  hoverTextColor = "#ffffff",
  duration = 0.48,
  exitDuration,
  style,
  className = "",
  onClick,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      {...rest}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: 0,
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SweepOverlay hovered={hovered} sweepColor={sweepColor} duration={duration} exitDuration={exitDuration} />
      <motion.span
        style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "inherit" }}
        animate={{ color: hovered ? hoverTextColor : undefined }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.span>
    </button>
  );
};

// ── <SweepLink> — wraps a react-router <Link>
export interface SweepLinkProps extends SweepProps {
  to: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const SweepLink: React.FC<SweepLinkProps> = ({
  to,
  children,
  sweepColor = "lime",
  hoverTextColor = "#ffffff",
  duration = 0.48,
  style,
  className = "",
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      style={{ position: "relative", overflow: "hidden", textDecoration: "none", borderRadius: 0, ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SweepOverlay hovered={hovered} sweepColor={sweepColor} duration={duration} />
      <motion.span
        style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "inherit" }}
        animate={{ color: hovered ? hoverTextColor : undefined }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.span>
    </Link>
  );
};

// ── <SweepAnchor> — wraps an external <a>
export interface SweepAnchorProps extends SweepProps {
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

export const SweepAnchor: React.FC<SweepAnchorProps> = ({
  href,
  target,
  rel,
  children,
  sweepColor = "lime",
  hoverTextColor = "#ffffff",
  duration = 0.48,
  style,
  className = "",
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`relative overflow-hidden ${className}`}
      style={{ position: "relative", overflow: "hidden", textDecoration: "none", borderRadius: 0, ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SweepOverlay hovered={hovered} sweepColor={sweepColor} duration={duration} />
      <motion.span
        style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "inherit" }}
        animate={{ color: hovered ? hoverTextColor : undefined }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.span>
    </a>
  );
};
