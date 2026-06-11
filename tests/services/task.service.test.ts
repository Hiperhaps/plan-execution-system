import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    goal: {
      findFirst: vi.fn(),
    },
    task: {
      create: vi.fn(),
      deleteMany: vi.fn(),
      findFirst: vi.fn(),
      findFirstOrThrow: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import {
  createTask,
  deleteTask,
  getTaskById,
  listAllTasks,
  listInProgressTasks,
  listOverdueTasks,
  listTasksByGoal,
  listThisWeekTasks,
  listTodayTasks,
  listUpcomingTasks,
  updateTask,
} from "@/services/task.service";

describe("Task service", () => {
  const userId = "user-1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists tasks by goal in stable execution order", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);

    await listTasksByGoal(userId, "goal-1");

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: { goalId: "goal-1", userId },
      orderBy: [{ order: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
    });
  });

  it("lists all tasks with goal context", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);

    await listAllTasks(userId);

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: { userId },
      include: {
        goal: true,
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });
  });

  it("queries today's unfinished tasks by day range", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);
    const now = new Date("2026-06-10T12:30:00.000Z");

    await listTodayTasks(userId, now);

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        dueDate: {
          gte: new Date(2026, 5, 10, 0, 0, 0, 0),
          lte: new Date(2026, 5, 10, 23, 59, 59, 999),
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
  });

  it("queries overdue unfinished tasks before today", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);

    await listOverdueTasks(userId, new Date("2026-06-10T12:30:00.000Z"));

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        dueDate: {
          lt: new Date(2026, 5, 10, 0, 0, 0, 0),
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
  });

  it("queries upcoming unfinished tasks starting tomorrow", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);

    await listUpcomingTasks(userId, new Date("2026-06-10T12:30:00.000Z"));

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        dueDate: {
          gte: new Date(2026, 5, 11, 0, 0, 0, 0),
          lte: new Date(2026, 5, 13, 23, 59, 59, 999),
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
  });

  it("queries in-progress and current-week tasks", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);
    const now = new Date("2026-06-10T12:30:00.000Z");

    await listInProgressTasks(userId);
    await listThisWeekTasks(userId, now);

    expect(prismaMock.task.findMany).toHaveBeenNthCalledWith(1, {
      where: {
        userId,
        status: "IN_PROGRESS",
      },
      include: {
        goal: true,
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
    });
    expect(prismaMock.task.findMany).toHaveBeenNthCalledWith(2, {
      where: {
        userId,
        dueDate: {
          gte: new Date(2026, 5, 8, 0, 0, 0, 0),
          lte: new Date(2026, 5, 14, 23, 59, 59, 999),
        },
      },
      include: {
        goal: true,
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
    });
  });

  it("creates tasks with default status and priority", async () => {
    prismaMock.task.create.mockResolvedValue({ id: "task-1" });
    prismaMock.goal.findFirst.mockResolvedValue({ id: "goal-1" });

    await createTask(userId, {
      goalId: "goal-1",
      title: "设计数据模型",
      description: null,
    });

    expect(prismaMock.task.create).toHaveBeenCalledWith({
      data: {
        userId,
        goalId: "goal-1",
        title: "设计数据模型",
        description: null,
        status: "TODO",
        priority: "MEDIUM",
      },
    });
  });

  it("forwards get, update, and delete by id", async () => {
    prismaMock.task.findFirst.mockResolvedValue(null);
    prismaMock.task.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.task.findFirstOrThrow.mockResolvedValue({ id: "task-1" });
    prismaMock.task.deleteMany.mockResolvedValue({ count: 1 });

    await getTaskById(userId, "task-1");
    await updateTask(userId, "task-1", { status: "DONE" });
    await deleteTask(userId, "task-1");

    expect(prismaMock.task.findFirst).toHaveBeenCalledWith({
      where: { id: "task-1", userId },
    });
    expect(prismaMock.task.updateMany).toHaveBeenCalledWith({
      where: { id: "task-1", userId },
      data: { status: "DONE" },
    });
    expect(prismaMock.task.deleteMany).toHaveBeenCalledWith({
      where: { id: "task-1", userId },
    });
  });
});
