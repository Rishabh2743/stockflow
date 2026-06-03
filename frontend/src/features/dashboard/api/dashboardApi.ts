import client from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api.types';
import type { DashboardSummary } from '../../../shared/types/dashboard.types';

export const dashboardApi = {
  getSummary: () =>
    client.get<ApiResponse<DashboardSummary>>('/dashboard').then(r => r.data.data),
};