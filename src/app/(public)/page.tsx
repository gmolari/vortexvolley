import { HeroSection, AboutSection, StorePreview, DynamicSection } from "@/components/landing";
import { getVisibleSections } from "@/lib/services/landing.service";
import { getActiveSaleItems } from "@/lib/services/sale-item.service";
import type { LandingSectionWithItems } from "@/types";

// CopFacil integration ready but disabled — API doesn't list tournaments automatically
// import { ChampionshipsSection } from "@/components/landing";
// import { getAllTournamentsData } from "@/lib/services/copafacil.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, saleItems] = await Promise.all([
    getVisibleSections().catch(() => []),
    getActiveSaleItems().catch(() => []),
  ]);

  return (
    <div>
      <HeroSection />
      <AboutSection />

      {(sections as LandingSectionWithItems[]).map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}

      {/* <ChampionshipsSection tournamentsData={tournamentsData} /> */}
      <StorePreview items={saleItems as any} />
    </div>
  );
}
