import { useQuery } from "@tanstack/react-query";
import { getPrepTimeSeries } from "../api/dashboard.api";

export function usePrepTimeSeries() {
  return useQuery({
    queryKey: ["dashboard", "prep-time-series"],
    queryFn: getPrepTimeSeries,
    refetchInterval: 60000,
  });
}
