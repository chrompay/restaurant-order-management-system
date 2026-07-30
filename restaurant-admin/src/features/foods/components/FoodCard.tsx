import { MoreHorizontal, Edit, Trash2, Utensils } from "lucide-react";

import type { Food } from "../types/food.types";
import { formatCurrency } from "@/lib/currency";
import { resolveAssetUrl } from "@/lib/assetUrl";

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

function categoryName(food: Food) {
  return typeof food.menu === "object" && food.menu ? food.menu.categoryName : "Uncategorized";
}

interface FoodCardProps {
  food: Food;
  onEdit: (food: Food) => void;
  onDelete: (food: Food) => void;
  onToggleAvailability: (food: Food, value: boolean) => void;
}

export default function FoodCard({ food, onEdit, onDelete, onToggleAvailability }: FoodCardProps) {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <div className="h-32 bg-muted flex items-center justify-center relative group">
        {food.image ? (
          <img src={resolveAssetUrl(food.image)} alt={food.name} className="w-full h-full object-cover" />
        ) : (
          <Utensils className="w-10 h-10 text-muted-foreground" />
        )}
        {!food.availability && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[1px]">
            <Badge variant="secondary">Unavailable</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-base line-clamp-1">{food.name}</h3>
            <p className="text-sm text-muted-foreground">{categoryName(food)}</p>
          </div>
          <p className="font-bold">{formatCurrency(food.price)}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={food.availability}
              onCheckedChange={(value) => onToggleAvailability(food, value)}
            />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(food)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(food)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
