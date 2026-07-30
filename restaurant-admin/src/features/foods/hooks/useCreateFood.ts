import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFood } from "../api/food.api";

export function useCreateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast.success("Food created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create food");
    },
  });
}
