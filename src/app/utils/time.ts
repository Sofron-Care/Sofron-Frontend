import dayjs from "dayjs";

export function formatTimeRange(start: string, end: string) {
  const startFormatted = dayjs(start).format("h:mm A");
  const endFormatted = dayjs(end).format("h:mm A");

  return `${startFormatted} - ${endFormatted}`;
}
