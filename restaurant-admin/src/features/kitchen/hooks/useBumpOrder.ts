import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleOrderItem, updateOrderStatus } from "@/features/orders/api/order.api";
import type { Order } from "@/features/orders/types/order.types";
import { getNextStatus } from "../lib/statusFlow";

// Bumping a ticket means "everything on it is done" — so it marks any
// still-incomplete items complete, then advances the order one step.
export function useBumpOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Order) => {
      const nextStatus = getNextStatus(order.status);

      if (!nextStatus) {
        throw new Error("This order can't be advanced any further");
      }

      const incompleteItems = order.items.filter((item) => !item.completed);

      await Promise.all(
        incompleteItems.map((item) => toggleOrderItem(order._id, item._id))
      );

      return updateOrderStatus(order._id, nextStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order bumped");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Failed to bump order");
    },
  });
}
