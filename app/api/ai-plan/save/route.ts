import { NextResponse } from "next/server";
import {
  handleApiError,
} from "@/lib/api-response";
import {
  saveGeneratedPlan,
  saveGeneratedPlanSchema,
} from "@/services/ai-plan.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = saveGeneratedPlanSchema.parse(body);
    const goal = await saveGeneratedPlan(input.plan);

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
