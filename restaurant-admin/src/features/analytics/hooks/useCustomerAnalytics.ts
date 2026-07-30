import { useQuery } from "@tanstack/react-query";
import { getCustomersAnalytics } from "../api/analytics.api";
import type { AnalyticsRange } from "../types/analytics.types";

export function useCustomerAnalytics(range: AnalyticsRange) {
  return useQuery({
    queryKey: ["analytics", "customers", range],
    queryFn: () => getCustomersAnalytics(range),
  });
}
