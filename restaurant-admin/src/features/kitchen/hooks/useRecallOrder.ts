import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateOrderStatus } from "@/features/orders/api/order.api";
import type { Order } from "@/features/orders/types/order.types";
import { getPreviousStatus } from "../lib/statusFlow";

// Steps a previously-bumped order back one status, e.g. to undo a mistaken bump.
export function useRecallOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: Order) => {
      const previousStatus = getPreviousStatus(order.status);

      if (!previousStatus) {
        throw new Error("This order can't be recalled any further");
      }

      return updateOrderStatus(order._id, previousStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order recalled");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Failed to recall order");
    },
  });
}
