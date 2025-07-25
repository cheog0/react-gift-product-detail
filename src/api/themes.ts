import { apiClient } from '@/lib/apiClient';
import type { GiftTheme, ThemeInfo } from '@/types';

export const themesApi = {
  getThemes: (): Promise<GiftTheme[]> => {
    return apiClient.get<GiftTheme[]>('/api/themes');
  },

  getThemeInfo: (themeId: string | number): Promise<ThemeInfo> => {
    return apiClient.get<ThemeInfo>(`/api/themes/${themeId}/info`);
  },

  getThemeProducts: (themeId: string | number) => {
    return apiClient.get(`/api/themes/${themeId}/products`);
  },

  getThemeProductsWithPagination: (
    themeId: string | number,
    params: { cursor: number; limit: number }
  ) => {
    const searchParams = new URLSearchParams({
      cursor: String(params.cursor),
      limit: String(params.limit),
    });
    return apiClient.get(`/api/themes/${themeId}/products?${searchParams}`);
  },
};
