import { useQuery } from "@tanstack/react-query";
import { getFoods } from "../api/food.api";
import type { GetFoodsParams } from "../types/food.types";

export function useFoods(params: GetFoodsParams) {
  return useQuery({
    queryKey: ["foods", params],
    queryFn: () => getFoods(params),
  });
}
