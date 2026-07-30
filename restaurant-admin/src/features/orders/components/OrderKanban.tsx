import { Clock } from "lucide-react";

import type { Order, OrderStatus } from "../types/order.types";
import { STATUS_COLORS, formatOrderId, getCustomerName, getItemCount } from "../lib/orderDisplay";
import { formatCurrency } from "@/lib/currency";

import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";

const KANBAN_COLUMNS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out For Delivery",
  "Delivered",
];

function minutesAgo(createdAt: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
  return `${minutes}m`;
}

interface OrderKanbanProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export default function OrderKanban({ orders, onSelectOrder }: OrderKanbanProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] items-start">
      {KANBAN_COLUMNS.map((col) => {
        const colOrders = orders.filter((o) => o.status === col);
        return (
          <div key={col} className="flex flex-col flex-none w-[320px] bg-muted/20 rounded-xl border border-border/50 h-full overflow-hidden">
            <div className="p-3 border-b border-border/50 bg-muted/40 flex justify-between items-center">
              <h3 className="font-semibold text-sm">{col}</h3>
              <Badge variant="secondary" className={`${STATUS_COLORS[col]} border py-0 text-xs`}>{colOrders.length}</Badge>
            </div>
            <ScrollArea className="flex-1 p-3">
              {colOrders.map((order) => (
                <Card key={order._id} className="p-3 mb-3 shadow-sm hover:border-primary/50 cursor-pointer" onClick={() => onSelectOrder(order)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{formatOrderId(order._id)}</span>
                  </div>
                  <div className="text-sm font-medium">{getCustomerName(order)}</div>
                  <div className="text-xs text-muted-foreground mb-3">{getItemCount(order)} items &bull; {formatCurrency(order.totalAmount)}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{minutesAgo(order.createdAt)} ago</span>
                  </div>
                </Card>
              ))}
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
