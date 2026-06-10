"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TaskFormState, TaskItem } from "@/components/tasks/types";
import {
  getRequestErrorMessage,
  requestJson,
} from "@/lib/http-client";
import {
  getDelayDateInputValue,
  type TaskDelayDays,
} from "@/lib/task-delay-options";

type SaveTaskInput = {
  goalId: string;
  taskId?: string;
  form: TaskFormState;
};

export function useTaskMutations() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function saveTask({ goalId, taskId, form }: SaveTaskInput) {
    setError("");
    setIsSubmitting(true);

    try {
      const result = await requestJson<{ data: TaskItem }>(
        taskId ? `/api/tasks/${taskId}` : "/api/tasks",
        {
          method: taskId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goalId,
            title: form.title,
            description: form.description,
            status: form.status,
            priority: form.priority,
            dueDate: form.dueDate || null,
          }),
        },
        "保存任务失败",
      );

      router.refresh();
      return result.data;
    } catch (error) {
      setError(getRequestErrorMessage(error, "保存任务失败"));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateTaskStatus(taskId: string, status: string) {
    setError("");

    try {
      const result = await requestJson<{ data: TaskItem }>(
        `/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
        "修改任务状态失败",
      );

      router.refresh();
      return result.data;
    } catch (error) {
      setError(getRequestErrorMessage(error, "修改任务状态失败"));
      return null;
    }
  }

  async function delayTask(taskId: string, days: TaskDelayDays) {
    setError("");

    try {
      const result = await requestJson<{ data: TaskItem }>(
        `/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dueDate: getDelayDateInputValue(days),
            status: "TODO",
          }),
        },
        "延期任务失败",
      );

      router.refresh();
      return result.data;
    } catch (error) {
      setError(getRequestErrorMessage(error, "延期任务失败"));
      return null;
    }
  }

  async function removeTask(taskId: string) {
    setError("");

    try {
      await requestJson<{ data: { id: string } }>(
        `/api/tasks/${taskId}`,
        { method: "DELETE" },
        "删除任务失败",
      );

      router.refresh();
      return true;
    } catch (error) {
      setError(getRequestErrorMessage(error, "删除任务失败"));
      return false;
    }
  }

  return {
    error,
    isSubmitting,
    setError,
    saveTask,
    delayTask,
    updateTaskStatus,
    removeTask,
  };
}
