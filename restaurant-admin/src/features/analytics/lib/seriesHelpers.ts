import type { AnalyticsRange, RevenueDayPoint } from "../types/analytics.types";
import { getRangeBounds, getPriorRangeBounds, getDayCount } from "./dateRange";

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function fillDailySeries(points: RevenueDayPoint[], start: Date, dayCount: number): number[] {
  const byDate = new Map(points.map((p) => [p.date, p.revenue]));

  return Array.from({ length: dayCount }, (_, i) => {
    const day = new Date(start);
    day.setDate(day.getDate() + i);
    return byDate.get(toDateKey(day)) ?? 0;
  });
}

export interface RevenueComparisonPoint {
  label: string;
  revenue: number;
  lastPeriod: number;
}

// Zips the current+prior daily revenue series (each sparse — only days with
// orders appear) into one aligned-by-relative-day-offset array for the
// "Revenue vs Last Period" chart.
export function zipRevenueComparison(
  current: RevenueDayPoint[],
  prior: RevenueDayPoint[],
  range: AnalyticsRange
): RevenueComparisonPoint[] {
  const currentRange = getRangeBounds(range);
  const priorRange = getPriorRangeBounds(currentRange);
  const dayCount = getDayCount(range);

  const currentValues = fillDailySeries(current, currentRange.start, dayCount);
  const priorValues = fillDailySeries(prior, priorRange.start, dayCount);

  return Array.from({ length: dayCount }, (_, i) => {
    const day = new Date(currentRange.start);
    day.setDate(day.getDate() + i);

    return {
      label: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      revenue: currentValues[i],
      lastPeriod: priorValues[i],
    };
  });
}
