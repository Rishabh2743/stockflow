export interface Product {
  id:                string;
  organizationId:    string;
  name:              string;
  sku:               string;
  description?:      string;
  quantityOnHand:    number;
  costPrice?:        number;
  sellingPrice?:     number;
  lowStockThreshold?: number;
  createdAt:         string;
  updatedAt:         string;
}

export interface CreateProductPayload {
  name:               string;
  sku:                string;
  description?:       string;
  quantityOnHand?:    number;
  costPrice?:         number;
  sellingPrice?:      number;
  lowStockThreshold?: number;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface AdjustStockPayload {
  adjustment: number;
  note?:      string;
}

export interface ProductFilters {
  search?: string;
  page?:   number;
  limit?:  number;
}