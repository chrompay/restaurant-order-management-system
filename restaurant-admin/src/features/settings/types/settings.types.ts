export type BusinessDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface BusinessHour {
  day: BusinessDay;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface RestaurantSettings {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  businessHours: BusinessHour[];
  targetPrepTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  _id: string;
  user: string;
  newOrders: boolean;
  cancellations: boolean;
  dailySummary: boolean;
  productUpdates: boolean;
}

export type TeamRole = "admin" | "manager" | "kitchen";

export interface TeamMember {
  _id: string;
  fullName: string;
  email: string;
  role: TeamRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface RestaurantSettingsResponse {
  success: boolean;
  message: string;
  data: RestaurantSettings;
}

export interface NotificationPreferenceResponse {
  success: boolean;
  message: string;
  data: NotificationPreference;
}

export interface TeamMembersResponse {
  success: boolean;
  message: string;
  data: TeamMember[];
}

export interface InviteTeamMemberPayload {
  fullName: string;
  email: string;
  password: string;
  role: TeamRole;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: File | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
