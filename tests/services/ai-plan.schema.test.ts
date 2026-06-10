import { describe, expect, it } from "vitest";
import {
  AiPlanFormatError,
  parseGeneratedPlan,
} from "@/services/ai-plan-parser";
import {
  aiPlanInputSchema,
  generatedPlanSchema,
  saveGeneratedPlanSchema,
} from "@/services/ai-plan.schema";

describe("AI plan schema validation", () => {
  it("validates AI plan input and coerces weekly hours", () => {
    const result = aiPlanInputSchema.parse({
      goal: "  完成计划系统  ",
      deadline: "2026-07-01",
      weeklyHours: "8",
      adjustment: "ADD_DETAIL",
    });

    expect(result).toEqual({
      goal: "完成计划系统",
      deadline: "2026-07-01",
      weeklyHours: 8,
      adjustment: "ADD_DETAIL",
    });
  });

  it("accepts a strict generated plan with at least one review task", () => {
    expect(generatedPlanSchema.parse(validPlan())).toEqual(validPlan());
    expect(saveGeneratedPlanSchema.parse({ plan: validPlan() })).toEqual({
      plan: validPlan(),
    });
  });

  it("rejects generated plans without a review task", () => {
    const plan = validPlan();
    plan.phases[0].tasks[0].isReviewTask = false;

    const result = generatedPlanSchema.safeParse(plan);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["phases"]);
    }
  });

  it("rejects extra fields from AI output", () => {
    const result = generatedPlanSchema.safeParse({
      ...validPlan(),
      extra: "not allowed",
    });

    expect(result.success).toBe(false);
  });

  it("parses generated plan JSON wrapped in a markdown code fence", () => {
    const parsed = parseGeneratedPlan(
      ["```json", JSON.stringify(validPlan()), "```"].join("\n"),
    );

    expect(parsed.goalTitle).toBe("完成计划系统");
  });

  it("throws a format error for invalid generated plan JSON", () => {
    expect(() => parseGeneratedPlan("{ invalid json")).toThrow(
      AiPlanFormatError,
    );
    expect(() =>
      parseGeneratedPlan(JSON.stringify({ ...validPlan(), phases: [] })),
    ).toThrow(AiPlanFormatError);
  });
});

function validPlan() {
  return {
    goalTitle: "完成计划系统",
    goalDescription: "实现核心计划执行功能",
    targetDate: "2026-07-01",
    planningNotes: "每周控制在 8 小时以内，阶段末安排复盘。",
    phases: [
      {
        title: "第一阶段",
        objective: "完成基础功能",
        startDate: "2026-06-10",
        endDate: "2026-06-20",
        tasks: [
          {
            title: "阶段复盘",
            description: "检查完成情况并调整计划。",
            priority: "MEDIUM",
            difficulty: "EASY",
            estimatedHours: 1,
            dueDate: "2026-06-20",
            isReviewTask: true,
          },
        ],
      },
    ],
  };
}
