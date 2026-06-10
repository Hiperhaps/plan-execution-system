import { endOfWeek, startOfWeek } from "date-fns";

export function getDayRange(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function getUpcomingRange(days: number, date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + 1);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  end.setDate(end.getDate() + days);

  return { start, end };
}

export function getCurrentWeekRange(date = new Date()) {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
}
