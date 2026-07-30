import type { AnalyticsRange } from "../types/analytics.types";

// Mirrors the backend's utils/analyticsAggregations.js getRangeBounds/
// getPriorRangeBounds exactly, so the frontend can independently compute the
// same period boundaries to align/fill the two (current+prior) series it
// receives. Same known simplification as the rest of Analytics/Dashboard:
// day bucketing is UTC-based server-side, not per-viewer-timezone-aware.
export function getRangeBounds(range: AnalyticsRange): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "30d":
      start.setDate(start.getDate() - 30);
      break;
    case "90d":
      start.setDate(start.getDate() - 90);
      break;
    case "ytd":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "7d":
    default:
      start.setDate(start.getDate() - 7);
      break;
  }

  return { start, end };
}

export function getPriorRangeBounds({ start, end }: { start: Date; end: Date }) {
  const durationMs = end.getTime() - start.getTime();
  const priorEnd = new Date(start.getTime() - 1);
  const priorStart = new Date(priorEnd.getTime() - durationMs);

  return { start: priorStart, end: priorEnd };
}

export function getDayCount(range: AnalyticsRange): number {
  const { start, end } = getRangeBounds(range);
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);
}
