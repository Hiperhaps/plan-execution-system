import { z } from "zod";

export const AI_PLAN_ADJUSTMENTS = [
  "REGENERATE",
  "SHORTEN",
  "RELAX",
  "ADD_DETAIL",
  "REDUCE_TASKS",
  "THEORY_FOCUSED",
  "PRACTICE_FOCUSED",
] as const;

function isValidDateString(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const dateStringSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式必须为 YYYY-MM-DD")
  .refine(isValidDateString, "请输入有效日期");

const optionalDateStringSchema = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  dateStringSchema.optional(),
);

export const aiPlanInputSchema = z.object({
  goal: z.string().trim().min(1, "请输入目标"),
  deadline: dateStringSchema,
  weeklyHours: z.coerce
    .number()
    .min(1, "每周投入时间至少为 1 小时")
    .max(168, "每周投入时间不能超过 168 小时"),
  preference: z.string().trim().optional(),
  adjustment: z.enum(AI_PLAN_ADJUSTMENTS).optional(),
});

export const generatedPlanTaskSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    estimatedHours: z.number().positive().max(40),
    dueDate: dateStringSchema,
    isReviewTask: z.boolean(),
  })
  .strict();

export const generatedPlanPhaseSchema = z
  .object({
    title: z.string().trim().min(1),
    objective: z.string().trim().min(1),
    startDate: dateStringSchema,
    endDate: dateStringSchema,
    tasks: z.array(generatedPlanTaskSchema).min(1),
  })
  .strict();

export const generatedPlanSchema = z
  .object({
    goalTitle: z.string().trim().min(1),
    goalDescription: z.string().trim().min(1),
    targetDate: optionalDateStringSchema,
    planningNotes: z.string().trim().min(1),
    phases: z.array(generatedPlanPhaseSchema).min(1),
  })
  .strict()
  .refine(
    (plan) =>
      plan.phases.some((phase) =>
        phase.tasks.some((task) => task.isReviewTask),
      ),
    {
      message: "计划中必须包含至少一个复盘节点",
      path: ["phases"],
    },
  );

export const saveGeneratedPlanSchema = z
  .object({
    plan: generatedPlanSchema,
  })
  .strict();

export type AiPlanInput = z.infer<typeof aiPlanInputSchema>;
export type GeneratedPlan = z.infer<typeof generatedPlanSchema>;
export type AiPlanAdjustment = (typeof AI_PLAN_ADJUSTMENTS)[number];
