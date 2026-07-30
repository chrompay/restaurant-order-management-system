import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { foodSchema, type FoodFormValues } from "../schemas/food.schema";
import type { Food, FoodStation } from "../types/food.types";
import { useCategories } from "@/features/categories/hooks/useCategories";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { DialogFooter } from "@/app/components/ui/dialog";

const STATIONS: FoodStation[] = [
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
];

interface FoodFormProps {
  food?: Food;
  onSubmit: (values: FoodFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function FoodForm({ food, onSubmit, onCancel, isSubmitting }: FoodFormProps) {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: food?.name ?? "",
      description: food?.description ?? "",
      ingredientsText: food?.ingredients?.join(", ") ?? "",
      price: food?.price ?? 0,
      preparationTime: food?.preparationTime ?? 0,
      menu: typeof food?.menu === "object" ? food?.menu?._id ?? "" : food?.menu ?? "",
      station: food?.station ?? "Grill",
      availability: food?.availability ?? true,
      image: null,
    },
  });

  const menu = watch("menu");
  const station = watch("station");
  const availability = watch("availability");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="grid gap-2">
          <Label htmlFor="name">Food Name</Label>
          <Input id="name" placeholder="e.g. Double Cheeseburger" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Short description shown to customers" {...register("description")} />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ingredientsText">Ingredients</Label>
          <Input id="ingredientsText" placeholder="e.g. Beef, Cheese, Lettuce" {...register("ingredientsText")} />
          <p className="text-xs text-muted-foreground">Separate ingredients with commas.</p>
          {errors.ingredientsText && (
            <p className="text-sm text-destructive">{errors.ingredientsText.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={menu} onValueChange={(v) => setValue("menu", v)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.menu && <p className="text-sm text-destructive">{errors.menu.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Sale Price (₦)</Label>
            <Input id="price" type="number" step="0.01" placeholder="0.00" {...register("price", { valueAsNumber: true })} />
            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="preparationTime">Prep Time (min)</Label>
            <Input id="preparationTime" type="number" placeholder="15" {...register("preparationTime", { valueAsNumber: true })} />
            {errors.preparationTime && (
              <p className="text-sm text-destructive">{errors.preparationTime.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="station">Kitchen Station</Label>
            <Select value={station} onValueChange={(v) => setValue("station", v as FoodStation)}>
              <SelectTrigger id="station">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {STATIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setValue("image", e.target.files?.[0] ?? null)}
          />
          {food?.image && (
            <p className="text-xs text-muted-foreground">Leave blank to keep the current image.</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Availability</Label>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Available on Menu</Label>
              <p className="text-sm text-muted-foreground">Customers can order this item</p>
            </div>
            <Switch checked={availability} onCheckedChange={(v) => setValue("availability", v)} />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Food"}
        </Button>
      </DialogFooter>
    </form>
  );
}
