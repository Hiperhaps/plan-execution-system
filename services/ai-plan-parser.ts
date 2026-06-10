import { generatedPlanSchema, type GeneratedPlan } from "./ai-plan.schema";

export class AiPlanFormatError extends Error {
  constructor() {
    super("AI 返回的计划格式不正确，请重新生成。");
    this.name = "AiPlanFormatError";
  }
}

function extractJsonObject(content: string) {
  const trimmed = content.trim();
  const fencedMatch = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  const candidate = fencedMatch?.[1]?.trim() ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new AiPlanFormatError();
  }

  return candidate.slice(start, end + 1);
}

export function parseGeneratedPlan(content: string): GeneratedPlan {
  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJsonObject(content));
  } catch {
    throw new AiPlanFormatError();
  }

  const result = generatedPlanSchema.safeParse(parsed);

  if (!result.success) {
    throw new AiPlanFormatError();
  }

  return result.data;
}
