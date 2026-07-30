import api from "@/services/api/axios";
import type { User } from "@/features/auth/types/auth.types";
import type {
  RestaurantSettings,
  RestaurantSettingsResponse,
  NotificationPreference,
  NotificationPreferenceResponse,
  TeamMembersResponse,
  TeamMember,
  TeamRole,
  InviteTeamMemberPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
  MessageResponse,
} from "../types/settings.types";

export const getRestaurantSettings = async (): Promise<RestaurantSettingsResponse> => {
  const response = await api.get<RestaurantSettingsResponse>("/settings/restaurant");
  return response.data;
};

export const updateRestaurantSettings = async (
  values: Partial<Omit<RestaurantSettings, "_id" | "createdAt" | "updatedAt">>
): Promise<RestaurantSettingsResponse> => {
  const response = await api.patch<RestaurantSettingsResponse>("/settings/restaurant", values);
  return response.data;
};

export const getNotificationPreferences = async (): Promise<NotificationPreferenceResponse> => {
  const response = await api.get<NotificationPreferenceResponse>("/settings/notifications");
  return response.data;
};

export const updateNotificationPreferences = async (
  values: Partial<Pick<NotificationPreference, "newOrders" | "cancellations" | "dailySummary" | "productUpdates">>
): Promise<NotificationPreferenceResponse> => {
  const response = await api.patch<NotificationPreferenceResponse>("/settings/notifications", values);
  return response.data;
};

export const getTeamMembers = async (): Promise<TeamMembersResponse> => {
  const response = await api.get<TeamMembersResponse>("/users/team");
  return response.data;
};

export const inviteTeamMember = async (
  payload: InviteTeamMemberPayload
): Promise<{ success: boolean; message: string; data: TeamMember }> => {
  const response = await api.post("/users/team", payload);
  return response.data;
};

export const updateUserRole = async (id: string, role: TeamRole): Promise<MessageResponse> => {
  const response = await api.patch(`/users/team/${id}/role`, { role });
  return response.data;
};

export const removeTeamMember = async (id: string): Promise<MessageResponse> => {
  const response = await api.delete(`/users/team/${id}`);
  return response.data;
};

// The shared axios instance defaults to Content-Type: application/json.
// Unset it per-request for FormData bodies so the browser can set the
// correct multipart boundary (same gotcha as the Foods image upload).
const multipartConfig = {
  headers: { "Content-Type": undefined },
};

export const updateProfile = async (
  values: UpdateProfilePayload
): Promise<{ success: boolean; message: string; data: User }> => {
  const formData = new FormData();

  if (values.fullName !== undefined) formData.append("fullName", values.fullName);
  if (values.phone !== undefined) formData.append("phone", values.phone);
  if (values.address !== undefined) formData.append("address", values.address);
  if (values.avatar) formData.append("avatar", values.avatar);

  const response = await api.patch("/auth/profile", formData, multipartConfig);
  return response.data;
};

export const changePassword = async (values: ChangePasswordPayload): Promise<MessageResponse> => {
  const response = await api.patch("/auth/change-password", values);
  return response.data;
};
