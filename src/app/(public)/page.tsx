import { HeroSection, AboutSection, StorePreview, DynamicSection, ChampionshipsSection } from "@/components/landing";
import { getVisibleSections } from "@/lib/services/landing.service";
import { getActiveSaleItems } from "@/lib/services/sale-item.service";
import { getAllTournamentsData } from "@/lib/services/copafacil.service";
import type { LandingSectionWithItems } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, saleItems, tournamentsData] = await Promise.all([
    getVisibleSections().catch(() => []),
    getActiveSaleItems().catch(() => []),
    getAllTournamentsData().catch(() => []),
  ]);

  return (
    <div>
      <HeroSection />
      <AboutSection />

      {(sections as LandingSectionWithItems[]).map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}

      <ChampionshipsSection tournamentsData={tournamentsData} />
      <StorePreview items={saleItems as any} />
    </div>
  );
}
