export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Order {
  id: string;
  saleItemId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: OrderStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderValue {
  id: string;
  orderId: string;
  fieldId: string;
  value: string;
}

export interface OrderWithValues extends Order {
  values: OrderValue[];
  saleItemName: string;
}

export interface OrderExportRow {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: OrderStatus;
  createdAt: Date;
  [fieldLabel: string]: unknown;
}
