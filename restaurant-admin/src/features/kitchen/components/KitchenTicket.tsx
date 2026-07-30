import { AlertCircle, ChefHat, CheckCircle2, UtensilsCrossed } from "lucide-react";

import type { Order } from "@/features/orders/types/order.types";
import { formatOrderId, getCustomerName } from "@/features/orders/lib/orderDisplay";
import { getElapsedMinutes, getTicketUrgency, formatElapsedTime } from "../lib/ticketStatus";

import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

const URGENCY_BORDER: Record<string, string> = {
  late: "border-t-destructive bg-destructive/5",
  warning: "border-t-amber-500 bg-amber-500/5",
  normal: "border-t-primary bg-card",
};

const URGENCY_TEXT: Record<string, string> = {
  late: "text-destructive",
  warning: "text-amber-500",
  normal: "text-primary",
};

interface KitchenTicketProps {
  order: Order;
  now: Date;
  stationFilter: string;
  onToggleItem: (orderId: string, itemId: string) => void;
  onBump: (order: Order) => void;
  isBumping?: boolean;
}

export default function KitchenTicket({ order, now, stationFilter, onToggleItem, onBump, isBumping }: KitchenTicketProps) {
  const elapsed = getElapsedMinutes(order.createdAt, now);
  const urgency = getTicketUrgency(elapsed);

  const visibleItems = stationFilter === "all"
    ? order.items
    : order.items.filter((item) => item.station === stationFilter);

  if (visibleItems.length === 0) return null;

  const allItemsCompleted = visibleItems.every((item) => item.completed);

  return (
    <Card className={`flex-none w-[320px] flex flex-col h-[calc(100vh-200px)] max-h-[700px] overflow-hidden border-t-4 shadow-md transition-colors ${URGENCY_BORDER[urgency]}`}>
      <CardHeader className="p-3 border-b bg-card shrink-0">
        <div className="flex justify-between items-start mb-2">
          <span className="font-bold text-2xl tracking-tight">{formatOrderId(order._id)}</span>
          <div className={`flex items-center gap-1.5 font-mono text-xl font-bold ${URGENCY_TEXT[urgency]}`}>
            {urgency === "late" && <AlertCircle className="h-5 w-5 animate-pulse" />}
            {formatElapsedTime(elapsed)}
          </div>
        </div>
        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UtensilsCrossed className="h-3.5 w-3.5" /> {getCustomerName(order)}
          </span>
          <span className="flex items-center gap-1.5">
            <ChefHat className="h-3.5 w-3.5" /> {order.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-y-auto bg-card">
        <ul className="divide-y divide-border/50">
          {visibleItems.map((item) => (
            <li
              key={item._id}
              className={`p-3 flex gap-3 cursor-pointer transition-colors hover:bg-muted/50 ${item.completed ? 'opacity-50 bg-muted/30' : ''}`}
              onClick={() => onToggleItem(order._id, item._id)}
            >
              <div className={`flex items-center justify-center h-8 w-8 rounded font-bold text-lg shrink-0 ${item.completed ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {item.quantity}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-base leading-tight ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {item.foodName}
                </p>
                {item.notes && (
                  <p className="mt-1 text-sm font-medium text-amber-500">+ {item.notes}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-3 border-t bg-card shrink-0">
        <Button
          className="w-full text-base font-semibold h-14 transition-all"
          variant={allItemsCompleted ? "default" : "secondary"}
          disabled={isBumping}
          onClick={() => onBump(order)}
        >
          {allItemsCompleted ? (
            <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Order Ready (Bump)</span>
          ) : (
            "Bump Order"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
