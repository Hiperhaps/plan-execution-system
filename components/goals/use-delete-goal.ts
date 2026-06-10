"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getRequestErrorMessage,
  requestJson,
} from "@/lib/http-client";

export function useDeleteGoal() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function deleteGoal(goalId: string) {
    setError("");
    setDeletingId(goalId);

    try {
      await requestJson<{ data: { id: string } }>(
        `/api/goals/${goalId}`,
        { method: "DELETE" },
        "删除目标失败",
      );

      router.refresh();
      return true;
    } catch (error) {
      setError(getRequestErrorMessage(error, "删除目标失败"));
      return false;
    } finally {
      setDeletingId(null);
    }
  }

  return {
    deleteGoal,
    deletingId,
    error,
    setError,
  };
}
