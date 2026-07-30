import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteFood } from "../api/food.api";

export function useDeleteFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast.success("Food deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to delete food");
    },
  });
}
