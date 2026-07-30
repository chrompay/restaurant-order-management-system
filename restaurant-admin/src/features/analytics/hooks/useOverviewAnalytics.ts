import { useQuery } from "@tanstack/react-query";
import { getOverviewAnalytics } from "../api/analytics.api";
import type { AnalyticsRange } from "../types/analytics.types";

export function useOverviewAnalytics(range: AnalyticsRange) {
  return useQuery({
    queryKey: ["analytics", "overview", range],
    queryFn: () => getOverviewAnalytics(range),
  });
}
