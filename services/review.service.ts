import { prisma } from "@/lib/prisma";
import { getCurrentWeekRange } from "@/lib/dates";
import { ResourceNotFoundError } from "@/lib/resource-errors";
import type { ReviewType } from "@/lib/review-options";

type ReviewPeriod = {
  start: Date;
  end: Date;
};

function normalizePeriod(start: Date, end: Date): ReviewPeriod {
  const periodStart = new Date(start);
  periodStart.setHours(0, 0, 0, 0);

  const periodEnd = new Date(end);
  periodEnd.setHours(23, 59, 59, 999);

  return {
    start: periodStart,
    end: periodEnd,
  };
}

function isWithinPeriod(value: Date | null, period: ReviewPeriod) {
  return value !== null && value >= period.start && value <= period.end;
}

function classifyTasks<
  T extends {
    id: string;
    status: string;
    dueDate: Date | null;
    completedAt: Date | null;
  },
>(tasks: T[], period: ReviewPeriod) {
  const completedTasks = tasks.filter(
    (task) =>
      task.status === "DONE" &&
      (isWithinPeriod(task.completedAt, period) ||
        (!task.completedAt && isWithinPeriod(task.dueDate, period))),
  );
  const delayedTasks = tasks.filter(
    (task) =>
      task.status === "DELAYED" ||
      (task.status !== "DONE" &&
        task.dueDate !== null &&
        task.dueDate <= period.end),
  );
  const delayedTaskIds = new Set(delayedTasks.map((task) => task.id));
  const incompleteTasks = tasks.filter(
    (task) =>
      task.status !== "DONE" &&
      isWithinPeriod(task.dueDate, period) &&
      !delayedTaskIds.has(task.id),
  );
  const totalTasks =
    completedTasks.length + incompleteTasks.length + delayedTasks.length;
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks.length / totalTasks) * 100);

  return {
    completedTasks,
    incompleteTasks,
    delayedTasks,
    completionRate,
    totalTasks,
  };
}

