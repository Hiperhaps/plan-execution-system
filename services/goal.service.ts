import { prisma } from "@/lib/prisma";
import type { GoalStatus } from "@/lib/goal-options";

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

export function listGoals() {
  return prisma.goal.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function listGoalsWithProgress() {
  const goals = await prisma.goal.findMany({
    include: {
      tasks: {
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

export function getGoalById(id: string) {
  return prisma.goal.findUnique({
    where: { id },
  });
}

export function createGoal(data: CreateGoalInput) {
  return prisma.goal.create({
    data: {
      ...data,
      status: data.status ?? "ACTIVE",
    },
  });
}

export function updateGoal(id: string, data: UpdateGoalInput) {
  return prisma.goal.update({
    where: { id },
    data,
  });
}

export function deleteGoal(id: string) {
  return prisma.goal.delete({
    where: { id },
  });
}

export async function listGoalProgress() {
  const [goals, taskCounts] = await Promise.all([
    prisma.goal.findMany({
      select: {
        id: true,
        title: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.groupBy({
      by: ["goalId", "status"],
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
