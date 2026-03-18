import { HeroSection, AboutSection, ChampionshipsSection, StorePreview, DynamicSection } from "@/components/landing";
import { getVisibleSections } from "@/lib/services/landing.service";
import { getChampionships } from "@/lib/services/copafacil.service";
import { getActiveSaleItems } from "@/lib/services/sale-item.service";
import type { LandingSectionWithItems } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, championships, saleItems] = await Promise.all([
    getVisibleSections().catch(() => []),
    getChampionships().catch(() => []),
    getActiveSaleItems().catch(() => []),
  ]);

  return (
    <div>
      <HeroSection />
      <AboutSection />

      {(sections as LandingSectionWithItems[]).map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}

      <ChampionshipsSection championships={championships} />
      <StorePreview items={saleItems as any} />
    </div>
  );
}
