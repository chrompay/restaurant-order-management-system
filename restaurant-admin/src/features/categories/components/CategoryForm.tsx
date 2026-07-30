import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { categorySchema, CATEGORY_ICONS, type CategoryFormValues } from "../schemas/category.schema";
import { resolveCategoryIcon, getCategoryIconLabel } from "../lib/iconMap";
import type { Category } from "../types/category.types";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { DialogFooter } from "@/app/components/ui/dialog";

interface CategoryFormProps {
  category?: Category;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CategoryForm({ category, onSubmit, onCancel, isSubmitting }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: category?.categoryName ?? "",
      description: category?.description ?? "",
      icon: (category?.icon as CategoryFormValues["icon"]) ?? "utensils-crossed",
      status: category?.status ?? "Active",
    },
  });

  const status = watch("status");
  const icon = watch("icon");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="categoryName">Category Name</Label>
          <Input id="categoryName" placeholder="e.g. Signature Burgers" {...register("categoryName")} />
          {errors.categoryName && (
            <p className="text-sm text-destructive">{errors.categoryName.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="desc">Description</Label>
          <Input id="desc" placeholder="Brief description of category" {...register("description")} />
        </div>

        <div className="grid gap-2">
          <Label>Icon</Label>
          <Select value={icon} onValueChange={(v) => setValue("icon", v as CategoryFormValues["icon"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_ICONS.map((iconName) => {
                const Icon = resolveCategoryIcon(iconName);
                return (
                  <SelectItem key={iconName} value={iconName}>
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" /> {getCategoryIconLabel(iconName)}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Status</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={status === "Active" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setValue("status", "Active")}
            >
              Active
            </Button>
            <Button
              type="button"
              variant={status === "Draft" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setValue("status", "Draft")}
            >
              Draft
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Category"}
        </Button>
      </DialogFooter>
    </form>
  );
}
