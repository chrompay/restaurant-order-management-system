import api from "@/services/api/axios";
import type {
  Rider,
  RidersListResponse,
  RiderResponse,
  GetRidersParams,
} from "../types/rider.types";
import type { RiderFormValues, RiderLocationFormValues } from "../schemas/rider.schema";

export const getRiders = async (
  params: GetRidersParams = {}
): Promise<RidersListResponse> => {
  const response = await api.get<RidersListResponse>("/riders", { params });
  return response.data;
};

export const createRider = async (
  values: RiderFormValues
): Promise<RiderResponse> => {
  const response = await api.post<RiderResponse>("/riders", values);
  return response.data;
};

export const updateRider = async (
  id: string,
  values: Partial<RiderFormValues>
): Promise<RiderResponse> => {
  const response = await api.patch<RiderResponse>(`/riders/${id}`, values);
  return response.data;
};

export const updateRiderLocation = async (
  id: string,
  values: RiderLocationFormValues
): Promise<RiderResponse> => {
  const response = await api.patch<RiderResponse>(`/riders/${id}/location`, values);
  return response.data;
};

export type { Rider };
