import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateRiderLocation } from "../api/rider.api";
import type { RiderLocationFormValues } from "../schemas/rider.schema";

export function useUpdateRiderLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: RiderLocationFormValues }) =>
      updateRiderLocation(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Rider location updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update rider location");
    },
  });
}
