export type FieldType =
  | "TEXT"
  | "NUMBER"
  | "SELECT"
  | "CHECKBOX"
  | "TEXTAREA"
  | "EMAIL"
  | "PHONE"
  | "SIZE";

export interface SaleItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  estimatedDelivery: string | null;
  notificationEmail: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItemImage {
  id: string;
  saleItemId: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface SaleItemFieldOption {
  id: string;
  fieldId: string;
  label: string;
  value: string;
  order: number;
}

export interface SaleItemField {
  id: string;
  saleItemId: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string | null;
  order: number;
  createdAt: Date;
  options: SaleItemFieldOption[];
}

export interface SaleItemComplete extends SaleItem {
  images: SaleItemImage[];
  fields: SaleItemField[];
}
