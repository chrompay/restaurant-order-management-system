import api from "@/services/api/axios";
import {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
} from "../types/auth.types";

export const login = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    payload
  );

  return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>(
    "/auth/profile"
  );

  return response.data;
};