import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GiftOrderForm, ProductWish } from '@/types';
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
    queryFn: async () => {
      const product = await queries.product.fn(productId);
      if (!product) {
        throw new Error('존재하지 않는 상품입니다');
      }
      return product;
    },
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

export function useProductPageDataQuery(productId: string | number) {
  return useSuspenseQuery({
    queryKey: ['productPage', productId],
    queryFn: async () => {
      const [product, productDetail, reviewData, wishData] = await Promise.all([
        queries.product.fn(productId),
        queries.productDetail.fn(productId),
        queries.productReviews.fn(productId),
        queries.productWish.fn(productId),
      ]);

      if (!product) {
        throw new Error('존재하지 않는 상품입니다');
      }

      return {
        product,
        productDetail,
        reviewData,
        wishData,
      };
    },
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
        queryKey: ['productPage', productId],
      });

      const previousWish = queryClient.getQueryData(
        queries.productWish.key(productId)
      ) as ProductWish | undefined;

      const previousProductPage = queryClient.getQueryData([
        'productPage',
        productId,
      ]);

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

      queryClient.setQueryData(['productPage', productId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          wishData: {
            ...old.wishData,
            isWished: !isWished,
            wishCount: isWished
              ? (old.wishData?.wishCount || 0) - 1
              : (old.wishData?.wishCount || 0) + 1,
          },
        };
      });

      return { previousWish, previousProductPage };
    },
    onError: (_err, mutationVariables, context) => {
      if (context?.previousWish) {
        const productId = mutationVariables.productId;
        queryClient.setQueryData(
          queries.productWish.key(productId),
          context.previousWish
        );
      }
      if (context?.previousProductPage) {
        const productId = mutationVariables.productId;
        queryClient.setQueryData(
          ['productPage', productId],
          context.previousProductPage
        );
      }
    },
    onSettled: () => {},
  });
}
