import { apiClient } from '@/lib/apiClient';
import type { GiftOrderForm } from '@/types';
import { ORDER_API } from '@/constants/endpoints';

export const ordersApi = {
  createOrder: (orderData: GiftOrderForm) => {
    return apiClient.post(ORDER_API.CREATE_ORDER, orderData);
  },
};
