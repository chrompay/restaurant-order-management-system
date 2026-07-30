import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserRole } from "../api/settings.api";
import type { TeamRole } from "../types/settings.types";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: TeamRole }) => updateUserRole(id, role),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["settings", "team"] });
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update role");
    },
  });
}
