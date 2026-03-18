"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LandingItem } from "@/types";

interface CarouselSectionProps {
  items: LandingItem[];
  itemsPerSlide?: 1 | 2 | 3 | 4;
  autoplayDelay?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
}

const slideClassMap: Record<number, string> = {
  1: "min-w-0 flex-[0_0_100%] pl-4 lg:flex-[0_0_65%]",
  2: "min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%]",
  3: "min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]",
  4: "min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] md:flex-[0_0_33.333%] xl:flex-[0_0_25%]",
};

export function CarouselSection({
  items,
  itemsPerSlide = 3,
  autoplayDelay = 5000,
  loop = true,
  showArrows = true,
  showDots = true,
}: CarouselSectionProps) {
  const plugins = autoplayDelay > 0
    ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })]
    : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop, align: itemsPerSlide === 1 ? "center" : "start", slidesToScroll: 1 },
    plugins
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const slideClass = slideClassMap[itemsPerSlide] ?? slideClassMap[3];

  return (
    <div className="relative group">
      <div ref={emblaRef} className="overflow-hidden rounded-xl">
        <div className="flex -ml-4">
          {items.map((item) => {
            const imageOnly = item.imageUrl && !item.title;

            return (
              <div key={item.id} className={slideClass}>
                <div className="rounded-xl border border-border/50 bg-card overflow-hidden h-full">
                  {item.imageUrl && (
                    <div className={cn("overflow-hidden bg-muted", imageOnly ? "" : "aspect-video")}>
                      {imageOnly && item.linkUrl ? (
                        <a href={item.linkUrl}>
                          <img src={item.imageUrl} alt={item.description ? "" : "image"} className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
                        </a>
                      ) : (
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]" />
                      )}
                    </div>
                  )}
                  {!imageOnly && (
                    <div className="p-4">
                      {item.title && <h3 className="font-semibold text-foreground">{item.title}</h3>}
                      {item.description && (
                        <div className="mt-1 text-sm text-muted-foreground [&_p]:m-0 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_a]:text-primary [&_a]:underline" dangerouslySetInnerHTML={{ __html: item.description }} />
                      )}
                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                        >
                          Ver mais →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showArrows && items.length > itemsPerSlide && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {showDots && scrollSnaps.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selectedIndex ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
