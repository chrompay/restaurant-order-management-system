import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateRestaurantSettings } from "../api/settings.api";

export function useUpdateRestaurantSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRestaurantSettings,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "restaurant"] });
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update restaurant settings");
    },
  });
}
