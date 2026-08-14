"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "Verbindet sich mit den Tools die ihr bereits nutzt",
  logos = [],
  className,
}: Logos3Props) => {
  // Genug Wiederholungen, damit der Track bei jeder Scroll-Position gefuellt
  // bleibt (sonst reisst die Endlosschleife bei wenigen Logos sichtbar ab).
  const loopedLogos = logos.length > 0
    ? Array.from({ length: 4 }, (_, i) => logos.map((logo) => ({ ...logo, key: `${logo.id}-${i}` }))).flat()
    : [];

  return (
    <section className={className}>
      {heading && (
        <div className="mb-6">
          <p className="text-center font-[Consolas,monospace] text-sm text-muted-foreground tracking-wide uppercase">
            {heading}
          </p>
        </div>
      )}
      <div className="relative max-w-[880px] mx-auto">
        <div className="flex items-center">
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[
              AutoScroll({
                speed: 0.6,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
          >
            <CarouselContent className="-ml-4 justify-center">
              {loopedLogos.map((logo) => (
                <CarouselItem
                  key={logo.key}
                  className="basis-1/4 md:basis-1/5 lg:basis-1/6 pl-4"
                >
                  <div className="flex items-center justify-center h-12">
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={logo.className || "h-7 w-auto"}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--fade-color,#F2F2F2)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--fade-color,#F2F2F2)] to-transparent" />
        </div>
      </div>
    </section>
  );
};

export { Logos3 };
