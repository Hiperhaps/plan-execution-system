import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    task: {
      create: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists tasks by goal in stable execution order", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);

    await listTasksByGoal("goal-1");

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: { goalId: "goal-1" },
      orderBy: [{ order: "asc" }, { dueDate: "asc" }, { createdAt: "asc" }],
    });
  });

  it("lists all tasks with goal context", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);

    await listAllTasks();

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      include: {
        goal: true,
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });
  });

  it("queries today's unfinished tasks by day range", async () => {
    prismaMock.task.findMany.mockResolvedValue([]);
    const now = new Date("2026-06-10T12:30:00.000Z");

    await listTodayTasks(now);

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
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

    await listOverdueTasks(new Date("2026-06-10T12:30:00.000Z"));

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
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

    await listUpcomingTasks(new Date("2026-06-10T12:30:00.000Z"));

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
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

    await listInProgressTasks();
    await listThisWeekTasks(now);

    expect(prismaMock.task.findMany).toHaveBeenNthCalledWith(1, {
      where: {
        status: "IN_PROGRESS",
      },
      include: {
        goal: true,
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
    });
    expect(prismaMock.task.findMany).toHaveBeenNthCalledWith(2, {
      where: {
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

    await createTask({
      goalId: "goal-1",
      title: "设计数据模型",
      description: null,
    });

    expect(prismaMock.task.create).toHaveBeenCalledWith({
      data: {
        title: "设计数据模型",
        description: null,
        status: "TODO",
        priority: "MEDIUM",
        goal: {
          connect: {
            id: "goal-1",
          },
        },
      },
    });
  });

  it("forwards get, update, and delete by id", async () => {
    prismaMock.task.findUnique.mockResolvedValue(null);
    prismaMock.task.update.mockResolvedValue({ id: "task-1" });
    prismaMock.task.delete.mockResolvedValue({ id: "task-1" });

    await getTaskById("task-1");
    await updateTask("task-1", { status: "DONE" });
    await deleteTask("task-1");

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: "task-1" },
    });
    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: "task-1" },
      data: { status: "DONE" },
    });
    expect(prismaMock.task.delete).toHaveBeenCalledWith({
      where: { id: "task-1" },
    });
  });
});
