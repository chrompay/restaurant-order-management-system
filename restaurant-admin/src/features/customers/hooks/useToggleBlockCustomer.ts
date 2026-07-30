import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleBlockCustomer } from "../api/customer.api";

export function useToggleBlockCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBlockCustomer,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update customer");
    },
  });
}
