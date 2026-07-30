import { useQuery } from "@tanstack/react-query";
import { getKitchenAnalytics } from "../api/analytics.api";
import type { AnalyticsRange } from "../types/analytics.types";

export function useKitchenAnalytics(range: AnalyticsRange) {
  return useQuery({
    queryKey: ["analytics", "kitchen", range],
    queryFn: () => getKitchenAnalytics(range),
  });
}
