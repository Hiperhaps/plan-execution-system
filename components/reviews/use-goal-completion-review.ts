"use client";

import { useEffect, useState } from "react";
import {
  getRequestErrorMessage,
  requestJson,
} from "@/lib/http-client";
import type { GoalCompletionReviewData, GoalOption } from "./types";

type SavedReviewResponse = {
  data: {
    id: string;
    summary: string;
    wins: string | null;
    blockers: string | null;
    nextActions: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export function useGoalCompletionReview(goals: GoalOption[]) {
  const [goalId, setGoalId] = useState(goals[0]?.id ?? "");
  const [completionData, setCompletionData] =
    useState<GoalCompletionReviewData | null>(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!goalId) {
      return;
    }

    let isCurrent = true;

    async function loadCompletionData() {
      setError("");
      setSuccess("");
      setIsLoadingStats(true);

      try {
        const payload = await requestJson<{ data: GoalCompletionReviewData }>(
          `/api/reviews/completion?goalId=${goalId}`,
          { method: "GET" },
          "加载目标完成总结数据失败",
        );

        if (!isCurrent) {
          return;
        }

        setCompletionData(payload.data);
        setContent(payload.data.latestReview?.summary ?? "");
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setCompletionData(null);
        setError(getRequestErrorMessage(error, "加载目标完成总结数据失败"));
      } finally {
        if (isCurrent) {
          setIsLoadingStats(false);
        }
      }
    }

    loadCompletionData();

    return () => {
      isCurrent = false;
    };
  }, [goalId]);

  async function generateReview() {
    if (!goalId) {
      return;
    }

    setError("");
    setSuccess("");
    setIsGenerating(true);

    try {
      const payload = await requestJson<{ data: { content: string } }>(
        "/api/reviews/completion-generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goalId }),
        },
        "生成目标完成总结失败",
      );

      setContent(payload.data.content);
    } catch (error) {
      setError(getRequestErrorMessage(error, "生成目标完成总结失败"));
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveReview() {
    if (!goalId || !content.trim()) {
      setError("请先生成或填写完成总结");
      return;
    }

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const payload = await requestJson<SavedReviewResponse>(
        "/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goalId,
            content,
            type: "GOAL_COMPLETION",
          }),
        },
        "保存目标完成总结失败",
      );

      setCompletionData((current) =>
        current
          ? {
              ...current,
              latestReview: payload.data,
            }
          : current,
      );
      setSuccess("目标完成总结已保存。");
    } catch (error) {
      setError(getRequestErrorMessage(error, "保存目标完成总结失败"));
    } finally {
      setIsSaving(false);
    }
  }

  return {
    completionData,
    content,
    error,
    generateReview,
    goalId,
    isGenerating,
    isLoadingStats,
    isSaving,
    saveReview,
    setContent,
    setGoalId,
    success,
  };
}
