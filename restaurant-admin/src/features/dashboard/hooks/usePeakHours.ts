import { useQuery } from "@tanstack/react-query";
import { getPeakHours } from "../api/dashboard.api";

export function usePeakHours() {
  return useQuery({
    queryKey: ["dashboard", "peak-hours"],
    queryFn: getPeakHours,
    refetchInterval: 60000,
  });
}
