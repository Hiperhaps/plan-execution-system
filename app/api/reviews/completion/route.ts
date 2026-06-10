import { NextResponse } from "next/server";
import {
  handleApiError,
  notFoundResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { reviewGoalSchema } from "@/lib/validators";
import { getGoalCompletionReviewData } from "@/services/review.service";

function toTaskPayload(
  tasks: NonNullable<
    Awaited<ReturnType<typeof getGoalCompletionReviewData>>
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
    const { searchParams } = new URL(request.url);
    const parsed = reviewGoalSchema.safeParse({
      goalId: searchParams.get("goalId"),
    });

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const data = await getGoalCompletionReviewData(parsed.data.goalId);

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
    return handleApiError(error, { fallbackMessage: "获取目标完成总结数据失败" });
  }
}
