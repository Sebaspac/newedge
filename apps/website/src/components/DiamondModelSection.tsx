import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { diamondModel as diamondModelStatic } from "@/content";
import { diamondModel as diamondModelEn } from "@/content/en/sections/diamondModel";
import { useLocalizedStatic } from "@/hooks/useLocalized";
import "./DiamondModelSection.css";

const LAST_SCENE_INDEX = 2;
const SCENE_DURATIONS = [3600, 5200, 0] as const;

/* Schichtbreiten der Organisationsstruktur pro Szene (unten → oben gerendert). */
const PYRAMID_WIDTHS = [100, 86, 72, 58, 44, 30, 16];
const COMPRESSED_WIDTHS = [46, 62, 78, 70, 56, 40, 22];
const SUPPORTED_DIAMOND_WIDTHS = [8, 22, 40, 58, 44, 30, 16];
const SCENE_WIDTHS = [
  PYRAMID_WIDTHS,
  COMPRESSED_WIDTHS,
  SUPPORTED_DIAMOND_WIDTHS,
].map((widths) => [...widths].reverse());

/* Aufgaben-Partikel [left%, top%, isEdge?] — steigen in Szene 2 aus dem KI-Layer auf. */
const TASK_DOTS = [
  [19, 82], [27, 84], [35, 80], [43, 85], [51, 81], [59, 86], [67, 82], [75, 85], [82, 80],
  [24, 73], [33, 75], [42, 71], [51, 76], [60, 72], [69, 75], [77, 71],
  [30, 64], [39, 66], [48, 62], [57, 67], [66, 63], [73, 66],
  [36, 58], [44, 60], [52, 57], [60, 60], [68, 58],
  [29, 62, 1], [73, 62, 1],
  [26, 68, 1], [76, 68, 1],
  [23, 74, 1], [79, 74, 1],
  [20, 80, 1], [82, 80, 1],
  [17, 87, 1], [85, 87, 1],
  [28, 90, 1], [39, 90, 1], [50, 90, 1], [61, 90, 1], [72, 90, 1],
];

const isInsideFinalDiamond = (left: number, top: number) => {
  if (top < 60) return left > 36 && left < 64;
  if (top < 70) return left > 42 && left < 58;
  if (top < 79) return left > 47 && left < 53;
  return left >= 49 && left <= 51;
};

/**
 * KI-Diamant-Modell (Startseite, direkt nach den Kennzahlen): interaktive
 * 3-Szenen-Animation „Aus Pyramide wird Diamant" als dunkle Instrument-Karte.
 * Übernommen aus dem Standalone-Modul „NEWEDGE-KI-Diamant", auf CI angepasst
 * (Outfit erbt vom Body, Lime #CCFF00, Ink #171717, 24px-Kartenradius).
 */
