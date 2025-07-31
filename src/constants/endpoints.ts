export const PRODUCT_API = {
  RANKING: '/api/products/ranking',
  DETAIL: (productId: string | number) => `/api/products/${productId}`,
  PRODUCT_DETAIL: (productId: string | number) =>
    `/api/products/${productId}/detail`,
  PRODUCT_REVIEWS: (productId: string | number) =>
    `/api/products/${productId}/highlight-review`,
  PRODUCT_WISH: (productId: string | number) =>
    `/api/products/${productId}/wish`,
};

export const AUTH_API = {
  LOGIN: '/api/login',
};

export const THEME_API = {
  THEMES: '/api/themes',
  THEME_INFO: (themeId: string | number) => `/api/themes/${themeId}/info`,
  THEME_PRODUCTS: (themeId: string | number) =>
    `/api/themes/${themeId}/products`,
};

export const ORDER_API = {
  CREATE_ORDER: '/api/order',
};

export const Path = {
  THEME: '/themes/:themeId',
};
