import client from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api.types';
import type { Settings, UpdateSettingsPayload } from '../../../shared/types/settings.types';

export const settingsApi = {
  get:    () => client.get<ApiResponse<Settings>>('/settings').then(r => r.data.data),
  update: (data: UpdateSettingsPayload) =>
    client.put<ApiResponse<Settings>>('/settings', data).then(r => r.data.data),
};