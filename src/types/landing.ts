export type SectionLayout = "CAROUSEL" | "GRID" | "HIGHLIGHT" | "BANNER" | "TEXT";

export interface LandingSection {
  id: string;
  title: string;
  slug: string;
  layout: SectionLayout;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LandingItem {
  id: string;
  sectionId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  saleItemId: string | null;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LandingSectionWithItems extends LandingSection {
  items: LandingItem[];
}
