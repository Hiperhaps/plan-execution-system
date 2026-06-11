import { NextResponse } from "next/server";
import {
  handleApiError,
  notFoundResponse,
} from "@/lib/api-response";
import { requireApiUserId } from "@/lib/auth-session";
import { reviewGoalSchema } from "@/lib/validators";
import { generateGoalCompletionReviewSuggestion } from "@/services/ai-review.service";
import { getGoalCompletionReviewData } from "@/services/review.service";

export async function POST(request: Request) {
  try {
    const userId = await requireApiUserId();
    const body = await request.json();
    const input = reviewGoalSchema.parse(body);
    const data = await getGoalCompletionReviewData(userId, input.goalId);

    if (!data) {
      return notFoundResponse("目标不存在");
    }

    const content = await generateGoalCompletionReviewSuggestion({
      goalTitle: data.goal.title,
      goalDescription: data.goal.description,
      completedTasks: data.completedTasks,
      incompleteTasks: data.incompleteTasks,
      delayedTasks: data.delayedTasks,
    });

    return NextResponse.json({
      data: {
        content,
      },
    });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "生成目标完成总结失败" });
  }
}
