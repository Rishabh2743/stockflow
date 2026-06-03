export interface DashboardSummary {
  totalProducts:       number;
  totalUnits:          number;
  totalInventoryValue: number;
  lowStockCount:       number;
  lowStockItems:       LowStockItem[];
}

export interface LowStockItem {
  id:                string;
  name:              string;
  sku:               string;
  quantityOnHand:    number;
  lowStockThreshold: number;
}