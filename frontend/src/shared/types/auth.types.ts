export interface User {
  id:             string;
  email:          string;
  organizationId: string;
  organization:   Organization;
  createdAt:      string;
}

export interface Organization {
  id:                      string;
  name:                    string;
  defaultLowStockThreshold: number;
}

export interface AuthState {
  user:          User | null;
  isAuthenticated: boolean;
  isLoading:     boolean;
}