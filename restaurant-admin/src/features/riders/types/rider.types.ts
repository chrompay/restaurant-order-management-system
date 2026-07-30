export type VehicleType = "car" | "bike" | "scooter";
export type RiderStatus = "available" | "en_route" | "returning" | "offline";

export interface RiderLocation {
  lat?: number;
  lng?: number;
  updatedAt?: string;
}

export interface Rider {
  _id: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  status: RiderStatus;
  location?: RiderLocation;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  count: number;
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RidersListResponse {
  success: boolean;
  message: string;
  data: Rider[];
  meta: PaginationMeta;
}

export interface RiderResponse {
  success: boolean;
  message: string;
  data: Rider;
}

export interface GetRidersParams {
  page?: number;
  limit?: number;
  status?: RiderStatus;
}
