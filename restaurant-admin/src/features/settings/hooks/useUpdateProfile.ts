import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfile } from "../api/settings.api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useUpdateProfile() {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      updateUser(response.data);
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update profile");
    },
  });
}
