import type { RiderStatus } from "../types/rider.types";

export const RIDER_STATUS_COLORS: Record<RiderStatus, string> = {
  available: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  en_route: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  returning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  offline: "bg-muted text-muted-foreground border-border",
};

export const RIDER_STATUS_BORDER: Record<RiderStatus, string> = {
  available: "border-l-emerald-500",
  en_route: "border-l-blue-500",
  returning: "border-l-amber-500",
  offline: "border-l-muted-foreground",
};

export function formatRiderStatus(status: RiderStatus): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getRiderInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase() || "?";
}
