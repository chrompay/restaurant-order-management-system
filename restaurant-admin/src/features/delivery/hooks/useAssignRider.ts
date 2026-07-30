import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignRider } from "@/features/orders/api/order.api";

export function useAssignRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, riderId }: { orderId: string; riderId: string }) =>
      assignRider(orderId, riderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Driver assigned");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to assign driver");
    },
  });
}
