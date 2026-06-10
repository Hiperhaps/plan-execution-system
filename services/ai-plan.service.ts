import { createDeepSeekChatCompletion } from "@/lib/deepseek";
import { prisma } from "@/lib/prisma";
import { parseGeneratedPlan } from "./ai-plan-parser";
import type {
  AiPlanAdjustment,
  AiPlanInput,
  GeneratedPlan,
} from "./ai-plan.schema";

export {
  aiPlanInputSchema,
  generatedPlanSchema,
  saveGeneratedPlanSchema,
  type AiPlanAdjustment,
  type AiPlanInput,
  type GeneratedPlan,
} from "./ai-plan.schema";
export { AiPlanFormatError } from "./ai-plan-parser";

function parseDate(value?: string) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

function getDifficultyLabel(difficulty: GeneratedPlan["phases"][number]["tasks"][number]["difficulty"]) {
  const labels = {
    EASY: "低",
    MEDIUM: "中",
    HARD: "高",
  };

  return labels[difficulty];
}

function buildTaskDescription(
  task: GeneratedPlan["phases"][number]["tasks"][number],
) {
  return [
    task.description,
    "",
    `难度：${getDifficultyLabel(task.difficulty)}`,
    `预计耗时：${task.estimatedHours} 小时`,
    task.isReviewTask ? "类型：复盘节点" : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function getAdjustmentInstruction(adjustment?: AiPlanAdjustment) {
  const instructions: Record<AiPlanAdjustment, string> = {
    REGENERATE:
      "重新生成一版计划：保持目标和约束不变，但换一种阶段划分和任务安排，避免与上一版过于相似。",
    SHORTEN:
      "缩短计划：压缩阶段和任务，只保留最关键路径，减少非必要准备工作，但仍要保留复盘节点。",
    RELAX:
      "放宽计划：降低每周负载和任务密度，给学习、缓冲和延期处理留出空间，不要安排得太满。",
    ADD_DETAIL:
      "增加任务细节：保留合理任务数量，但让每个任务说明更具体，明确产出物、执行边界和完成标准。",
    REDUCE_TASKS:
      "减少任务数量：合并相近任务，减少碎片化行动项，优先保留高价值任务和复盘节点。",
    THEORY_FOCUSED:
      "偏重理论学习：增加概念理解、资料学习、知识整理类任务，实践任务只保留必要验证。",
    PRACTICE_FOCUSED:
      "偏重实践执行：增加动手实现、输出作品、验证反馈类任务，理论学习只保留必要前置。",
  };

  return adjustment ? instructions[adjustment] : "首次生成计划：在可执行和不过载之间取得平衡。";
}

export async function generatePlanDraft(
  input: AiPlanInput,
): Promise<GeneratedPlan> {
  const content = await createDeepSeekChatCompletion({
    responseFormat: { type: "json_object" },
    maxTokens: 4096,
    messages: [
      {
        role: "system",
        content:
          "你是一个务实的执行计划教练。你必须只输出严格 JSON，不要输出 Markdown、解释文字或代码块。输出必须能通过 Zod strict object 校验。",
      },
      {
        role: "user",
        content: [
          "请根据以下信息生成一个可执行计划 JSON。",
          `目标：${input.goal}`,
          `截止日期：${input.deadline}`,
          `每周可投入时间：${input.weeklyHours} 小时`,
          `偏好说明：${input.preference || "无"}`,
          `本次调整要求：${getAdjustmentInstruction(input.adjustment)}`,
          "",
          "计划要求：",
          "1. 充分考虑用户目标、截止日期、每周可投入时间和用户偏好。",
          "2. 必须做阶段划分，每个阶段要有明确 objective、startDate、endDate。",
          "3. 每个任务必须包含 difficulty、estimatedHours、dueDate、priority、isReviewTask。",
          "4. difficulty 只能是 EASY、MEDIUM、HARD。",
          "5. priority 只能是 LOW、MEDIUM、HIGH。",
          "6. estimatedHours 必须是数字，不要写字符串，不要带单位。",
          "7. 每周不要安排过满；每周任务预计耗时总量建议不超过用户每周可投入时间的 80%。",
          "8. 必须包含至少一个复盘节点任务，并将该任务 isReviewTask 设置为 true。",
          "9. 复盘节点可以安排在阶段末或每 1-2 周一次，用于检查完成情况、延期原因和下周调整。",
          "10. 所有日期必须是 YYYY-MM-DD，不能晚于用户截止日期。",
          "11. 任务数量保持 MVP 可执行，不要为了显得完整而堆太多任务。",
          "",
          "JSON 格式必须符合这个结构：",
          JSON.stringify(
            {
              goalTitle: "目标标题",
              goalDescription: "目标说明",
              targetDate: "YYYY-MM-DD",
              planningNotes:
                "简要说明阶段安排、每周负载控制和关键取舍。",
              phases: [
                {
                  title: "阶段名称",
                  objective: "该阶段要达成的具体结果",
                  startDate: "YYYY-MM-DD",
                  endDate: "YYYY-MM-DD",
                  tasks: [
                    {
                      title: "任务标题",
                      description: "任务说明",
                      priority: "MEDIUM",
                      difficulty: "MEDIUM",
                      estimatedHours: 2,
                      dueDate: "YYYY-MM-DD",
                      isReviewTask: false,
                    },
                    {
                      title: "阶段复盘",
                      description:
                        "检查本阶段完成情况、延期原因和下一阶段调整。",
                      priority: "MEDIUM",
                      difficulty: "EASY",
                      estimatedHours: 1,
                      dueDate: "YYYY-MM-DD",
                      isReviewTask: true,
                    },
                  ],
                },
              ],
            },
            null,
            2,
          ),
          "",
          "严格输出要求：只输出一个 JSON object；字段名必须完全一致；不要增加额外字段；不要省略任何必填字段。",
        ].join("\n"),
      },
    ],
  });

  return parseGeneratedPlan(content);
}

export async function saveGeneratedPlan(plan: GeneratedPlan) {
  return prisma.goal.create({
    data: {
      title: plan.goalTitle,
      description: plan.goalDescription || null,
      status: "ACTIVE",
      targetDate: parseDate(plan.targetDate),
      tasks: {
        create: plan.phases.flatMap((phase, phaseIndex) =>
          phase.tasks.map((task, taskIndex) => ({
            title: task.title,
            description: buildTaskDescription(task),
            phase: phase.title,
            priority: task.priority,
            status: "TODO",
            dueDate: parseDate(task.dueDate),
            estimatedHours: task.estimatedHours,
            order: phaseIndex * 100 + taskIndex,
          })),
        ),
      },
    },
    include: {
      tasks: true,
    },
  });
}
