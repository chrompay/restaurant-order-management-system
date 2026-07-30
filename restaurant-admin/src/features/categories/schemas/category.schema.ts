import { z } from "zod";

export const CATEGORY_ICONS = [
  "utensils-crossed",
  "beef",
  "salad",
  "coffee",
  "cake",
  "pizza",
  "sandwich",
  "tag",
] as const;

export const categorySchema = z.object({
  categoryName: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  icon: z.enum(CATEGORY_ICONS),
  status: z.enum(["Active", "Draft"]),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
export type CategoryIcon = (typeof CATEGORY_ICONS)[number];
