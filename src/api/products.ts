import { apiClient } from '@/lib/apiClient';
import type {
  Product,
  ProductDetail,
  ProductReview,
  ProductWish,
} from '@/types';
import { PRODUCT_API } from '@/constants/endpoints';

export const productsApi = {
  getRankingProducts: (
    targetType: string,
    rankType: string
  ): Promise<Product[]> => {
    const params = new URLSearchParams({ targetType, rankType });
    return apiClient.get<Product[]>(`${PRODUCT_API.RANKING}?${params}`);
  },

  getProduct: (productId: string | number): Promise<Product> => {
    return apiClient.get<Product>(PRODUCT_API.DETAIL(productId));
  },
  getProductDetail: (productId: string | number): Promise<ProductDetail> => {
    return apiClient.get<ProductDetail>(PRODUCT_API.PRODUCT_DETAIL(productId));
  },
  getProductReviews: (productId: string | number): Promise<ProductReview> => {
    return apiClient.get<ProductReview>(PRODUCT_API.PRODUCT_REVIEWS(productId));
  },
  getProductWish: (productId: string | number): Promise<ProductWish> => {
    return apiClient.get<ProductWish>(PRODUCT_API.PRODUCT_WISH(productId));
  },

  addToWishlist: (
    productId: string | number
  ): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(
      PRODUCT_API.PRODUCT_WISH(productId),
      {}
    );
  },

  removeFromWishlist: (
    productId: string | number
  ): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(
      PRODUCT_API.PRODUCT_WISH(productId)
    );
  },
};
