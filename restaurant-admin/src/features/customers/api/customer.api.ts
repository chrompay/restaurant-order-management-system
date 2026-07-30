import api from "@/services/api/axios";
import type {
  Customer,
  CustomersListResponse,
  CustomerDetailResponse,
  BlockCustomerResponse,
  GetCustomersParams,
} from "../types/customer.types";

export const getCustomers = async (
  params: GetCustomersParams = {}
): Promise<CustomersListResponse> => {
  const response = await api.get<CustomersListResponse>("/users", { params });
  return response.data;
};

export const getCustomer = async (id: string): Promise<CustomerDetailResponse> => {
  const response = await api.get<CustomerDetailResponse>(`/users/${id}`);
  return response.data;
};

export const toggleBlockCustomer = async (id: string): Promise<BlockCustomerResponse> => {
  const response = await api.patch<BlockCustomerResponse>(`/users/${id}/block`);
  return response.data;
};

export type { Customer };
