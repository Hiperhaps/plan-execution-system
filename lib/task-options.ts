export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE", "DELAYED"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: "未开始",
  IN_PROGRESS: "进行中",
  DONE: "已完成",
  DELAYED: "延期",
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高",
};

export const taskPriorityRank: Record<TaskPriority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

export function getTaskStatusLabel(status: string) {
  return taskStatusLabels[status as TaskStatus] ?? status;
}

export function getTaskPriorityLabel(priority: string) {
  return taskPriorityLabels[priority as TaskPriority] ?? priority;
}

export function getTaskPriorityRank(priority: string) {
  return taskPriorityRank[priority as TaskPriority] ?? 9;
}
