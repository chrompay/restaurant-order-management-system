import { MoreHorizontal, Edit, Trash2, Utensils } from "lucide-react";

import type { Food } from "../types/food.types";
import { formatCurrency } from "@/lib/currency";
import { resolveAssetUrl } from "@/lib/assetUrl";

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

function categoryName(food: Food) {
  return typeof food.menu === "object" && food.menu ? food.menu.categoryName : "Uncategorized";
}

interface FoodTableProps {
  foods: Food[];
  onEdit: (food: Food) => void;
  onDelete: (food: Food) => void;
  onToggleAvailability: (food: Food, value: boolean) => void;
}

export default function FoodTable({ foods, onEdit, onDelete, onToggleAvailability }: FoodTableProps) {
  return (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Prep Time</TableHead>
            <TableHead>Available</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.map((food) => (
            <TableRow key={food._id}>
              <TableCell>
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  {food.image ? (
                    <img src={resolveAssetUrl(food.image)} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <Utensils className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{food.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{categoryName(food)}</Badge>
              </TableCell>
              <TableCell>{formatCurrency(food.price)}</TableCell>
              <TableCell className="text-muted-foreground">{food.preparationTime} min</TableCell>
              <TableCell>
                <Switch
                  checked={food.availability}
                  onCheckedChange={(value) => onToggleAvailability(food, value)}
                />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(food)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Food
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(food)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
