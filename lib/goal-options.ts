export const GOAL_STATUSES = ["ACTIVE", "COMPLETED", "ARCHIVED"] as const;

export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const goalStatusLabels: Record<GoalStatus, string> = {
  ACTIVE: "进行中",
  COMPLETED: "已完成",
  ARCHIVED: "已归档",
};

export function getGoalStatusLabel(status: string) {
  return goalStatusLabels[status as GoalStatus] ?? status;
}
