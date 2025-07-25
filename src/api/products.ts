import { apiClient } from '@/lib/apiClient';
import type { Product } from '@/types';

export const productsApi = {
  getRankingProducts: (
    targetType: string,
    rankType: string
  ): Promise<Product[]> => {
    const params = new URLSearchParams({ targetType, rankType });
    return apiClient.get<Product[]>(`/api/products/ranking?${params}`);
  },

  getProductSummary: (productId: string | number) => {
    return apiClient.get<Product>(`/api/products/${productId}/summary`);
  },
};
