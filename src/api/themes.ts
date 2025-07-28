import { apiClient } from '@/lib/apiClient';
import type {
  GiftTheme,
  ThemeInfo,
  Product,
  ThemeProductsResponse,
} from '@/types';
import { THEME_API } from '@/constants/endpoints';

export const themesApi = {
  getThemes: (): Promise<GiftTheme[]> => {
    return apiClient.get<GiftTheme[]>(THEME_API.THEMES);
  },

  getThemeInfo: (themeId: string | number): Promise<ThemeInfo> => {
    return apiClient.get<ThemeInfo>(THEME_API.THEME_INFO(themeId));
  },

  getThemeProducts: (themeId: string | number): Promise<Product[]> => {
    return apiClient.get<Product[]>(THEME_API.THEME_PRODUCTS(themeId));
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
      `${THEME_API.THEME_PRODUCTS(themeId)}?${searchParams}`
    );
  },
};
