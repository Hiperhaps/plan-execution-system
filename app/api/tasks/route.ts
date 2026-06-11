import { NextResponse } from "next/server";
import {
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { requireApiUserId } from "@/lib/auth-session";
import { createTaskSchema } from "@/lib/validators";
import { createTask, listTasksByGoal } from "@/services/task.service";

export async function GET(request: Request) {
  try {
    const userId = await requireApiUserId();
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get("goalId");

    if (!goalId) {
      return badRequestResponse("缺少 goalId");
    }

    const tasks = await listTasksByGoal(userId, goalId);

    return NextResponse.json({
      data: tasks,
    });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "获取任务列表失败" });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireApiUserId();
    const body = await request.json();
    const input = createTaskSchema.parse(body);
    const task = await createTask(userId, {
      goalId: input.goalId,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      estimatedHours: input.estimatedHours,
      completedAt: input.status === "DONE" ? new Date() : null,
    });

    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    return handleApiError(error, {
      fallbackMessage: "创建任务失败",
      notFoundMessage: "目标不存在",
    });
  }
}
