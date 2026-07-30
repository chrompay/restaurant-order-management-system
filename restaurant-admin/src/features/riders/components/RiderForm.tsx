import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { riderSchema, type RiderFormValues } from "../schemas/rider.schema";
import type { Rider, VehicleType, RiderStatus } from "../types/rider.types";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { DialogFooter } from "@/app/components/ui/dialog";

const VEHICLES: VehicleType[] = ["car", "bike", "scooter"];
const STATUSES: RiderStatus[] = ["available", "en_route", "returning", "offline"];

interface RiderFormProps {
  rider?: Rider;
  onSubmit: (values: RiderFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function RiderForm({ rider, onSubmit, onCancel, isSubmitting }: RiderFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RiderFormValues>({
    resolver: zodResolver(riderSchema),
    defaultValues: {
      name: rider?.name ?? "",
      phone: rider?.phone ?? "",
      vehicleType: rider?.vehicleType ?? "bike",
      status: rider?.status ?? "available",
    },
  });

  const vehicleType = watch("vehicleType");
  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="riderName">Name</Label>
          <Input id="riderName" placeholder="e.g. Mike Thomas" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="riderPhone">Phone</Label>
          <Input id="riderPhone" placeholder="+1 555-0100" {...register("phone")} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Vehicle</Label>
            <Select value={vehicleType} onValueChange={(v) => setValue("vehicleType", v as VehicleType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {VEHICLES.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setValue("status", v as RiderStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Rider"}
        </Button>
      </DialogFooter>
    </form>
  );
}
