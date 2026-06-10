import { NextResponse } from "next/server";
import {
  handleApiError,
  notFoundResponse,
} from "@/lib/api-response";
import { updateTaskSchema } from "@/lib/validators";
import {
  deleteTask,
  getTaskById,
  updateTask,
} from "@/services/task.service";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    const task = await getTaskById(taskId);

    if (!task) {
      return notFoundResponse("任务不存在");
    }

    return NextResponse.json({
      data: task,
    });
  } catch (error) {
    return handleApiError(error, { fallbackMessage: "获取任务失败" });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    const body = await request.json();
    const input = updateTaskSchema.parse(body);
    const completedAt =
      input.status === "DONE"
        ? new Date()
        : input.status
          ? null
          : undefined;
    const task = await updateTask(taskId, {
      ...input,
      completedAt,
    });

    return NextResponse.json({
      data: task,
    });
  } catch (error) {
    return handleApiError(error, {
      fallbackMessage: "更新任务失败",
      notFoundMessage: "任务不存在",
    });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    await deleteTask(taskId);

    return NextResponse.json({
      data: { id: taskId },
    });
  } catch (error) {
    return handleApiError(error, {
      fallbackMessage: "删除任务失败",
      notFoundMessage: "任务不存在",
    });
  }
}
