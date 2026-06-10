import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-response";
import { saveReviewSchema } from "@/lib/validators";
import {
  createReview,
  deleteAllReviews,
  listReviews,
} from "@/services/review.service";

export async function GET() {
  try {
    const reviews = await listReviews();

    return NextResponse.json({
      data: reviews,
    });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "获取复盘记录失败" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = saveReviewSchema.parse(body);
    if (input.type === "GOAL_COMPLETION" && !input.goalId) {
      return NextResponse.json(
        {
          error: {
            message: "目标完成总结必须选择目标",
          },
        },
        { status: 400 },
      );
    }

    const review = await createReview({
      blockers: input.blockers,
      goalId: input.goalId,
      content: input.content,
      nextActions: input.nextActions,
      periodEnd: input.periodEnd ?? undefined,
      periodStart: input.periodStart ?? undefined,
      summary: input.summary,
      type: input.type,
      wins: input.wins,
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      fallbackMessage: "保存复盘记录失败",
      notFoundMessage: "目标不存在",
    });
  }
}

export async function DELETE() {
  try {
    const result = await deleteAllReviews();

    return NextResponse.json({
      data: {
        count: result.count,
      },
    });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "删除全部复盘失败" });
  }
}
