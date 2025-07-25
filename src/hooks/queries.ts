import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import type { GiftOrderForm } from '@/types';

export const queries = {
  themes: {
    key: ['themes'] as const,
    fn: () => apiService.getThemes(),
  },
  themeInfo: {
    key: (themeId: string | number) => ['themes', themeId, 'info'] as const,
    fn: (themeId: string | number) => apiService.getThemeInfo(themeId),
  },
  themeProducts: {
    key: (themeId: string | number) => ['themes', themeId, 'products'] as const,
    fn: (themeId: string | number) => apiService.getThemeProducts(themeId),
  },
  rankingProducts: {
    key: (targetType: string, rankType: string) =>
      ['products', 'ranking', targetType, rankType] as const,
    fn: (targetType: string, rankType: string) =>
      apiService.getRankingProducts(targetType, rankType),
  },
  productSummary: {
    key: (productId: string | number) =>
      ['products', productId, 'summary'] as const,
    fn: (productId: string | number) => apiService.getProductSummary(productId),
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
    getNextPageParam: (
      lastPage: ThemeProductsResponse,
      allPages: ThemeProductsResponse[]
    ) => {
      const currentCursor = allPages.length * limit;
      return lastPage.hasMoreList ? currentCursor : undefined;
    },
    initialPageParam: 0,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      credentials: LoginRequest
    ): Promise<{
      authToken: string;
      user: { email: string; name: string };
    }> => {
      const data: LoginResponse = await api.authApi.login(credentials);
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
  });
}

export function useToggleWishMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId: _productId,
      isWished: _isWished,
    }: {
      productId: number;
      isWished: boolean;
    }) => {
      return { success: true };
    },
    onMutate: async ({ productId, isWished }) => {
      await queryClient.cancelQueries({
        queryKey: queries.productWish.key(productId),
      });
      const previousWish = queryClient.getQueryData(
        queries.productWish.key(productId)
      ) as ProductWish | undefined;

      queryClient.setQueryData(
        queries.productWish.key(productId),
        (old: ProductWish | undefined) => {
          if (!old) return { wishCount: 0, isWished: false };
          const newData = {
            ...old,
            isWished: !isWished,
            wishCount: isWished ? old.wishCount - 1 : old.wishCount + 1,
          };
          return newData;
        }
      );

      return { previousWish };
    },
    onError: (_err, mutationVariables, context) => {
      if (context?.previousWish) {
        const productId = mutationVariables.productId;
        queryClient.setQueryData(
          queries.productWish.key(productId),
          context.previousWish
        );
      }
    },
    onSettled: () => {},
  });
}
