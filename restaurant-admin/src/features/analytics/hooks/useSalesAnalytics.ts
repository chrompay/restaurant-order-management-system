import { useQuery } from "@tanstack/react-query";
import { getSalesAnalytics } from "../api/analytics.api";
import type { AnalyticsRange } from "../types/analytics.types";

export function useSalesAnalytics(range: AnalyticsRange) {
  return useQuery({
    queryKey: ["analytics", "sales", range],
    queryFn: () => getSalesAnalytics(range),
  });
}
