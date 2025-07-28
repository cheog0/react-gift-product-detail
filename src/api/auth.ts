import { apiClient } from '@/lib/apiClient';
import type { LoginRequest, LoginResponse } from '@/types/api';
import { AUTH_API } from '@/constants/endpoints';

export const authApi = {
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>(AUTH_API.LOGIN, credentials);
  },
};
