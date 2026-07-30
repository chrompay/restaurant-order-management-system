import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { createOrderSchema, type CreateOrderFormValues } from "../schemas/order.schema";
import { useFoods } from "@/features/foods/hooks/useFoods";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { formatCurrency } from "@/lib/currency";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateOrderFormValues) => void;
  isSubmitting?: boolean;
}

export default function CreateOrderDialog({ open, onOpenChange, onSubmit, isSubmitting }: CreateOrderDialogProps) {
  const { data: foodsData } = useFoods({ limit: 100 });
  const foods = foodsData?.data ?? [];

  const { data: customersData } = useCustomers({ limit: 100 });
  const customers = customersData?.data ?? [];

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerId: "",
      items: [{ food: "", quantity: 1, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const handleClose = () => {
    reset({ customerId: "", items: [{ food: "", quantity: 1, notes: "" }] });
    onOpenChange(false);
  };

  const submit = (values: CreateOrderFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Create a new order on behalf of an existing customer.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid gap-2">
              <Label htmlFor="customerId">Customer</Label>
              <Select value={watch("customerId")} onValueChange={(v) => setValue("customerId", v)}>
                <SelectTrigger id="customerId">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      {customer.fullName} &mdash; {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-sm text-destructive">{errors.customerId.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Items</Label>
              {fields.map((field, index) => {
                const foodValue = watch(`items.${index}.food`);
                return (
                  <div key={field.id} className="flex items-start gap-2 border rounded-md p-3">
                    <div className="flex-1 grid gap-2">
                      <Select value={foodValue} onValueChange={(v) => setValue(`items.${index}.food`, v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a food" />
                        </SelectTrigger>
                        <SelectContent>
                          {foods.map((food) => (
                            <SelectItem key={food._id} value={food._id}>
                              {food.name} &mdash; {formatCurrency(food.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.items?.[index]?.food && (
                        <p className="text-sm text-destructive">{errors.items[index]?.food?.message}</p>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          min={1}
                          placeholder="Qty"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                        <Input placeholder="Notes (optional)" {...register(`items.${index}.notes`)} />
                      </div>
                      {errors.items?.[index]?.quantity && (
                        <p className="text-sm text-destructive">{errors.items[index]?.quantity?.message}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              {errors.items?.root && <p className="text-sm text-destructive">{errors.items.root.message}</p>}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => append({ food: "", quantity: 1, notes: "" })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
