import { z } from "zod";

export const createOrderSchema = z.object({
  customerId: z.string().trim().min(1, "Enter the customer's account ID"),
  items: z
    .array(
      z.object({
        food: z.string().min(1, "Select a food"),
        quantity: z.number().int().positive("Quantity must be at least 1"),
        notes: z.string().optional(),
      })
    )
    .min(1, "Add at least one item"),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
