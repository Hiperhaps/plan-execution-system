import { describe, expect, it } from "vitest";
import {
  createGoalSchema,
  createTaskSchema,
  saveReviewSchema,
  updateTaskSchema,
  weeklyReviewQuerySchema,
} from "@/lib/validators";

describe("Zod validators", () => {
  it("trims goal title, defaults goal status, and normalizes empty description", () => {
    const result = createGoalSchema.parse({
      title: "  完成 MVP  ",
      description: "",
    });

    expect(result).toEqual({
      title: "完成 MVP",
      description: null,
      status: "ACTIVE",
    });
  });

  it("rejects empty goal titles", () => {
    expect(() => createGoalSchema.parse({ title: "" })).toThrow();
  });

  it("defaults task status and priority and parses dates", () => {
    const result = createTaskSchema.parse({
      goalId: "goal-1",
      title: "  设计数据模型  ",
      dueDate: "2026-06-10",
      estimatedHours: "2.5",
    });

    expect(result).toMatchObject({
      goalId: "goal-1",
      title: "设计数据模型",
      status: "TODO",
      priority: "MEDIUM",
      estimatedHours: 2.5,
    });
    expect(result.dueDate).toBeInstanceOf(Date);
  });

  it("rejects invalid task enum values and excessive estimates", () => {
    const result = updateTaskSchema.safeParse({
      status: "STARTED",
      priority: "URGENT",
      estimatedHours: 80,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path.join("."));

      expect(paths).toContain("status");
      expect(paths).toContain("priority");
      expect(paths).toContain("estimatedHours");
    }
  });

  it("requires review content from at least one supported field", () => {
    expect(
      saveReviewSchema.safeParse({
        goalId: "goal-1",
        type: "GOAL_WEEKLY",
      }).success,
    ).toBe(false);

    expect(
      saveReviewSchema.safeParse({
        goalId: "goal-1",
        summary: "本周完成核心页面",
        wins: "",
        type: "GOAL_WEEKLY",
      }).success,
    ).toBe(true);
  });

  it("rejects review periods where start is after end", () => {
    const result = weeklyReviewQuerySchema.safeParse({
      goalId: "goal-1",
      periodStart: "2026-06-12",
      periodEnd: "2026-06-10",
    });

    expect(result.success).toBe(false);
  });
});
