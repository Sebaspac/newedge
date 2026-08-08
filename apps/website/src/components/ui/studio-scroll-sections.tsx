import React, { useRef, ReactNode } from "react";
import { useScroll, useTransform, useMotionValueEvent, motion, MotionValue } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceDeliverable {
  title: string;
  description: string;
}

interface ServiceData {
  number: string;
  title: string;
  problem: string;
  solution: string;
  animation: ReactNode;
  deliverables: ServiceDeliverable[];
}

interface StudioScrollSectionsProps {
  services: ServiceData[];
}

export function StudioScrollSections({ services }: StudioScrollSectionsProps) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = React.useState(0);
  const numSlides = services.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const seg = 1 / numSlides;
    const idx = Math.min(numSlides - 1, Math.floor(v / seg));
    setActiveIndex(idx);
  });

  if (isMobile) {
    return <MobileServices services={services} />;
  }

  return (
    <div ref={containerRef} style={{ height: `${(numSlides + 1) * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        {services.map((service, idx) => {
          // Determine visual state: current, next (below), previous (above)
          const isCurrent = idx === activeIndex;
          const isPrev = idx < activeIndex;
          const isNext = idx > activeIndex;

          return (
            <div
              key={service.number}
              className="absolute inset-0 transition-transform duration-700"
              style={{
                // Split-screen effect: use CSS custom property to coordinate halves
                visibility: Math.abs(idx - activeIndex) <= 1 ? "visible" : "hidden",
              }}
            >
              {/* Left Half - slides vertically (bottom → center → top) */}
              <div
                className="absolute top-0 left-0 w-1/2 h-full bg-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  transform: isCurrent
                    ? "translateY(0%)"
                    : isPrev
                      ? "translateY(-100%)"
                      : "translateY(100%)",
                }}
              >
                <div className="relative h-full flex flex-col justify-center px-12 lg:px-20">
                  <span
                    className="absolute top-8 right-8 text-[180px] lg:text-[240px] font-black leading-none select-none pointer-events-none"
                    style={{
                      WebkitTextStroke: "1px rgba(99,102,241,0.12)",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {service.number}
                  </span>
                  <div className="relative z-10 max-w-lg">
                    <span className="text-xs font-mono tracking-widest text-black/30 uppercase">
                      Service {service.number}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mt-3 leading-[1.05]">
                      {service.title}
                    </h2>
                    <div className="mt-10 space-y-8">
                      <div>
                        <h3 className="text-xs font-bold tracking-widest text-red-500/70 uppercase mb-3">
                          Das Problem
                        </h3>
                        <p className="text-black/60 text-sm leading-relaxed">{service.problem}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold tracking-widest text-indigo-600/70 uppercase mb-3">
                          Unsere Lösung
                        </h3>
                        <p className="text-black/60 text-sm leading-relaxed">{service.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Half - slides in opposite direction (top → center → bottom) */}
              <div
                className="absolute top-0 right-0 w-1/2 h-full bg-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  transform: isCurrent
                    ? "translateY(0%)"
                    : isPrev
                      ? "translateY(100%)"
                      : "translateY(-100%)",
                }}
              >
                <div className="h-full flex items-center justify-center px-8 lg:px-16">
                  <div className="w-full max-w-lg">{service.animation}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Deliverables at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="grid grid-cols-4 gap-px bg-black/5">
            {services[activeIndex]?.deliverables.map((d, i) => (
              <div
                key={`${activeIndex}-${i}`}
                className="bg-white/95 backdrop-blur-sm p-5 lg:p-6 animate-in fade-in duration-500"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-[10px] font-mono text-black/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="text-black font-bold mt-1 text-xs lg:text-sm">{d.title}</h4>
                <p className="text-black/40 text-[10px] lg:text-xs mt-1 leading-relaxed">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dot navigation */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
          {services.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-black scale-150" : "bg-black/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile Fallback ─── */
function MobileServices({ services }: { services: ServiceData[] }) {
  return (
    <div className="bg-white">
      {services.map((service) => (
        <section key={service.number} className="py-20 px-6 border-b border-black/5 last:border-b-0">
          <span className="text-xs font-mono tracking-widest text-black/30 uppercase">
            Service {service.number}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black mt-3 leading-[1.05]">
            {service.title}
          </h2>
          <div className="mt-8">{service.animation}</div>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-xs font-bold tracking-widest text-red-500/70 uppercase mb-2">Das Problem</h3>
              <p className="text-black/60 text-sm leading-relaxed">{service.problem}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-widest text-indigo-600/70 uppercase mb-2">Unsere Lösung</h3>
              <p className="text-black/60 text-sm leading-relaxed">{service.solution}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px mt-10 bg-black/5">
            {service.deliverables.map((d, i) => (
              <div key={i} className="bg-white p-4">
                <span className="text-[10px] font-mono text-black/20">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="text-black font-bold mt-1 text-xs">{d.title}</h4>
                <p className="text-black/40 text-[10px] mt-1 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
