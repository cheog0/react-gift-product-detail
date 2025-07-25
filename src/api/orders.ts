import { apiClient } from '@/lib/apiClient';
import type { GiftOrderForm } from '@/types';

export const ordersApi = {
  createOrder: (orderData: GiftOrderForm) => {
    return apiClient.post('/api/order', orderData);
  },
};
