import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-response";
import { requireApiUserId } from "@/lib/auth-session";
import { deleteReview } from "@/services/review.service";

type RouteContext = {
  params: Promise<{
    reviewId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const userId = await requireApiUserId();
    const { reviewId } = await context.params;
    await deleteReview(userId, reviewId);

    return NextResponse.json({
      data: {
        id: reviewId,
      },
    });
  } catch (error) {
    return handleApiError(error, {
      fallbackMessage: "删除复盘失败",
      notFoundMessage: "复盘记录不存在",
    });
  }
}