export const DiamondModelSection = () => {
  const c = useLocalizedStatic(diamondModelStatic, diamondModelEn);
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  // Modul-lokaler Hell/Dunkel-Umschalter (kein globales Site-Theme).
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const heroRef = useRef<HTMLElement>(null);
  const pointerPositionRef = useRef({ clientX: 0, clientY: 0 });
  const pointerFrameRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (pointerFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (
      !playing
      || scene === LAST_SCENE_INDEX
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (scene === LAST_SCENE_INDEX - 1) setPlaying(false);
      setScene(scene + 1);
    }, SCENE_DURATIONS[scene]);

    return () => window.clearTimeout(timer);
  }, [playing, scene]);

  const selectScene = (nextScene: number) => {
    setScene(nextScene);
    setPlaying(false);
  };

  const next = () => {
    if (scene === LAST_SCENE_INDEX) {
      setScene(0);
      setPlaying(true);
      return;
    }

    setScene(scene + 1);
    setPlaying(false);
  };

  const previous = () => {
    setScene((current) => (current - 1 + c.scenes.length) % c.scenes.length);
    setPlaying(false);
  };

  /* Pointer-Glow: rAF-gedrosselt, schreibt nur CSS-Variablen (kein React-State). */
  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;

    pointerPositionRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
    };

    if (pointerFrameRef.current !== null) return;

    pointerFrameRef.current = window.requestAnimationFrame(() => {
      pointerFrameRef.current = null;

      const element = heroRef.current;
      if (!element) return;

      const bounds = element.getBoundingClientRect();
      const { clientX, clientY } = pointerPositionRef.current;
      const x = Math.min(
        100,
        Math.max(0, ((clientX - bounds.left) / bounds.width) * 100),
      );
      const y = Math.min(
        100,
        Math.max(0, ((clientY - bounds.top) / bounds.height) * 100),
      );

      element.style.setProperty("--pointer-x", `${x}%`);
      element.style.setProperty("--pointer-y", `${y}%`);
    });
  };

  const widths = SCENE_WIDTHS[scene];

  return (
    <section className="nedm-shell" aria-label={c.ariaLabel} style={{ background: "#F2F2F2" }}>
      <article
        ref={heroRef}
        className={`nedm theme-${theme} scene-${scene}${scene === LAST_SCENE_INDEX ? " scene-final" : ""}`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight") next();
          if (event.key === "ArrowLeft") previous();
        }}
        onPointerMove={handlePointerMove}
      >
        <div className="nedm-noise" aria-hidden="true" />
        <header className="nedm-topbar">
          <div className="nedm-topbar-meta">
            <span className="nedm-signal"><i /> {c.liveTag}</span>
            <button
              type="button"
              className="nedm-theme-toggle"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              aria-label={c.themeToggleLabel}
              aria-pressed={theme === "light"}
            >
              <span className="nedm-theme-toggle-label">{theme === "dark" ? c.themeDark : c.themeLight}</span>
              <span className="nedm-theme-toggle-track" aria-hidden="true">
                <i />
              </span>
            </button>
            <button
              type="button"
              className="nedm-play-button"
              onClick={() => {
                if (scene === LAST_SCENE_INDEX) setScene(0);
                setPlaying((current) => !current || scene === LAST_SCENE_INDEX);
              }}
              aria-label={playing ? c.pauseLabel : c.playLabel}
              aria-pressed={playing}
            >
              {playing ? "Ⅱ" : "▶"}
            </button>
          </div>
        </header>

        <div className="nedm-grid">
          <div className="nedm-copy-column">
            <h2 className="nedm-title">
              {c.titleLine1}<br />
              {c.titleLine2}{" "}
              {/* Hell: Ink-Wort mit Lime-Marker (Site-Pattern edge-mark), Dunkel: Lime-Wort */}
              <em className={theme === "light" ? "edge-mark" : undefined}>{c.titleAccent}</em>
            </h2>

            <div className="nedm-scene-copy" aria-live="polite" aria-atomic="true" key={scene}>
              <span className="nedm-scene-index">{c.scenes[scene].eyebrow}</span>
              <h3>{c.scenes[scene].title}</h3>
              <p>{c.scenes[scene].text}</p>
            </div>

            <button type="button" className="nedm-primary-action" onClick={next}>
              <span>{scene === LAST_SCENE_INDEX ? c.replay : c.next}</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="nedm-model-column" aria-hidden="true">
            <div className="nedm-model-frame">
              <div className="nedm-frame-corner nedm-corner-tl" />
              <div className="nedm-frame-corner nedm-corner-tr" />
              <div className="nedm-frame-corner nedm-corner-bl" />
              <div className="nedm-frame-corner nedm-corner-br" />

              <div className="nedm-structure-wrap">
                <div className="nedm-orbit nedm-orbit-one" />
                <div className="nedm-orbit nedm-orbit-two" />

                <div className="nedm-task-field">
                  {TASK_DOTS.map(([left, top, isEdge], index) => {
                    const dotRole = isInsideFinalDiamond(left, top)
                      ? "nedm-diamond-dot"
                      : "nedm-support-dot";

                    return (
                      <i
                        key={index}
                        className={`${isEdge ? "nedm-edge-dot " : ""}${dotRole}`}
                        style={{
                          "--dot-left": `${left}%`,
                          "--dot-top": `${top}%`,
                          "--dot-delay": `${index * 55}ms`,
                          "--merge-delay": `${Math.max(0, 88 - top) * 4}ms`,
                          "--merge-top": `${Math.min(top, 86)}%`,
                          "--merge-shift": left < 50 ? "-5px" : left > 50 ? "5px" : "0px",
                        } as CSSProperties}
                      />
                    );
                  })}
                </div>

                <div className="nedm-structure">
                  {widths.map((width, index) => {
                    const layer = 6 - index;
                    return (
                      <div
                        className={`nedm-structure-layer nedm-layer-${layer}`}
                        key={layer}
                        style={{ width: `${width}%`, transitionDelay: `${Math.abs(3 - layer) * 35}ms` }}
                      >
                        <span />
                      </div>
                    );
                  })}

                  <div className="nedm-supports">
                    <div className="nedm-support-triangle nedm-support-left">
                      <span>NEWEDGE</span>
                    </div>
                    <div className="nedm-support-triangle nedm-support-right">
                      <span>NEWEDGE</span>
                    </div>
                  </div>
                </div>

                <div className="nedm-core-label">
                  {scene !== LAST_SCENE_INDEX && (
                    <small>{c.coreLabel}</small>
                  )}
                  <strong>{c.scenes[scene].metric}</strong>
                </div>

                <div className="nedm-ai-emitter" />
                <div className="nedm-ai-node">
                  <span>AI</span>
                  <i /><i /><i /><i />
                </div>

                <span className="nedm-human-label">{c.humanLabel}</span>
                <span className="nedm-decision-label">{c.decisionLabel}</span>
              </div>

            </div>
          </div>
        </div>

        <nav className="nedm-scene-nav" aria-label={c.sceneNavLabel}>
          {c.scenes.map((item, index) => (
            <button
              type="button"
              key={item.step}
              className={index === scene ? "active" : ""}
              onClick={() => selectScene(index)}
              aria-current={index === scene ? "step" : undefined}
            >
              <span className="nedm-nav-number">{item.step}</span>
              <span className="nedm-nav-title">{item.title}</span>
              <i><b /></i>
            </button>
          ))}
        </nav>
      </article>
    </section>
  );
};
