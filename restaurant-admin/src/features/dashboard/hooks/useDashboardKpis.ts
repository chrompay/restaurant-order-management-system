import { useQuery } from "@tanstack/react-query";
import { getKpis } from "../api/dashboard.api";

export function useDashboardKpis() {
  return useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: getKpis,
    refetchInterval: 30000,
  });
}
