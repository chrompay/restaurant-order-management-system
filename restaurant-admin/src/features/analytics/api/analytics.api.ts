import api from "@/services/api/axios";
import type {
  AnalyticsRange,
  AnalyticsResponse,
  OverviewAnalytics,
  SalesAnalytics,
  KitchenAnalytics,
  CustomersAnalytics,
} from "../types/analytics.types";

export const getOverviewAnalytics = async (
  range: AnalyticsRange
): Promise<AnalyticsResponse<OverviewAnalytics>> => {
  const response = await api.get<AnalyticsResponse<OverviewAnalytics>>("/analytics/overview", {
    params: { range },
  });
  return response.data;
};

export const getSalesAnalytics = async (
  range: AnalyticsRange
): Promise<AnalyticsResponse<SalesAnalytics>> => {
  const response = await api.get<AnalyticsResponse<SalesAnalytics>>("/analytics/sales", {
    params: { range },
  });
  return response.data;
};

export const getKitchenAnalytics = async (
  range: AnalyticsRange
): Promise<AnalyticsResponse<KitchenAnalytics>> => {
  const response = await api.get<AnalyticsResponse<KitchenAnalytics>>("/analytics/kitchen", {
    params: { range },
  });
  return response.data;
};

export const getCustomersAnalytics = async (
  range: AnalyticsRange
): Promise<AnalyticsResponse<CustomersAnalytics>> => {
  const response = await api.get<AnalyticsResponse<CustomersAnalytics>>("/analytics/customers", {
    params: { range },
  });
  return response.data;
};
