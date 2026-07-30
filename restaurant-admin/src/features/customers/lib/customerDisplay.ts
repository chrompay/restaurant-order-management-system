import type { Customer } from "../types/customer.types";

export function getCustomerInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase() || "?";
}

export function getTierBadgeVariant(tier: Customer["tier"]): "default" | "secondary" {
  return tier === "VIP" ? "default" : "secondary";
}
