import { apiClient } from '@/lib/apiClient';

export const authApi = {
  login: (credentials: { email: string; password: string }) => {
    return apiClient.post<{
      email: string;
      name: string;
      authToken: string;
    }>('/api/login', credentials);
  },
};
