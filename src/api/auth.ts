import { apiClient } from '@/lib/apiClient';

export const authApi = {
  login: (credentials: { email: string; password: string }) => {
    return apiClient.post<{
      authToken: string;
      user: { id: number; email: string; name: string };
    }>('/api/login', credentials);
  },
};
