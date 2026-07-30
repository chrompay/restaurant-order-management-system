export type TicketUrgency = "late" | "warning" | "normal";

export function getElapsedMinutes(createdAt: string, now: Date): number {
  return Math.max(0, Math.floor((now.getTime() - new Date(createdAt).getTime()) / 60000));
}

export function getTicketUrgency(elapsedMinutes: number): TicketUrgency {
  if (elapsedMinutes >= 20) return "late";
  if (elapsedMinutes >= 10) return "warning";
  return "normal";
}

// A ticket should never realistically sit for hours/days, but stale or
// forgotten orders can — format those readably instead of raw minutes
// (e.g. "38h", "3d") rather than a confusing 4-5 digit minute count.
export function formatElapsedTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
}
