import {
  useSuspenseQuery,
  useSuspenseQueries,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type {
  GiftOrderForm,
  ProductWish,
  Product,
  ProductDetail,
  ProductReview,
} from '@/types';
import type {
  LoginRequest,
  LoginResponse,
  ThemeProductsResponse,
} from '@/types/api';
import * as api from '@/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useErrorStore } from '@/stores/errorStore';

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

  product: {
    key: (productId: string | number) => ['products', productId] as const,
    fn: (productId: string | number) => api.productsApi.getProduct(productId),
  },
  productDetail: {
    key: (productId: string | number) =>
      ['products', productId, 'detail'] as const,
    fn: (productId: string | number) =>
      api.productsApi.getProductDetail(productId),
  },
  productReviews: {
    key: (productId: string | number) =>
      ['products', productId, 'reviews'] as const,
    fn: (productId: string | number) =>
      api.productsApi.getProductReviews(productId),
  },
  productWish: {
    key: (productId: string | number) =>
      ['products', productId, 'wish'] as const,
    fn: (productId: string | number) =>
      api.productsApi.getProductWish(productId),
  },
  products: {
    key: ['products'] as const,
  },
} as const;

export function useSuspenseThemesQuery() {
  return useSuspenseQuery({
    queryKey: queries.themes.key,
    queryFn: queries.themes.fn,
  });
}

export function useSuspenseThemeInfoQuery(themeId: string | number) {
  return useSuspenseQuery({
    queryKey: queries.themeInfo.key(themeId),
    queryFn: () => queries.themeInfo.fn(themeId),
  });
}

export function useSuspenseThemeProductsQuery(themeId: string | number) {
  return useSuspenseQuery({
    queryKey: queries.themeProducts.key(themeId),
    queryFn: () => queries.themeProducts.fn(themeId),
  });
}

export function useSuspenseRankingProductsQuery(
  targetType: string,
  rankType: string
) {
  return useSuspenseQuery({
    queryKey: queries.rankingProducts.key(targetType, rankType),
    queryFn: () => queries.rankingProducts.fn(targetType, rankType),
  });
}

export function useSuspenseProductQuery(productId: string | number) {
  return useSuspenseQuery({
    queryKey: queries.product.key(productId),
    queryFn: () => queries.product.fn(productId),
  });
}

export function useSuspenseProductDetailQuery(productId: string | number) {
  return useSuspenseQuery({
    queryKey: queries.productDetail.key(productId),
    queryFn: () => queries.productDetail.fn(productId),
  });
}
export function useSuspenseProductReviewsQuery(productId: string | number) {
  return useSuspenseQuery({
    queryKey: queries.productReviews.key(productId),
    queryFn: () => queries.productReviews.fn(productId),
  });
}
export function useSuspenseProductWishQuery(productId: string | number) {
  return useSuspenseQuery({
    queryKey: queries.productWish.key(productId),
    queryFn: () => queries.productWish.fn(productId),
  });
}

export function useProductPageDataQuery(productId: string | number): {
  product: Product | null;
  productDetail: ProductDetail | null;
  reviewData: ProductReview | null;
  wishData: ProductWish | null;
} {
  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: queries.product.key(productId),
        queryFn: () => queries.product.fn(productId),
      },
      {
        queryKey: queries.productDetail.key(productId),
        queryFn: () => queries.productDetail.fn(productId),
      },
      {
        queryKey: queries.productReviews.key(productId),
        queryFn: () => queries.productReviews.fn(productId),
      },
      {
        queryKey: queries.productWish.key(productId),
        queryFn: () => queries.productWish.fn(productId),
      },
    ] as const,
  });

  const product = results[0].data;
  const productDetail = results[1].data;
  const reviewData = results[2].data;
  const wishData = results[3].data;

  return { product, productDetail, reviewData, wishData };
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
  const navigate = useNavigate();
  const setError = useErrorStore(state => state.setError);

  return useMutation({
    mutationFn: (orderData: GiftOrderForm) =>
      api.ordersApi.createOrder(orderData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queries.products.key });

      const totalQuantity = variables.receivers.reduce(
        (sum, r) => sum + r.quantity,
        0
      );

      alert(
        '주문이 완료되었습니다.' +
          '\n상품명: ' +
          variables.productId +
          '\n구매 수량: ' +
          totalQuantity +
          '\n발신자 이름: ' +
          variables.ordererName +
          '\n메시지: ' +
          variables.message
      );

      navigate('/');
    },
    onError: (error: any) => {
      const status = error?.status;

      if (status === 400) {
        toast.error('받는 사람이 없습니다');
      } else if (status === 401) {
        setError('로그인이 필요합니다.');
        sessionStorage.removeItem('userInfo');
        const currentPath = encodeURIComponent(window.location.pathname);
        navigate(`/login?redirect=${currentPath}`);
      } else {
        toast.error(error.message || '주문에 실패했습니다.');
      }
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
      await queryClient.cancelQueries({
        queryKey: queries.product.key(productId),
      });
      await queryClient.cancelQueries({
        queryKey: queries.productDetail.key(productId),
      });
      await queryClient.cancelQueries({
        queryKey: queries.productReviews.key(productId),
      });

      const previousWish = queryClient.getQueryData(
        queries.productWish.key(productId)
      ) as ProductWish | undefined;

      const previousProduct = queryClient.getQueryData(
        queries.product.key(productId)
      );
      const previousProductDetail = queryClient.getQueryData(
        queries.productDetail.key(productId)
      );
      const previousProductReviews = queryClient.getQueryData(
        queries.productReviews.key(productId)
      );

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

      // 개별 쿼리들을 업데이트하지 않고, wishData만 업데이트
      // useProductPageDataQuery에서 각 쿼리를 개별적으로 관리하므로
      // 여기서는 wishData 쿼리만 업데이트하면 됩니다

      return {
        previousWish,
        previousProduct,
        previousProductDetail,
        previousProductReviews,
      };
    },
    onError: (_err, mutationVariables, context) => {
      if (context?.previousWish) {
        const productId = mutationVariables.productId;
        queryClient.setQueryData(
          queries.productWish.key(productId),
          context.previousWish
        );
      }
      // 개별 쿼리들을 복원하는 대신, wishData만 복원
      // 다른 쿼리들은 서버에서 다시 가져오도록 함
    },
    onSettled: () => {},
  });
}
