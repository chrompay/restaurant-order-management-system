import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateFood } from "../api/food.api";
import type { FoodFormValues } from "../schemas/food.schema";

export function useUpdateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: FoodFormValues }) =>
      updateFood(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast.success("Food updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update food");
    },
  });
}
