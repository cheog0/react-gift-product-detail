import { apiClient } from '@/lib/apiClient';
import type {
  GiftTheme,
  ThemeInfo,
  Product,
  ThemeProductsResponse,
} from '@/types';

export const themesApi = {
  getThemes: (): Promise<GiftTheme[]> => {
    return apiClient.get<GiftTheme[]>('/api/themes');
  },

  getThemeInfo: (themeId: string | number): Promise<ThemeInfo> => {
    return apiClient.get<ThemeInfo>(`/api/themes/${themeId}/info`);
  },

  getThemeProducts: (themeId: string | number): Promise<Product[]> => {
    return apiClient.get<Product[]>(`/api/themes/${themeId}/products`);
  },

  getThemeProductsWithPagination: (
    themeId: string | number,
    params: { cursor: number; limit: number }
  ): Promise<ThemeProductsResponse> => {
    const searchParams = new URLSearchParams({
      cursor: String(params.cursor),
      limit: String(params.limit),
    });
    return apiClient.get<ThemeProductsResponse>(
      `/api/themes/${themeId}/products?${searchParams}`
    );
  },
};
