import { useEffect, useState } from "react";
import { format } from "date-fns";

import type { Order, OrderStatus } from "../types/order.types";
import { ORDER_STATUSES } from "../types/order.types";
import { STATUS_COLORS, formatOrderId, getCustomerName, getCustomerEmail } from "../lib/orderDisplay";
import { formatCurrency } from "@/lib/currency";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/app/components/ui/sheet";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface OrderDetailSheetProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onPrint: (order: Order) => void;
  isUpdating?: boolean;
}

export default function OrderDetailSheet({ order, onOpenChange, onUpdateStatus, onPrint, isUpdating }: OrderDetailSheetProps) {
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    setPendingStatus(order?.status ?? null);
  }, [order?._id, order?.status]);

  const customerPhone = order && typeof order.customer === "object" ? order.customer.phone : undefined;
  const customerAddress = order && typeof order.customer === "object" ? order.customer.address : undefined;

  return (
    <Sheet open={!!order} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto">
        {order && (
          <>
            <SheetHeader className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <SheetTitle className="text-2xl">{formatOrderId(order._id)}</SheetTitle>
                  <SheetDescription>Placed {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}</SheetDescription>
                </div>
                <Badge variant="secondary" className={`${STATUS_COLORS[order.status]} border`}>
                  {order.status}
                </Badge>
              </div>
            </SheetHeader>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Customer Details</h4>
                <Card>
                  <CardContent className="p-4 grid gap-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{getCustomerName(order)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{getCustomerEmail(order)}</span></div>
                    {customerPhone && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{customerPhone}</span></div>
                    )}
                    {customerAddress && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium">{customerAddress}</span></div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Order Summary</h4>
                <Card>
                  <CardContent className="p-0 divide-y">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between p-4 text-sm">
                        <div>
                          <span className="font-medium">{item.quantity}x {item.foodName}</span>
                          {item.notes && <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>}
                        </div>
                        <span>{formatCurrency(item.priceAtPurchase * item.quantity)}</span>
                      </div>
                    ))}
                  </CardContent>
                  <div className="p-4 bg-muted/10 border-t text-sm">
                    <div className="flex justify-between font-semibold text-base"><span>Total</span><span>{formatCurrency(order.totalAmount)}</span></div>
                  </div>
                </Card>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Update Status</h4>
                <Select value={pendingStatus ?? undefined} onValueChange={(v) => setPendingStatus(v as OrderStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SheetFooter className="mt-8 flex-col sm:flex-col gap-2">
              <Button
                className="w-full"
                disabled={!pendingStatus || pendingStatus === order.status || isUpdating}
                onClick={() => pendingStatus && onUpdateStatus(order._id, pendingStatus)}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => onPrint(order)}>Print Receipt</Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
