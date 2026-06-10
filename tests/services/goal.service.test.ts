import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    goal: {
      create: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    task: {
      groupBy: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import {
  createGoal,
  deleteGoal,
  getGoalById,
  listGoalProgress,
  listGoals,
  listGoalsWithProgress,
  updateGoal,
} from "@/services/goal.service";

const createdAt = new Date("2026-06-05T08:00:00.000Z");
const updatedAt = new Date("2026-06-06T08:00:00.000Z");

describe("Goal service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists goals newest first", async () => {
    prismaMock.goal.findMany.mockResolvedValue([]);

    await listGoals();

    expect(prismaMock.goal.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
  });

  it("creates a goal with ACTIVE as the default status", async () => {
    prismaMock.goal.create.mockResolvedValue({ id: "goal-1" });

    await createGoal({
      title: "完成 MVP",
      description: null,
    });

    expect(prismaMock.goal.create).toHaveBeenCalledWith({
      data: {
        title: "完成 MVP",
        description: null,
        status: "ACTIVE",
      },
    });
  });

  it("forwards get, update, and delete by id", async () => {
    prismaMock.goal.findUnique.mockResolvedValue(null);
    prismaMock.goal.update.mockResolvedValue({ id: "goal-1" });
    prismaMock.goal.delete.mockResolvedValue({ id: "goal-1" });

    await getGoalById("goal-1");
    await updateGoal("goal-1", { status: "COMPLETED" });
    await deleteGoal("goal-1");

    expect(prismaMock.goal.findUnique).toHaveBeenCalledWith({
      where: { id: "goal-1" },
    });
    expect(prismaMock.goal.update).toHaveBeenCalledWith({
      where: { id: "goal-1" },
      data: { status: "COMPLETED" },
    });
    expect(prismaMock.goal.delete).toHaveBeenCalledWith({
      where: { id: "goal-1" },
    });
  });

  it("derives display status and progress for goal cards", async () => {
    prismaMock.goal.findMany.mockResolvedValue([
      goalWithTasks("goal-done", "ACTIVE", ["DONE", "DONE"]),
      goalWithTasks("goal-active", "ACTIVE", ["DONE", "TODO"]),
      goalWithTasks("goal-archived", "ARCHIVED", ["DONE"]),
      goalWithTasks("goal-empty", "ACTIVE", []),
    ]);

    const result = await listGoalsWithProgress();

    expect(prismaMock.goal.findMany).toHaveBeenCalledWith({
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    expect(result).toMatchObject([
      {
        id: "goal-done",
        completedTasks: 2,
        displayStatus: "COMPLETED",
        progress: 100,
        totalTasks: 2,
      },
      {
        id: "goal-active",
        completedTasks: 1,
        displayStatus: "ACTIVE",
        progress: 50,
        totalTasks: 2,
      },
      {
        id: "goal-archived",
        completedTasks: 1,
        displayStatus: "ARCHIVED",
        progress: 100,
        totalTasks: 1,
      },
      {
        id: "goal-empty",
        completedTasks: 0,
        displayStatus: "ACTIVE",
        progress: 0,
        totalTasks: 0,
      },
    ]);
  });

  it("aggregates task progress by goal", async () => {
    prismaMock.goal.findMany.mockResolvedValue([
      { id: "goal-1", title: "目标 1", status: "ACTIVE" },
      { id: "goal-2", title: "目标 2", status: "ACTIVE" },
    ]);
    prismaMock.task.groupBy.mockResolvedValue([
      { goalId: "goal-1", status: "DONE", _count: { _all: 2 } },
      { goalId: "goal-1", status: "TODO", _count: { _all: 1 } },
    ]);

    const result = await listGoalProgress();

    expect(prismaMock.task.groupBy).toHaveBeenCalledWith({
      by: ["goalId", "status"],
      _count: {
        _all: true,
      },
    });
    expect(result).toEqual([
      {
        id: "goal-1",
        title: "目标 1",
        status: "ACTIVE",
        totalTasks: 3,
        completedTasks: 2,
        progress: 67,
      },
      {
        id: "goal-2",
        title: "目标 2",
        status: "ACTIVE",
        totalTasks: 0,
        completedTasks: 0,
        progress: 0,
      },
    ]);
  });
});

function goalWithTasks(id: string, status: string, taskStatuses: string[]) {
  return {
    id,
    title: id,
    description: null,
    status,
    startDate: null,
    targetDate: null,
    createdAt,
    updatedAt,
    tasks: taskStatuses.map((taskStatus) => ({ status: taskStatus })),
  };
}
