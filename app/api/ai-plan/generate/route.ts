import { NextResponse } from "next/server";
import {
  handleApiError,
  serverErrorResponse,
} from "@/lib/api-response";
import { requireApiUserId } from "@/lib/auth-session";
import {
  AiPlanFormatError,
  aiPlanInputSchema,
  generatePlanDraft,
} from "@/services/ai-plan.service";

export async function POST(request: Request) {
  try {
    await requireApiUserId();
    const body = await request.json();
    const input = aiPlanInputSchema.parse(body);
    const plan = await generatePlanDraft(input);

    return NextResponse.json({
      data: plan,
    });
  } catch (error) {
    if (error instanceof AiPlanFormatError) {
      return serverErrorResponse(error.message);
    }

    return handleApiError(error, { fallbackMessage: "生成 AI 计划失败" });
  }
}
