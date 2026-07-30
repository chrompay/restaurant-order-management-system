import type { Rider } from "@/features/riders/types/rider.types";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Out For Delivery"
  | "Delivered"
  | "Cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

export type FoodStation =
  | "Bakery"
  | "Beverages"
  | "Breakfast"
  | "Fryer"
  | "Grill"
  | "Legumes & Pots"
  | "Pepper Soup"
  | "Protein Prep"
  | "Rice & Grains"
  | "Swallow & Soup";

export interface OrderCustomerRef {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface OrderFoodRef {
  _id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  _id: string;
  food: OrderFoodRef | string;
  foodName: string;
  priceAtPurchase: number;
  quantity: number;
  station?: FoodStation;
  notes?: string;
  completed: boolean;
}

export interface Order {
  _id: string;
  customer: OrderCustomerRef | string;
  items: OrderItem[];
  totalAmount: number;
  assignedRider?: Rider | string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  count: number;
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: Order[];
  meta: PaginationMeta;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  from?: string;
  to?: string;
  sort?: string;
}

export interface CreateOrderItemInput {
  food: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderPayload {
  items: CreateOrderItemInput[];
  customerId?: string;
}
