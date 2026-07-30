import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateRider } from "../api/rider.api";
import type { RiderFormValues } from "../schemas/rider.schema";

export function useUpdateRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<RiderFormValues> }) =>
      updateRider(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Rider updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update rider");
    },
  });
}
