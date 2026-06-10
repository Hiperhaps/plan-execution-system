import { z } from "zod";
import { GOAL_STATUSES } from "@/lib/goal-options";
import { REVIEW_TYPES } from "@/lib/review-options";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/task-options";

export const goalStatusSchema = z.enum(GOAL_STATUSES);
export const taskStatusSchema = z.enum(TASK_STATUSES);
export const taskPrioritySchema = z.enum(TASK_PRIORITIES);
export const reviewTypeSchema = z.enum(REVIEW_TYPES);

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional();

const optionalDateSchema = z
  .union([z.string().trim(), z.null()])
  .optional()
  .transform((value) => {
    if (typeof value === "undefined") {
      return undefined;
    }

    if (!value) {
      return null;
    }

    return new Date(value);
  })
  .refine(
    (value) =>
      typeof value === "undefined" ||
      value === null ||
      !Number.isNaN(value.getTime()),
    {
      message: "请输入有效日期",
    },
  );

export const createGoalSchema = z.object({
  title: z.string().trim().min(1, "请输入目标标题"),
  description: optionalTextSchema,
  status: goalStatusSchema.default("ACTIVE"),
});

export const updateGoalSchema = z.object({
  title: z.string().trim().min(1, "请输入目标标题").optional(),
  description: optionalTextSchema,
  status: goalStatusSchema.optional(),
});

export const createTaskSchema = z.object({
  goalId: z.string().min(1),
  title: z.string().trim().min(1, "请输入任务标题"),
  description: optionalTextSchema,
  status: taskStatusSchema.default("TODO"),
  priority: taskPrioritySchema.default("MEDIUM"),
  dueDate: optionalDateSchema,
  estimatedHours: z.coerce.number().positive().max(40).nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, "请输入任务标题").optional(),
  description: optionalTextSchema,
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: optionalDateSchema,
  estimatedHours: z.coerce.number().positive().max(40).nullable().optional(),
});

export const reviewGoalSchema = z.object({
  goalId: z.string().min(1, "请选择目标"),
});

export const weeklyReviewQuerySchema = z
  .object({
    goalId: z.string().min(1, "请选择目标"),
    periodStart: optionalDateSchema,
    periodEnd: optionalDateSchema,
  })
  .refine(
    (value) =>
      !value.periodStart ||
      !value.periodEnd ||
      value.periodStart <= value.periodEnd,
    {
      message: "复盘开始日期不能晚于结束日期",
      path: ["periodEnd"],
    },
  );

export const saveReviewSchema = z.object({
  goalId: z.string().min(1, "请选择目标").nullable().optional(),
  content: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  wins: optionalTextSchema,
  blockers: optionalTextSchema,
  nextActions: optionalTextSchema,
  periodStart: optionalDateSchema,
  periodEnd: optionalDateSchema,
  type: reviewTypeSchema.optional(),
}).refine(
  (value) =>
    Boolean(value.content?.trim()) ||
    Boolean(value.summary?.trim()) ||
    Boolean(value.wins) ||
    Boolean(value.blockers) ||
    Boolean(value.nextActions),
  {
    message: "请输入复盘内容",
    path: ["summary"],
  },
).refine(
  (value) =>
    !value.periodStart ||
    !value.periodEnd ||
    value.periodStart <= value.periodEnd,
  {
    message: "复盘开始日期不能晚于结束日期",
    path: ["periodEnd"],
  },
);
