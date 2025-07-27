import { apiClient } from '@/lib/apiClient';
import type {
  Product,
  ProductDetail,
  ProductReview,
  ProductWish,
} from '@/types';

export const productsApi = {
  getRankingProducts: (
    targetType: string,
    rankType: string
  ): Promise<Product[]> => {
    const params = new URLSearchParams({ targetType, rankType });
    return apiClient.get<Product[]>(`/api/products/ranking?${params}`);
  },

  getProductSummary: (productId: string | number): Promise<Product> => {
    return apiClient.get<Product>(`/api/products/${productId}/summary`);
  },
  getProduct: (productId: string | number): Promise<Product> => {
    return apiClient.get<Product>(`/api/products/${productId}`);
  },
  getProductDetail: (productId: string | number): Promise<ProductDetail> => {
    return apiClient.get<ProductDetail>(`/api/products/${productId}/detail`);
  },
  getProductReviews: (productId: string | number): Promise<ProductReview> => {
    return apiClient.get<ProductReview>(
      `/api/products/${productId}/highlight-review`
    );
  },
  getProductWish: (productId: string | number): Promise<ProductWish> => {
    return apiClient.get<ProductWish>(`/api/products/${productId}/wish`);
  },

  addToWishlist: (
    productId: string | number
  ): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(
      `/api/products/${productId}/wish`,
      {}
    );
  },

  removeFromWishlist: (
    productId: string | number
  ): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(
      `/api/products/${productId}/wish`
    );
  },
};
