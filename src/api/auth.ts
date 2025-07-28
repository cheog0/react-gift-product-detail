import { apiClient } from '@/lib/apiClient';
import type { LoginRequest, LoginResponse } from '@/types/api';

export const authApi = {
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/login', credentials);
  },
};
