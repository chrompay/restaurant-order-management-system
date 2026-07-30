import type { Order, OrderStatus } from "../types/order.types";

export const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Preparing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "Out For Delivery": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  Delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function formatOrderId(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

export function getCustomerName(order: Order): string {
  return typeof order.customer === "object" ? order.customer.fullName : "Unknown customer";
}

export function getCustomerEmail(order: Order): string {
  return typeof order.customer === "object" ? order.customer.email : "";
}

export function getItemCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}
