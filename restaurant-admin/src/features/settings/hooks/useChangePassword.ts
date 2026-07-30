import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword } from "../api/settings.api";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update password");
    },
  });
}
