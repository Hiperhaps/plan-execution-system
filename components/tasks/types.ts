import type { TaskPriority, TaskStatus } from "@/lib/task-options";

export type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  phase: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  estimatedHours: number | null;
};

export type TaskFormState = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
};

export const emptyTaskForm: TaskFormState = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
};
