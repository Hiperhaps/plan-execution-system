export type DashboardTaskItem = {
  id: string;
  goalId: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  estimatedHours: number | null;
  goalTitle: string;
};

export type GoalProgressItem = {
  id: string;
  title: string;
  status: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
};

export type ReminderType = "OVERDUE" | "TODAY" | "UPCOMING";

export type ReminderTaskItem = DashboardTaskItem & {
  reminderType: ReminderType;
};
