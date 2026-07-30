import { useQuery } from "@tanstack/react-query";
import { getNotificationPreferences } from "../api/settings.api";

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ["settings", "notifications"],
    queryFn: getNotificationPreferences,
  });
}
