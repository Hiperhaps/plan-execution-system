import { NextResponse } from "next/server";
import {
  handleApiError,
} from "@/lib/api-response";
import { requireApiUserId } from "@/lib/auth-session";
import { createGoalSchema } from "@/lib/validators";
import { createGoal, listGoals } from "@/services/goal.service";

export async function GET() {
  try {
    const userId = await requireApiUserId();
    const goals = await listGoals(userId);

    return NextResponse.json({
      data: goals,
    });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "获取目标列表失败" });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireApiUserId();
    const body = await request.json();
    const input = createGoalSchema.parse(body);
    const goal = await createGoal(userId, {
      title: input.title,
      description: input.description || null,
      status: input.status,
    });

    return NextResponse.json({ data: goal }, { status: 201 });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "创建目标失败" });
  }
}
