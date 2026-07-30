import { useQuery } from "@tanstack/react-query";
import { getRiders } from "../api/rider.api";
import type { GetRidersParams } from "../types/rider.types";

export function useRiders(params: GetRidersParams = { limit: 100 }) {
  return useQuery({
    queryKey: ["riders", params],
    queryFn: () => getRiders(params),
  });
}
