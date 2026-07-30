import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCategory } from "../api/category.api";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to delete category");
    },
  });
}
