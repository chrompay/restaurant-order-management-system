import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { inviteTeamMember } from "../api/settings.api";

export function useInviteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteTeamMember,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "team"] });
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to invite team member");
    },
  });
}