export function listReviews(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    include: {
      goal: true,
    },
    orderBy: [{ periodStart: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getWeeklyReviewData(
  userId: string,
  goalId: string,
  now = new Date(),
  customPeriod?: Partial<ReviewPeriod>,
) {
  const currentWeek = getCurrentWeekRange(now);
  const { start, end } =
    customPeriod?.start && customPeriod?.end
      ? normalizePeriod(customPeriod.start, customPeriod.end)
      : normalizePeriod(currentWeek.start, currentWeek.end);

  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    include: {
      tasks: {
        where: {
          userId,
          OR: [
            {
              dueDate: {
                gte: start,
                lte: end,
              },
            },
            {
              completedAt: {
                gte: start,
                lte: end,
              },
            },
            {
              status: "DELAYED",
              dueDate: {
                lte: end,
              },
            },
          ],
        },
        orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
      },
      reviews: {
        where: {
          userId,
          type: "GOAL_WEEKLY",
          periodStart: start,
          periodEnd: end,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!goal) {
    return null;
  }

  const {
    completedTasks,
    completionRate,
    delayedTasks,
    incompleteTasks,
    totalTasks,
  } = classifyTasks(goal.tasks, { start, end });

  return {
    goal,
    periodStart: start,
    periodEnd: end,
    completedTasks,
    incompleteTasks,
    delayedTasks,
    completionRate,
    totalTasks,
    latestReview: goal.reviews[0] ?? null,
  };
}

export async function getProjectWeeklyReviewData(
  userId: string,
  now = new Date(),
) {
  const currentWeek = getCurrentWeekRange(now);
  const { start, end } = normalizePeriod(currentWeek.start, currentWeek.end);
  const [tasks, latestReview] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId,
        OR: [
          {
            dueDate: {
              gte: start,
              lte: end,
            },
          },
          {
            completedAt: {
              gte: start,
              lte: end,
            },
          },
        ],
      },
      include: {
        goal: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
    }),
    prisma.review.findFirst({
      where: {
        userId,
        goalId: null,
        type: "PROJECT_WEEKLY",
        periodStart: start,
        periodEnd: end,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const {
    completedTasks,
    completionRate,
    delayedTasks,
    incompleteTasks,
    totalTasks,
  } = classifyTasks(tasks, { start, end });

  return {
    periodStart: start,
    periodEnd: end,
    completedTasks,
    incompleteTasks,
    delayedTasks,
    completionRate,
    totalTasks,
    latestReview,
  };
}

export async function getGoalCompletionReviewData(
  userId: string,
  goalId: string,
  now = new Date(),
) {
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    include: {
      tasks: {
        orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
      },
      reviews: {
        where: {
          userId,
          type: "GOAL_COMPLETION",
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!goal) {
    return null;
  }

  const periodStart = goal.startDate ?? goal.createdAt;
  const periodEnd = goal.targetDate ?? now;
  const normalizedPeriod = normalizePeriod(periodStart, periodEnd);
  const {
    completedTasks,
    completionRate,
    delayedTasks,
    incompleteTasks,
    totalTasks,
  } = classifyTasks(goal.tasks, normalizedPeriod);

  return {
    goal,
    periodStart: normalizedPeriod.start,
    periodEnd: normalizedPeriod.end,
    completedTasks,
    incompleteTasks,
    delayedTasks,
    completionRate,
    totalTasks,
    latestReview: goal.reviews[0] ?? null,
  };
}

export async function createReview({
  blockers,
  goalId,
  userId,
  nextActions,
  content,
  periodEnd: inputPeriodEnd,
  periodStart: inputPeriodStart,
  summary,
  type,
  wins,
  now = new Date(),
}: {
  blockers?: string | null;
  goalId?: string | null;
  userId: string;
  nextActions?: string | null;
  content?: string;
  periodEnd?: Date;
  periodStart?: Date;
  summary?: string;
  type?: ReviewType;
  wins?: string | null;
  now?: Date;
}) {
  const currentWeek = getCurrentWeekRange(now);
  const reviewGoalId = goalId ?? null;
  const reviewType =
    type ?? (reviewGoalId ? "GOAL_WEEKLY" : "PROJECT_WEEKLY");
  const targetGoal = reviewGoalId
    ? await prisma.goal.findFirst({
        where: { id: reviewGoalId, userId },
      })
    : null;

  if (reviewGoalId && !targetGoal) {
    throw new ResourceNotFoundError("目标不存在");
  }

  const completionGoal =
    reviewType === "GOAL_COMPLETION" && reviewGoalId
      ? targetGoal
      : null;
  const defaultPeriodStart =
    completionGoal?.startDate ?? completionGoal?.createdAt ?? currentWeek.start;
  const defaultPeriodEnd =
    reviewType === "GOAL_COMPLETION" ? now : currentWeek.end;
  const { start: periodStart, end: periodEnd } = normalizePeriod(
    inputPeriodStart ?? defaultPeriodStart,
    inputPeriodEnd ?? defaultPeriodEnd,
  );
  const reviewSummary = summary ?? content ?? "";
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      goalId: reviewGoalId,
      type: reviewType,
      ...(reviewType === "GOAL_COMPLETION"
        ? {}
        : {
            periodStart,
            periodEnd,
          }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingReview) {
    return prisma.review.update({
      where: {
        id: existingReview.id,
      },
      data: {
        blockers,
        nextActions,
        periodStart,
        periodEnd,
        summary: reviewSummary,
        wins,
      },
    });
  }

  return prisma.review.create({
    data: {
      userId,
      goalId: reviewGoalId,
      type: reviewType,
      periodStart,
      periodEnd,
      summary: reviewSummary,
      wins,
      blockers,
      nextActions,
    },
  });
}

export async function deleteReview(userId: string, id: string) {
  const result = await prisma.review.deleteMany({
    where: { id, userId },
  });

  if (result.count === 0) {
    throw new ResourceNotFoundError("复盘记录不存在");
  }

  return result;
}

export function deleteAllReviews(userId: string) {
  return prisma.review.deleteMany({
    where: { userId },
  });
}
