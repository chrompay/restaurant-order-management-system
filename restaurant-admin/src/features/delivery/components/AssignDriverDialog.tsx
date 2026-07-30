import { useState } from "react";
import { Car, Bike } from "lucide-react";

import type { Order } from "@/features/orders/types/order.types";
import type { Rider } from "@/features/riders/types/rider.types";
import { getCustomerName, formatOrderId } from "@/features/orders/lib/orderDisplay";
import { useAssignRider } from "../hooks/useAssignRider";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

interface AssignDriverDialogProps {
  order: Order | null;
  riders: Rider[];
  onOpenChange: (open: boolean) => void;
}

export default function AssignDriverDialog({ order, riders, onOpenChange }: AssignDriverDialogProps) {
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const assignRider = useAssignRider();

  const availableRiders = riders.filter((r) => r.status === "available");

  const handleClose = () => {
    setSelectedRiderId(null);
    onOpenChange(false);
  };

  const handleAssign = () => {
    if (!order || !selectedRiderId) return;
    assignRider.mutate(
      { orderId: order._id, riderId: selectedRiderId },
      { onSuccess: handleClose }
    );
  };

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Driver</DialogTitle>
          <DialogDescription>
            {order && `Pick a rider for ${formatOrderId(order._id)} (${getCustomerName(order)})`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {availableRiders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No available riders. Update fleet status first.
            </p>
          ) : (
            availableRiders.map((rider) => (
              <Card
                key={rider._id}
                className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${selectedRiderId === rider._id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                onClick={() => setSelectedRiderId(rider._id)}
              >
                {rider.vehicleType === 'bike' ? <Bike className="w-5 h-5 text-muted-foreground" /> : <Car className="w-5 h-5 text-muted-foreground" />}
                <div className="flex-1">
                  <p className="font-medium text-sm">{rider.name}</p>
                  <p className="text-xs text-muted-foreground">{rider.phone}</p>
                </div>
              </Card>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAssign} disabled={!selectedRiderId || assignRider.isPending}>
            {assignRider.isPending ? "Assigning..." : "Assign Driver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
