import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../api/order.api";
import type { GetOrdersParams } from "../types/order.types";

export function useOrders(params: GetOrdersParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getAllOrders(params),
  });
}
