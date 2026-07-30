import {
  UtensilsCrossed,
  Beef,
  Salad,
  Coffee,
  Cake,
  Pizza,
  Sandwich,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type { CategoryIcon } from "../schemas/category.schema";

const ICON_MAP: Record<CategoryIcon, LucideIcon> = {
  "utensils-crossed": UtensilsCrossed,
  beef: Beef,
  salad: Salad,
  coffee: Coffee,
  cake: Cake,
  pizza: Pizza,
  sandwich: Sandwich,
  tag: Tag,
};

const ICON_LABELS: Record<CategoryIcon, string> = {
  "utensils-crossed": "Utensils",
  beef: "Meat",
  salad: "Salad",
  coffee: "Coffee",
  cake: "Dessert",
  pizza: "Pizza",
  sandwich: "Sandwich",
  tag: "Tag",
};

export function resolveCategoryIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName as CategoryIcon] ?? Tag;
}

export function getCategoryIconLabel(iconName: string): string {
  return ICON_LABELS[iconName as CategoryIcon] ?? "Tag";
}

export { ICON_MAP };
