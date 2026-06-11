import { NextResponse } from "next/server";
import {
  handleApiError,
} from "@/lib/api-response";
import { requireApiUserId } from "@/lib/auth-session";
import {
  saveGeneratedPlan,
  saveGeneratedPlanSchema,
} from "@/services/ai-plan.service";

export async function POST(request: Request) {
  try {
    const userId = await requireApiUserId();
    const body = await request.json();
    const input = saveGeneratedPlanSchema.parse(body);
    const goal = await saveGeneratedPlan(userId, input.plan);

    return NextResponse.json(
      {
        data: goal,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "保存计划失败" });
  }
}
