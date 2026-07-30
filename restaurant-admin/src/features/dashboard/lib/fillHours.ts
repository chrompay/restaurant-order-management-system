export function fillHourSeries<K extends string>(
  data: Array<{ hour: number } & Record<K, number>>,
  valueKey: K
): Array<{ hour: number } & Record<K, number>> {
  const byHour = new Map(data.map((point) => [point.hour, point[valueKey]]));

  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    [valueKey]: byHour.get(hour) ?? 0,
  })) as Array<{ hour: number } & Record<K, number>>;
}

export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}
