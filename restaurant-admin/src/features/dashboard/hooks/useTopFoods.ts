import { useQuery } from "@tanstack/react-query";
import { getTopFoods } from "../api/dashboard.api";

export function useTopFoods() {
  return useQuery({
    queryKey: ["dashboard", "top-foods"],
    queryFn: getTopFoods,
    refetchInterval: 60000,
  });
}
