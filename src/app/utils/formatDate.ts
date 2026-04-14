import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatNotificationDate = (date: string) => {
  const now = dayjs();
  const d = dayjs(date);

  if (now.diff(d, "hour") < 24) {
    return d.fromNow();
  }

  return d.format("MMM D, h:mm A");
};
