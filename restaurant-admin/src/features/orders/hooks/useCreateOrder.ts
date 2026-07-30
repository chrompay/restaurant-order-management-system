import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createOrder } from "../api/order.api";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create order");
    },
  });
}
