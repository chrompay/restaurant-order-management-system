import type { OrderStatus } from "@/features/orders/types/order.types";

// Cancelled sits outside the linear kitchen workflow, so it's excluded here.
const LINEAR_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out For Delivery",
  "Delivered",
];

export function getNextStatus(current: OrderStatus): OrderStatus | null {
  const index = LINEAR_STATUSES.indexOf(current);
  if (index === -1 || index === LINEAR_STATUSES.length - 1) return null;
  return LINEAR_STATUSES[index + 1];
}

export function getPreviousStatus(current: OrderStatus): OrderStatus | null {
  const index = LINEAR_STATUSES.indexOf(current);
  if (index <= 0) return null;
  return LINEAR_STATUSES[index - 1];
}
