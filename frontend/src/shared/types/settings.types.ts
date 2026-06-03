export interface Settings {
  id:                      string;
  name:                    string;
  defaultLowStockThreshold: number;
  createdAt:               string;
}

export interface UpdateSettingsPayload {
  defaultLowStockThreshold: number;
}