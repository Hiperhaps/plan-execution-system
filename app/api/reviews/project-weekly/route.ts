import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-response";
import { requireApiUserId } from "@/lib/auth-session";
import { getProjectWeeklyReviewData } from "@/services/review.service";

function toTaskPayload(
  tasks: Awaited<
    ReturnType<typeof getProjectWeeklyReviewData>
  >["completedTasks"],
) {
  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    goalTitle: task.goal.title,
  }));
}

export async function GET() {
  try {
    const userId = await requireApiUserId();
    const data = await getProjectWeeklyReviewData(userId);

    return NextResponse.json({
      data: {
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
    return handleApiError(error, { fallbackMessage: "获取全项目复盘数据失败" });
  }
}
