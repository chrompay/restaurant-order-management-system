export interface DashboardKpis {
  revenueToday: number;
  revenueDeltaPct: number;
  ordersToday: number;
  ordersDeltaPct: number;
  pendingOrders: number;
  kitchenQueueCount: number;
  kitchenAvgWaitMinutes: number;
  customersToday: number;
  customersDeltaPct: number;
}

export interface RevenuePoint {
  hour: number;
  revenue: number;
}

export interface PeakHoursPoint {
  hour: number;
  volume: number;
}

export interface PrepTimePoint {
  hour: number;
  avgPrep: number;
}

export interface TopFood {
  name: string;
  sales: number;
}

export interface DashboardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
