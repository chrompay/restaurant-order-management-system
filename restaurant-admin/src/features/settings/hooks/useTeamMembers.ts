import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "../api/settings.api";

export function useTeamMembers() {
  return useQuery({
    queryKey: ["settings", "team"],
    queryFn: getTeamMembers,
  });
}
