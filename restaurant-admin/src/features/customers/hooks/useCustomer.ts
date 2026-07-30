import { useQuery } from "@tanstack/react-query";
import { getCustomer } from "../api/customer.api";

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => getCustomer(id as string),
    enabled: !!id,
  });
}
