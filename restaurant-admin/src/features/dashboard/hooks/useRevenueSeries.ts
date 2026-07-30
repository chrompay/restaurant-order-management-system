import { useQuery } from "@tanstack/react-query";
import { getRevenueSeries } from "../api/dashboard.api";

export function useRevenueSeries() {
  return useQuery({
    queryKey: ["dashboard", "revenue-series"],
    queryFn: getRevenueSeries,
    refetchInterval: 60000,
  });
}
