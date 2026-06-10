"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getRequestErrorMessage,
  requestJson,
} from "@/lib/http-client";
import {
  getDelayDateInputValue,
  type TaskDelayDays,
} from "@/lib/task-delay-options";

export function useCompleteTask() {
  const router = useRouter();
  const [actionTaskId, setActionTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function completeTask(taskId: string) {
    setError("");
    setActionTaskId(taskId);

    try {
      await requestJson<{ data: unknown }>(
        `/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "DONE" }),
        },
        "标记任务完成失败，请稍后再试。",
      );

      router.refresh();
    } catch (error) {
      setError(getRequestErrorMessage(error, "标记任务完成失败，请稍后再试。"));
    } finally {
      setActionTaskId(null);
    }
  }

  async function delayTask(taskId: string, days: TaskDelayDays) {
    setError("");
    setActionTaskId(taskId);

    try {
      await requestJson<{ data: unknown }>(
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
        "延期任务失败，请稍后再试。",
      );

      router.refresh();
    } catch (error) {
      setError(getRequestErrorMessage(error, "延期任务失败，请稍后再试。"));
    } finally {
      setActionTaskId(null);
    }
  }

  return {
    actionTaskId,
    completeTask,
    delayTask,
    error,
  };
}
