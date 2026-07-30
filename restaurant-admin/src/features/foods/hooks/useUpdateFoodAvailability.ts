import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateFoodAvailability } from "../api/food.api";

export function useUpdateFoodAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, availability }: { id: string; availability: boolean }) =>
      updateFoodAvailability(id, availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update availability");
    },
  });
}
