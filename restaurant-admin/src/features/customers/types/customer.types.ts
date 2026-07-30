export type CustomerTier = "VIP" | "Regular" | "New";

export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
  tier: CustomerTier;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteFood {
  name: string;
  orders: number;
}

export interface CustomerOrderSummary {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
}

export interface CustomerDetail extends Customer {
  favoriteFoods: FavoriteFood[];
  orderHistory: CustomerOrderSummary[];
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

export interface CustomersListResponse {
  success: boolean;
  message: string;
  data: Customer[];
  meta: PaginationMeta;
}

export interface CustomerDetailResponse {
  success: boolean;
  message: string;
  data: CustomerDetail;
}

export interface BlockCustomerResponse {
  success: boolean;
  message: string;
  data: { _id: string; isActive: boolean };
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
}
