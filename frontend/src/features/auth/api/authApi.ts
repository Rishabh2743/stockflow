import client from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types/api.types';
import type { User } from '../../../shared/types/auth.types';

interface SignupPayload { email: string; password: string; organizationName: string; }
interface LoginPayload  { email: string; password: string; }

export const authApi = {
  signup: (data: SignupPayload) =>
    client.post<ApiResponse<{ user: User }>>('/auth/signup', data).then(r => r.data),

  login: (data: LoginPayload) =>
    client.post<ApiResponse<{ user: User }>>('/auth/login', data).then(r => r.data),

  logout: () =>
    client.post<ApiResponse<null>>('/auth/logout').then(r => r.data),

  me: () =>
    client.get<ApiResponse<{ user: User }>>('/auth/me').then(r => r.data),
};

// Named exports for direct imports
export const logout = authApi.logout;