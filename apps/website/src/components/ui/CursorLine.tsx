import { useRef, useState, useCallback, useEffect } from "react";

interface CursorLineProps {
  children: React.ReactNode;
  /** Ref to the button element — the line ends at its perimeter */
  buttonRef: React.RefObject<HTMLElement | null>;
  /** Visual radius of the button circle (px). Line ends here, not at center. */
  buttonRadius?: number;
}

/**
 * Wraps a section and draws a live SVG bezier curve from
 * the user's cursor to the CTA button's perimeter.
 * Fades in on mouse enter, disappears when cursor is inside the button.
 */
export const CursorLine = ({
  children,
  buttonRef,
  buttonRadius = 76,
}: CursorLineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const [cursor,    setCursor]    = useState<{ x: number; y: number } | null>(null);
  const [btnCenter, setBtnCenter] = useState<{ x: number; y: number } | null>(null);
  const [active,    setActive]    = useState(false);

  /* ── keep button center current ── */
  const updateBtn = useCallback(() => {
    if (!buttonRef.current || !containerRef.current) return;
    const cr = containerRef.current.getBoundingClientRect();
    const br = buttonRef.current.getBoundingClientRect();
    setBtnCenter({
      x: br.left + br.width  / 2 - cr.left,
      y: br.top  + br.height / 2 - cr.top,
    });
  }, [buttonRef]);

  useEffect(() => {
    window.addEventListener("scroll", updateBtn, { passive: true });
    window.addEventListener("resize", updateBtn);
    return () => {
      window.removeEventListener("scroll", updateBtn);
      window.removeEventListener("resize", updateBtn);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateBtn]);

  /* ── mouse handlers ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const cr = containerRef.current.getBoundingClientRect();
      setCursor({ x: e.clientX - cr.left, y: e.clientY - cr.top });
      updateBtn();
    });
    if (!active) setActive(true);
  }, [active, updateBtn]);

  const handleMouseLeave = useCallback(() => {
    setActive(false);
    setCursor(null);
  }, []);

  /* ── compute SVG path ── */
  const svgData = (() => {
    if (!cursor || !btnCenter) return null;

    const { x: cx, y: cy } = cursor;
    const { x: bx, y: by } = btnCenter;
    const dx   = bx - cx;
    const dy   = by - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < buttonRadius + 24) return null; // cursor is inside / touching button

    /* endpoint — stop at the circle's perimeter */
    const ex = bx - (dx / dist) * buttonRadius;
    const ey = by - (dy / dist) * buttonRadius;

    /* control point for quadratic bezier:
       sits 60% along the direct line, offset perpendicular by 22% of distance.
       This creates a gentle, elegant single-arc curve. */
    const t    = 0.6;
    const perp = dist * 0.22;
    const qx   = cx + dx * t + (-dy / dist) * perp;
    const qy   = cy + dy * t + ( dx / dist) * perp;

    /* proximity fade: full opacity when far, fades to 0 just before the button */
    const fade = Math.min(1, Math.max(0, (dist - buttonRadius - 24) / 110));

    return {
      path: `M ${cx.toFixed(1)} ${cy.toFixed(1)} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      cx, cy, ex, ey,
      opacity: fade,
    };
  })();

  const show = active && !!svgData;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={updateBtn}
    >
      {children}

      {/* SVG overlay — pointer-events: none so it never blocks clicks */}
      <svg
        aria-hidden
        style={{
          position:      "absolute",
          inset:         0,
          width:         "100%",
          height:        "100%",
          pointerEvents: "none",
          overflow:      "visible",
          zIndex:        20,
          opacity:       show ? svgData!.opacity : 0,
          transition:    show ? "opacity 0.12s ease" : "opacity 0.3s ease",
        }}
      >
        <defs>
          {/* Gradient along the path — transparent at cursor, violet at button */}
          {svgData && (
            <linearGradient
              id="cl-stroke"
              gradientUnits="userSpaceOnUse"
              x1={svgData.cx} y1={svgData.cy}
              x2={svgData.ex} y2={svgData.ey}
            >
              <stop offset="0%"   stopColor="#CCFF00" stopOpacity="0"    />
              <stop offset="45%"  stopColor="#CCFF00" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.85" />
            </linearGradient>
          )}

          {/* Elegant open chevron tip — thin, rounded */}
          <marker
            id="cl-tip"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M 1.5 1.5 L 8.5 5 L 1.5 8.5"
              stroke="#CCFF00"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {svgData && (
          <path
            d={svgData.path}
            stroke="url(#cl-stroke)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#cl-tip)"
          />
        )}
      </svg>
    </div>
  );
};
