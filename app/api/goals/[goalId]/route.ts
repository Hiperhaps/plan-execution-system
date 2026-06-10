import { NextResponse } from "next/server";
import {
  handleApiError,
  notFoundResponse,
} from "@/lib/api-response";
import { updateGoalSchema } from "@/lib/validators";
import {
  deleteGoal,
  getGoalById,
  updateGoal,
} from "@/services/goal.service";

type RouteContext = {
  params: Promise<{
    goalId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { goalId } = await context.params;
    const goal = await getGoalById(goalId);

    if (!goal) {
      return notFoundResponse("目标不存在");
    }

    return NextResponse.json({
      data: goal,
    });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "获取目标失败" });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { goalId } = await context.params;
    const body = await request.json();
    const input = updateGoalSchema.parse(body);
    const goal = await updateGoal(goalId, {
      ...input,
      description:
        typeof input.description === "string"
          ? input.description || null
          : input.description,
    });

    return NextResponse.json({
      data: goal,
    });
  } catch (error) {
    return handleApiError(error, {
      fallbackMessage: "更新目标失败",
      notFoundMessage: "目标不存在",
    });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { goalId } = await context.params;
    await deleteGoal(goalId);

    return NextResponse.json({
      data: { id: goalId },
    });
  } catch (error) {
    return handleApiError(error, {
      fallbackMessage: "删除目标失败",
      notFoundMessage: "目标不存在",
    });
  }
}
