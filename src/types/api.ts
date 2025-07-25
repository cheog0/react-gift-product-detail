import type { Product } from './product';

export interface PaginatedResponse<T> {
  data: T[];
  hasMoreList: boolean;
  nextCursor?: number;
}

export type ThemeProductsResponse = PaginatedResponse<Product>;
