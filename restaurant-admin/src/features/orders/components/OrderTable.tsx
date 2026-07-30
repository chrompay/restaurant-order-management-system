import { format } from "date-fns";
import { MoreHorizontal, Printer, Eye, Trash2 } from "lucide-react";

import type { Order } from "../types/order.types";
import { STATUS_COLORS, formatOrderId, getCustomerName, getItemCount } from "../lib/orderDisplay";
import { formatCurrency } from "@/lib/currency";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

const DELETABLE_STATUSES = ["Delivered", "Cancelled"];

interface OrderTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onPrintOrder: (order: Order) => void;
  onDeleteOrder?: (order: Order) => void;
}

export default function OrderTable({ orders, onSelectOrder, onPrintOrder, onDeleteOrder }: OrderTableProps) {
  return (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectOrder(order)}>
              <TableCell className="font-medium">{formatOrderId(order._id)}</TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(order.createdAt), "MMM d, h:mm a")}
              </TableCell>
              <TableCell>{getCustomerName(order)}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={`${STATUS_COLORS[order.status]} border py-0 text-xs`}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{getItemCount(order)} items</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(order.totalAmount)}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSelectOrder(order)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPrintOrder(order)}>
                      <Printer className="mr-2 h-4 w-4" /> Print Receipt
                    </DropdownMenuItem>
                    {onDeleteOrder && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          disabled={!DELETABLE_STATUSES.includes(order.status)}
                          title={!DELETABLE_STATUSES.includes(order.status) ? "Only delivered or cancelled orders can be deleted" : undefined}
                          onClick={() => onDeleteOrder(order)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                        </DropdownMenuItem>
                      </>
                    )}
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
