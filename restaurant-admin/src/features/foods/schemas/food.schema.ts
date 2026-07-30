import { z } from "zod";

export const foodSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().trim().min(5, "Description must be at least 5 characters"),
  ingredientsText: z.string().trim().min(1, "List at least one ingredient, separated by commas"),
  price: z.number().positive("Price must be greater than 0"),
  preparationTime: z.number().positive("Preparation time must be greater than 0"),
  menu: z.string().min(1, "Select a category"),
  station: z.enum([
    "Bakery",
    "Beverages",
    "Breakfast",
    "Fryer",
    "Grill",
    "Legumes & Pots",
    "Pepper Soup",
    "Protein Prep",
    "Rice & Grains",
    "Swallow & Soup",
  ]),
  availability: z.boolean(),
  image: z
    .instanceof(File)
    .optional()
    .nullable(),
});

export type FoodFormValues = z.infer<typeof foodSchema>;
