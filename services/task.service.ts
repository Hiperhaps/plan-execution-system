import { prisma } from "@/lib/prisma";
import {
  getCurrentWeekRange,
  getDayRange,
  getUpcomingRange,
} from "@/lib/dates";
import { ResourceNotFoundError } from "@/lib/resource-errors";
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

export function listTasksByGoal(userId: string, goalId: string) {
  return prisma.task.findMany({
    where: { goalId, userId },
    orderBy: [{ order: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export function listAllTasks(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    include: {
      goal: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
}

export function listTodayTasks(userId: string, now = new Date()) {
  const { start, end } = getDayRange(now);

  return prisma.task.findMany({
    where: {
      userId,
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

export function listOverdueTasks(userId: string, now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  return prisma.task.findMany({
    where: {
      userId,
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

export function listUpcomingTasks(userId: string, now = new Date()) {
  const { start, end } = getUpcomingRange(3, now);

  return prisma.task.findMany({
    where: {
      userId,
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

export function listInProgressTasks(userId: string) {
  return prisma.task.findMany({
    where: {
      userId,
      status: "IN_PROGRESS",
    },
    include: {
      goal: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
  });
}

export function listThisWeekTasks(userId: string, now = new Date()) {
  const { start, end } = getCurrentWeekRange(now);

  return prisma.task.findMany({
    where: {
      userId,
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

export function getTaskById(userId: string, id: string) {
  return prisma.task.findFirst({
    where: { id, userId },
  });
}

export async function createTask(userId: string, data: CreateTaskInput) {
  const { goalId, ...taskData } = data;
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    select: { id: true },
  });

  if (!goal) {
    throw new ResourceNotFoundError("目标不存在");
  }

  return prisma.task.create({
    data: {
      ...taskData,
      userId,
      goalId,
      status: taskData.status ?? "TODO",
      priority: taskData.priority ?? "MEDIUM",
    },
  });
}

export async function updateTask(
  userId: string,
  id: string,
  data: UpdateTaskInput,
) {
  const result = await prisma.task.updateMany({
    where: { id, userId },
    data,
  });

  if (result.count === 0) {
    throw new ResourceNotFoundError("任务不存在");
  }

  return prisma.task.findFirstOrThrow({
    where: { id, userId },
  });
}

export async function deleteTask(userId: string, id: string) {
  const result = await prisma.task.deleteMany({
    where: { id, userId },
  });

  if (result.count === 0) {
    throw new ResourceNotFoundError("任务不存在");
  }

  return result;
}
