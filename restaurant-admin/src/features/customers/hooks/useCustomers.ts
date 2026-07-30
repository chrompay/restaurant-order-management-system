import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../api/customer.api";
import type { GetCustomersParams } from "../types/customer.types";

export function useCustomers(params: GetCustomersParams = {}) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),
  });
}
