import api from "@/services/api/axios";
import type {
  Order,
  OrdersListResponse,
  OrderResponse,
  GetOrdersParams,
  CreateOrderPayload,
  OrderStatus,
} from "../types/order.types";

export const getAllOrders = async (
  params: GetOrdersParams = {}
): Promise<OrdersListResponse> => {
  const response = await api.get<OrdersListResponse>("/orders/all-orders", {
    params,
  });
  return response.data;
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<OrderResponse> => {
  const response = await api.post<OrderResponse>("/orders", payload);
  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<OrderResponse> => {
  const response = await api.patch<OrderResponse>(`/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};

export const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  const response = await api.patch<OrderResponse>(`/orders/${orderId}/cancel`);
  return response.data;
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  await api.delete(`/orders/${orderId}`);
};

export const toggleOrderItem = async (
  orderId: string,
  itemId: string
): Promise<OrderResponse> => {
  const response = await api.patch<OrderResponse>(
    `/orders/${orderId}/items/${itemId}/toggle`
  );
  return response.data;
};

export const assignRider = async (
  orderId: string,
  riderId: string
): Promise<OrderResponse> => {
  const response = await api.patch<OrderResponse>(`/orders/${orderId}/assign-rider`, {
    riderId,
  });
  return response.data;
};

export type { Order };
