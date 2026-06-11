import { prisma } from "@/lib/prisma";
import type { GoalStatus } from "@/lib/goal-options";
import { ResourceNotFoundError } from "@/lib/resource-errors";

type CreateGoalInput = {
  title: string;
  description?: string | null;
  status?: GoalStatus;
  startDate?: Date | null;
  targetDate?: Date | null;
};

type UpdateGoalInput = {
  title?: string;
  description?: string | null;
  status?: GoalStatus;
  startDate?: Date | null;
  targetDate?: Date | null;
};

export function listGoals(userId: string) {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listGoalsWithProgress(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    include: {
      tasks: {
        where: { userId },
        select: {
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return goals.map((goal) => {
    const totalTasks = goal.tasks.length;
    const completedTasks = goal.tasks.filter(
      (task) => task.status === "DONE",
    ).length;
    const progress =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const displayStatus =
      goal.status === "ARCHIVED"
        ? "ARCHIVED"
        : goal.status === "COMPLETED" ||
            (totalTasks > 0 && completedTasks === totalTasks)
          ? "COMPLETED"
          : "ACTIVE";
    return {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      status: goal.status,
      startDate: goal.startDate,
      targetDate: goal.targetDate,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
      completedTasks,
      displayStatus,
      progress,
      totalTasks,
    };
  });
}

export function getGoalById(userId: string, id: string) {
  return prisma.goal.findFirst({
    where: { id, userId },
  });
}

export function createGoal(userId: string, data: CreateGoalInput) {
  return prisma.goal.create({
    data: {
      ...data,
      userId,
      status: data.status ?? "ACTIVE",
    },
  });
}

export async function updateGoal(
  userId: string,
  id: string,
  data: UpdateGoalInput,
) {
  const result = await prisma.goal.updateMany({
    where: { id, userId },
    data,
  });

  if (result.count === 0) {
    throw new ResourceNotFoundError("目标不存在");
  }

  return prisma.goal.findFirstOrThrow({
    where: { id, userId },
  });
}

export async function deleteGoal(userId: string, id: string) {
  const result = await prisma.goal.deleteMany({
    where: { id, userId },
  });

  if (result.count === 0) {
    throw new ResourceNotFoundError("目标不存在");
  }

  return result;
}

export async function listGoalProgress(userId: string) {
  const [goals, taskCounts] = await Promise.all([
    prisma.goal.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.groupBy({
      by: ["goalId", "status"],
      where: { userId },
      _count: {
        _all: true,
      },
    }),
  ]);
  const countByGoal = new Map<
    string,
    {
      totalTasks: number;
      completedTasks: number;
    }
  >();

  for (const item of taskCounts) {
    const current = countByGoal.get(item.goalId) ?? {
      totalTasks: 0,
      completedTasks: 0,
    };
    const count = item._count._all;

    current.totalTasks += count;

    if (item.status === "DONE") {
      current.completedTasks += count;
    }

    countByGoal.set(item.goalId, current);
  }

  return goals.map((goal) => {
    const counts = countByGoal.get(goal.id) ?? {
      totalTasks: 0,
      completedTasks: 0,
    };
    const progress =
      counts.totalTasks === 0
        ? 0
        : Math.round((counts.completedTasks / counts.totalTasks) * 100);

    return {
      id: goal.id,
      title: goal.title,
      status: goal.status,
      totalTasks: counts.totalTasks,
      completedTasks: counts.completedTasks,
      progress,
    };
  });
}
