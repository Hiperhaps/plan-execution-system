import { prisma } from "@/lib/prisma";
import {
  getCurrentWeekRange,
  getDayRange,
  getUpcomingRange,
} from "@/lib/dates";
import type { TaskPriority, TaskStatus } from "@/lib/task-options";

type CreateTaskInput = {
  goalId: string;
  title: string;
  description?: string | null;
  phase?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  estimatedHours?: number | null;
  completedAt?: Date | null;
  order?: number;
};

type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  phase?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  estimatedHours?: number | null;
  completedAt?: Date | null;
  order?: number;
};

export function listTasksByGoal(goalId: string) {
  return prisma.task.findMany({
    where: { goalId },
    orderBy: [{ order: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export function listAllTasks() {
  return prisma.task.findMany({
    include: {
      goal: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
}

export function listTodayTasks(now = new Date()) {
  const { start, end } = getDayRange(now);

  return prisma.task.findMany({
    where: {
      dueDate: {
        gte: start,
        lte: end,
      },
      status: {
        not: "DONE",
      },
    },
    include: {
      goal: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export function listOverdueTasks(now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  return prisma.task.findMany({
    where: {
      dueDate: {
        lt: today,
      },
      status: {
        not: "DONE",
      },
    },
    include: {
      goal: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export function listUpcomingTasks(now = new Date()) {
  const { start, end } = getUpcomingRange(3, now);

  return prisma.task.findMany({
    where: {
      dueDate: {
        gte: start,
        lte: end,
      },
      status: {
        not: "DONE",
      },
    },
    include: {
      goal: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export function listInProgressTasks() {
  return prisma.task.findMany({
    where: {
      status: "IN_PROGRESS",
    },
    include: {
      goal: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export function listThisWeekTasks(now = new Date()) {
  const { start, end } = getCurrentWeekRange(now);

  return prisma.task.findMany({
    where: {
      dueDate: {
        gte: start,
        lte: end,
      },
    },
    include: {
      goal: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export function createTask(data: CreateTaskInput) {
  const { goalId, ...taskData } = data;

  return prisma.task.create({
    data: {
      ...taskData,
      status: taskData.status ?? "TODO",
      priority: taskData.priority ?? "MEDIUM",
      goal: {
        connect: {
          id: goalId,
        },
      },
    },
  });
}

export function updateTask(id: string, data: UpdateTaskInput) {
  return prisma.task.update({
    where: { id },
    data,
  });
}

export function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}
