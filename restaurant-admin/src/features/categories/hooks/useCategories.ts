import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/category.api";
import type { GetCategoriesParams } from "../types/category.types";

export function useCategories(params: GetCategoriesParams = { limit: 100 }) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });
}
