import { NextResponse } from "next/server";
import {
  handleApiError,
  notFoundResponse,
} from "@/lib/api-response";
import { reviewGoalSchema } from "@/lib/validators";
import { generateWeeklyReviewSuggestion } from "@/services/ai-review.service";
import { getWeeklyReviewData } from "@/services/review.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = reviewGoalSchema.parse(body);
    const data = await getWeeklyReviewData(input.goalId);

    if (!data) {
      return notFoundResponse("目标不存在");
    }

    const content = await generateWeeklyReviewSuggestion({
      goalTitle: data.goal.title,
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
    return handleApiError(error, { fallbackMessage: "生成复盘建议失败" });
  }
}
