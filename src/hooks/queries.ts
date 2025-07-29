import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GiftOrderForm } from '@/types';
import * as api from '@/api';

export const queries = {
  themes: {
    key: ['themes'] as const,
    fn: () => api.themesApi.getThemes(),
  },
  themeInfo: {
    key: (themeId: string | number) => ['themes', themeId, 'info'] as const,
    fn: (themeId: string | number) => api.themesApi.getThemeInfo(themeId),
  },
  themeProducts: {
    key: (themeId: string | number) => ['themes', themeId, 'products'] as const,
    fn: (themeId: string | number) => api.themesApi.getThemeProducts(themeId),
  },
  rankingProducts: {
    key: (targetType: string, rankType: string) =>
      ['products', 'ranking', targetType, rankType] as const,
    fn: (targetType: string, rankType: string) =>
      api.productsApi.getRankingProducts(targetType, rankType),
  },
  productSummary: {
    key: (productId: string | number) =>
      ['products', productId, 'summary'] as const,
    fn: (productId: string | number) =>
      api.productsApi.getProductSummary(productId),
  },
  products: {
    key: ['products'] as const,
  },
} as const;

export function useThemesQuery() {
  return useQuery({
    queryKey: queries.themes.key,
    queryFn: queries.themes.fn,
  });
}

export function useThemeInfoQuery(themeId: string | number) {
  return useQuery({
    queryKey: queries.themeInfo.key(themeId),
    queryFn: () => queries.themeInfo.fn(themeId),
    enabled: !!themeId,
  });
}

export function useThemeProductsQuery(themeId: string | number) {
  return useQuery({
    queryKey: queries.themeProducts.key(themeId),
    queryFn: () => queries.themeProducts.fn(themeId),
    enabled: !!themeId,
  });
}

export function useRankingProductsQuery(targetType: string, rankType: string) {
  return useQuery({
    queryKey: queries.rankingProducts.key(targetType, rankType),
    queryFn: () => queries.rankingProducts.fn(targetType, rankType),
    enabled: !!targetType && !!rankType,
  });
}

export function useProductQuery(productId: string | number) {
  return useQuery({
    queryKey: queries.product.key(productId),
    queryFn: () => queries.product.fn(productId),
    enabled: !!productId,
  });
}

export function useProductDetailQuery(productId: string | number) {
  return useQuery({
    queryKey: queries.productDetail.key(productId),
    queryFn: () => queries.productDetail.fn(productId),
    enabled: !!productId,
  });
}
export function useProductReviewsQuery(productId: string | number) {
  return useQuery({
    queryKey: queries.productReviews.key(productId),
    queryFn: () => queries.productReviews.fn(productId),
    enabled: !!productId,
  });
}
export function useProductWishQuery(productId: string | number) {
  return useQuery({
    queryKey: queries.productSummary.key(productId),
    queryFn: () => queries.productSummary.fn(productId),
    enabled: !!productId,
  });
}

export function useThemeProductsInfiniteQuery(
  themeId: string | number,
  limit: number = 20
) {
  return useInfiniteQuery({
    queryKey: [...queries.themeProducts.key(themeId), 'infinite'],
    queryFn: ({ pageParam = 0 }) =>
      api.themesApi.getThemeProductsWithPagination(themeId, {
        cursor: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage: any, allPages) => {
      const currentCursor = allPages.length * limit;
      return lastPage.hasMoreList ? currentCursor : undefined;
    },
    initialPageParam: 0,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const data = await api.authApi.login(credentials);
      const { email, name, authToken } = data;
      return {
        authToken,
        user: {
          email,
          name,
        },
      };
    },
    onSuccess: data => {
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      queryClient.invalidateQueries();
    },
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: GiftOrderForm) =>
      api.ordersApi.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.products.key });
    },
    onSettled: () => {},
  });
}
