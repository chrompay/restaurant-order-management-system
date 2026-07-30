import { useQuery } from "@tanstack/react-query";
import { getRestaurantSettings } from "../api/settings.api";

export function useRestaurantSettings() {
  return useQuery({
    queryKey: ["settings", "restaurant"],
    queryFn: getRestaurantSettings,
  });
}
