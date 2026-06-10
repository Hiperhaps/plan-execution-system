import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-response";
import { generateWeeklyReviewSuggestion } from "@/services/ai-review.service";
import { getProjectWeeklyReviewData } from "@/services/review.service";

export async function POST() {
  try {
    const data = await getProjectWeeklyReviewData();
    const content = await generateWeeklyReviewSuggestion({
      goalTitle: "全部目标",
      completedTasks: data.completedTasks,
      incompleteTasks: data.incompleteTasks,
      delayedTasks: data.delayedTasks,
      scope: "project",
    });

    return NextResponse.json({
      data: {
        content,
      },
    });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "生成全项目复盘失败" });
  }
}
