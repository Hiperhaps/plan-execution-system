import type { Task } from "@prisma/client";
import { createDeepSeekChatCompletion } from "@/lib/deepseek";

type ReviewTask = Task & {
  goal?: {
    title: string;
  };
};

type GenerateWeeklyReviewInput = {
  goalTitle: string;
  completedTasks: ReviewTask[];
  incompleteTasks: ReviewTask[];
  delayedTasks: ReviewTask[];
  scope?: "goal" | "project";
};

type GenerateGoalCompletionReviewInput = {
  goalTitle: string;
  goalDescription?: string | null;
  completedTasks: ReviewTask[];
  incompleteTasks: ReviewTask[];
  delayedTasks: ReviewTask[];
};

function formatTaskList(tasks: ReviewTask[]) {
  if (tasks.length === 0) {
    return "无";
  }

  return tasks
    .map((task) =>
      [
        `- 标题：${task.title}`,
        `状态：${task.status}`,
        `优先级：${task.priority}`,
        `截止日期：${task.dueDate ? task.dueDate.toISOString().slice(0, 10) : "未设置"}`,
        task.goal ? `所属目标：${task.goal.title}` : null,
        task.description ? `说明：${task.description}` : null,
      ]
        .filter(Boolean)
        .join("；"),
    )
    .join("\n");
}

export async function generateWeeklyReviewSuggestion({
  goalTitle,
  completedTasks,
  incompleteTasks,
  delayedTasks,
  scope = "goal",
}: GenerateWeeklyReviewInput) {
  const tasks = [
    `${scope === "project" ? "复盘范围" : "目标"}：${goalTitle}`,
    "",
    "完成任务：",
    formatTaskList(completedTasks),
    "",
    "未完成任务：",
    formatTaskList(incompleteTasks),
    "",
    "延期任务：",
    formatTaskList(delayedTasks),
  ].join("\n");

  const content = await createDeepSeekChatCompletion({
    maxTokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          "你是一个计划执行教练。",
          "请根据以下任务完成情况，生成一份简洁的周复盘。",
          "",
          "要求：",
          "1. 总结本周完成情况",
          "2. 分析延期原因",
          "3. 给出下周调整建议",
          "4. 语气务实，不要鸡汤",
          scope === "project"
            ? "5. 全项目复盘要关注多个目标之间的节奏、阻塞和优先级取舍"
            : "",
          "",
          "任务数据：",
          tasks,
        ].join("\n"),
      },
    ],
  });

  return content.trim();
}

export async function generateGoalCompletionReviewSuggestion({
  goalTitle,
  goalDescription,
  completedTasks,
  incompleteTasks,
  delayedTasks,
}: GenerateGoalCompletionReviewInput) {
  const tasks = [
    `目标：${goalTitle}`,
    goalDescription ? `目标说明：${goalDescription}` : null,
    "",
    "已完成任务：",
    formatTaskList(completedTasks),
    "",
    "未完成任务：",
    formatTaskList(incompleteTasks),
    "",
    "延期任务：",
    formatTaskList(delayedTasks),
  ]
    .filter((item) => item !== null)
    .join("\n");

  const content = await createDeepSeekChatCompletion({
    maxTokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          "你是一个计划执行教练。",
          "请根据以下目标和任务完成情况，生成一份项目完成后的总结复盘。",
          "",
          "要求：",
          "1. 总结这个目标从开始到结束的完成情况",
          "2. 提炼做得好的执行策略",
          "3. 分析未完成、延期或反复调整的原因",
          "4. 给出以后做类似目标时可复用的经验和需要避免的问题",
          "5. 如果仍有未完成任务，要明确后续收尾建议",
          "6. 语气务实，不要鸡汤",
          "",
          "任务数据：",
          tasks,
        ].join("\n"),
      },
    ],
  });

  return content.trim();
}
