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

  const inner = (() => {
    switch (section.layout) {
      case "CAROUSEL":
        return <CarouselSection items={section.items} />;
      case "GRID":
        return <GridSection items={section.items} />;
      case "HIGHLIGHT":
        return <HighlightSection items={section.items} />;
      case "BANNER":
        return <BannerSection items={section.items} />;
      case "TEXT":
        return <TextSection items={section.items} />;
      default:
        return <GridSection items={section.items} />;
    }
  })();

  return (
    <SectionWrapper id={section.slug} title={section.title}>
      {inner}
    </SectionWrapper>
  );
}
