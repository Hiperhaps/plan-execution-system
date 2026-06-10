export const TASK_DELAY_OPTIONS = [
  { days: 1, label: "明天" },
  { days: 3, label: "三天后" },
  { days: 7, label: "一周后" },
] as const;

export type TaskDelayDays = (typeof TASK_DELAY_OPTIONS)[number]["days"];

export function getDelayDateInputValue(days: TaskDelayDays, now = new Date()) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
