import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateNotificationPreferences } from "../api/settings.api";

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "notifications"] });
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update notification preferences");
    },
  });
}
