export type AnalyticsRange = "today" | "7d" | "30d" | "90d" | "ytd";

export interface DeltaMetric {
  current: number;
  prior: number;
  deltaPct: number;
}

export interface RevenueDayPoint {
  date: string;
  revenue: number;
}

export interface PeakHourPoint {
  hour: number;
  volume: number;
}

export interface RevenueHourPoint {
  hour: number;
  revenue: number;
}

export interface StatusDistributionPoint {
  name: string;
  value: number;
}

export interface TopFoodWithGrowth {
  name: string;
  sales: number;
  revenue: number;
  growthPct: number | null;
}

export interface CustomerGrowthPoint {
  month: string;
  new: number;
  returning: number;
}

export interface Insight {
  title: string;
  desc: string;
  type: "positive" | "negative";
}

export interface OverviewAnalytics {
  revenue: DeltaMetric;
  orders: DeltaMetric;
  avgPrepMinutes: DeltaMetric;
  activeCustomers: DeltaMetric;
  revenueSeries: { current: RevenueDayPoint[]; prior: RevenueDayPoint[] };
  statusDistribution: StatusDistributionPoint[];
  peakHours: PeakHourPoint[];
  topFoods: TopFoodWithGrowth[];
  customerGrowth: CustomerGrowthPoint[];
  insights: Insight[];
}

export interface CategoryBreakdownPoint {
  name: string;
  value: number;
}

export interface SalesAnalytics {
  grossSales: DeltaMetric;
  netSales: DeltaMetric;
  discounts: DeltaMetric;
  avgTicketSize: DeltaMetric;
  categoryBreakdown: CategoryBreakdownPoint[];
  hourlySales: RevenueHourPoint[];
}

export interface PrepTimeDayPoint {
  date: string;
  avgPrep: number;
}

export interface StationLoadPoint {
  station: string;
  orders: number;
}

export interface KitchenAnalytics {
  avgPrepMinutes: DeltaMetric;
  onTimePct: DeltaMetric;
  latePct: DeltaMetric;
  targetPrepMinutes: number;
  prepTimeSeries: PrepTimeDayPoint[];
  stationLoad: StationLoadPoint[];
}

export interface CustomerSegment {
  tier: "VIP" | "Regular" | "New";
  pct: number;
}

export interface CustomersAnalytics {
  activeCustomers: DeltaMetric;
  returningRate: DeltaMetric;
  avgLifetimeValue: DeltaMetric;
  churnRatePct: number;
  customerGrowth: CustomerGrowthPoint[];
  segments: CustomerSegment[];
}

export interface AnalyticsResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
