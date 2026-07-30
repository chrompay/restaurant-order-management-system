import api from "@/services/api/axios";
import type {
  DashboardKpis,
  RevenuePoint,
  PeakHoursPoint,
  PrepTimePoint,
  TopFood,
  DashboardResponse,
} from "../types/dashboard.types";

export const getKpis = async (): Promise<DashboardResponse<DashboardKpis>> => {
  const response = await api.get<DashboardResponse<DashboardKpis>>("/dashboard/kpis");
  return response.data;
};

export const getRevenueSeries = async (): Promise<DashboardResponse<RevenuePoint[]>> => {
  const response = await api.get<DashboardResponse<RevenuePoint[]>>("/dashboard/revenue-series");
  return response.data;
};

export const getPeakHours = async (): Promise<DashboardResponse<PeakHoursPoint[]>> => {
  const response = await api.get<DashboardResponse<PeakHoursPoint[]>>("/dashboard/peak-hours");
  return response.data;
};

export const getPrepTimeSeries = async (): Promise<DashboardResponse<PrepTimePoint[]>> => {
  const response = await api.get<DashboardResponse<PrepTimePoint[]>>("/dashboard/prep-time-series");
  return response.data;
};

export const getTopFoods = async (): Promise<DashboardResponse<TopFood[]>> => {
  const response = await api.get<DashboardResponse<TopFood[]>>("/dashboard/top-foods");
  return response.data;
};
