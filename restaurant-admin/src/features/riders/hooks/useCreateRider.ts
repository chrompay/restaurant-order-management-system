import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRider } from "../api/rider.api";

export function useCreateRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      toast.success("Rider added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to add rider");
    },
  });
}
