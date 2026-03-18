import { SectionWrapper } from "../section-wrapper";
import { CarouselSection } from "./carousel-section";
import { GridSection } from "./grid-section";
import { HighlightSection } from "./highlight-section";
import { BannerSection } from "./banner-section";
import { TextSection } from "./text-section";
import type { LandingSectionWithItems } from "@/types";

interface DynamicSectionProps {
  section: LandingSectionWithItems;
}

export function DynamicSection({ section }: DynamicSectionProps) {
  if (section.items.length === 0) return null;

  const config = section.config;

  const inner = (() => {
    switch (section.layout) {
      case "CAROUSEL":
        return (
          <CarouselSection
            items={section.items}
            itemsPerSlide={(config?.itemsPerSlide as 1 | 2 | 3 | 4) || 3}
            autoplayDelay={(config?.autoplayDelay as number) || 5000}
          />
        );
      case "GRID":
        return <GridSection items={section.items} config={config} />;
      case "HIGHLIGHT":
        return <HighlightSection items={section.items} />;
      case "BANNER":
        return <BannerSection items={section.items} />;
      case "TEXT":
        return <TextSection items={section.items} />;
      default:
        return <GridSection items={section.items} config={config} />;
    }
  })();

  return (
    <SectionWrapper id={section.slug} title={section.title}>
      {inner}
    </SectionWrapper>
  );
}
