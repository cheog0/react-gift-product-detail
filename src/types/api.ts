import type { Product } from './product';

export interface PaginatedResponse<T> {
  list: T[];
  hasMoreList: boolean;
  nextCursor?: number;
}

export type ThemeProductsResponse = PaginatedResponse<Product>;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  name: string;
  authToken: string;
}
