export type SectionLayout = "CAROUSEL" | "GRID" | "HIGHLIGHT" | "BANNER" | "TEXT";
export type SectionStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface SectionConfig {
  columns?: number;
  rows?: number;
  itemsPerSlide?: number;
  autoplayDelay?: number;
  [key: string]: unknown;
}

export interface LandingSection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  layout: SectionLayout;
  status: SectionStatus;
  config: SectionConfig | null;
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
