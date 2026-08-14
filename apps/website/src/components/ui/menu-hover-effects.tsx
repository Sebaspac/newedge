/**
 * Menü-Hover-Effekt (adaptiert aus der Vorlage „menu-hover-effects"):
 * Ober-/Unterkante skalieren beim Hover ein, dahinter füllt sich der
 * Hintergrund von oben — Textfarbe wechselt auf Weiß. In NEWEDGE-CI
 * (Violett-Fill statt Anthrazit), als wiederverwendbarer Baustein für
 * die bestehenden Menüpunkte statt einer festen Item-Liste.
 */
export const NavHoverItem = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block group/mhov cursor-pointer">
    {/* Inhalt (Label + optionale Icons) */}
    <span
      className="
        relative z-10 flex items-center gap-1 uppercase
        font-semibold text-[13px] tracking-[0.04em]
        text-[#171717] transition-colors duration-300
        group-hover/mhov:text-[#171717]
        py-2 px-3
      "
      style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      {children}
    </span>
    {/* Ober- & Unterkanten-Animation */}
    <span
      aria-hidden
      className="
        absolute inset-0 border-t-2 border-b-2 border-[#CCFF00]
        transform scale-y-[2] opacity-0
        transition-all duration-300 origin-center
        group-hover/mhov:scale-y-100 group-hover/mhov:opacity-100
      "
    />
    {/* Hintergrund-Fill von oben */}
    <span
      aria-hidden
      className="
        absolute top-[2px] left-0 w-full h-[calc(100%-4px)] bg-[#CCFF00]
        transform scale-y-0 opacity-0
        transition-all duration-300 origin-top
        group-hover/mhov:scale-y-100 group-hover/mhov:opacity-100
      "
    />
  </span>
);
