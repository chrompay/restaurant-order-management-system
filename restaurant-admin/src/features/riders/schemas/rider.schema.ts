import { z } from "zod";

export const riderSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  vehicleType: z.enum(["car", "bike", "scooter"]),
  status: z.enum(["available", "en_route", "returning", "offline"]),
});

export type RiderFormValues = z.infer<typeof riderSchema>;

export const riderLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type RiderLocationFormValues = z.infer<typeof riderLocationSchema>;
