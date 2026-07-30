import type { User } from "./types/auth.types";

// restaurant-admin is a staff-only ops dashboard. Customers are served by a
// separate, not-yet-built app that talks to restaurant-api directly.
export const STAFF_ROLES: User["role"][] = ["admin", "manager", "kitchen"];
