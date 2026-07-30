import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeTeamMember } from "../api/settings.api";

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTeamMember,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "team"] });
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to remove team member");
    },
  });
}
