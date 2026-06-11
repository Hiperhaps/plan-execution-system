import { NextResponse } from "next/server";
import {
  handleApiError,
  notFoundResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { requireApiUserId } from "@/lib/auth-session";
import { weeklyReviewQuerySchema } from "@/lib/validators";
import { getWeeklyReviewData } from "@/services/review.service";

function toTaskPayload(
  tasks: NonNullable<
    Awaited<ReturnType<typeof getWeeklyReviewData>>
  >["completedTasks"],
) {
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
  }));
}

export async function GET(request: Request) {
  try {
    const userId = await requireApiUserId();
    const { searchParams } = new URL(request.url);
    const parsed = weeklyReviewQuerySchema.safeParse({
      goalId: searchParams.get("goalId"),
      periodStart: searchParams.get("periodStart"),
      periodEnd: searchParams.get("periodEnd"),
    });

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const data = await getWeeklyReviewData(
      userId,
      parsed.data.goalId,
      new Date(),
      {
        start: parsed.data.periodStart ?? undefined,
        end: parsed.data.periodEnd ?? undefined,
      },
    );

    if (!data) {
      return notFoundResponse("目标不存在");
    }

    return NextResponse.json({
      data: {
        goal: {
          id: data.goal.id,
          title: data.goal.title,
        },
        periodStart: data.periodStart.toISOString(),
        periodEnd: data.periodEnd.toISOString(),
        completedTasks: toTaskPayload(data.completedTasks),
        incompleteTasks: toTaskPayload(data.incompleteTasks),
        delayedTasks: toTaskPayload(data.delayedTasks),
        completionRate: data.completionRate,
        totalTasks: data.totalTasks,
        latestReview: data.latestReview
          ? {
              id: data.latestReview.id,
              summary: data.latestReview.summary,
              wins: data.latestReview.wins,
              blockers: data.latestReview.blockers,
              nextActions: data.latestReview.nextActions,
              createdAt: data.latestReview.createdAt.toISOString(),
              updatedAt: data.latestReview.updatedAt.toISOString(),
            }
          : null,
      },
    });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "获取本周复盘数据失败" });
  }
}
