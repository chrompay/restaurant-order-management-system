import { z } from "zod";

export const restaurantProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.union([z.string().trim().email("Enter a valid email"), z.literal("")]),
  phone: z.string().trim(),
  address: z.string().trim(),
});
export type RestaurantProfileFormValues = z.infer<typeof restaurantProfileSchema>;

export const myAccountSchema = z.object({
  fullName: z.string().trim().min(3, "Name must be at least 3 characters").max(50),
  phone: z.string().trim(),
  address: z.string().trim(),
  avatar: z.instanceof(File).optional().nullable(),
});
export type MyAccountFormValues = z.infer<typeof myAccountSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const inviteTeamMemberSchema = z.object({
  fullName: z.string().trim().min(3, "Name must be at least 3 characters").max(50),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "manager", "kitchen"]),
});
export type InviteTeamMemberFormValues = z.infer<typeof inviteTeamMemberSchema>;
