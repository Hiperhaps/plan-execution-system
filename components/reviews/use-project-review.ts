"use client";

import { useEffect, useState } from "react";
import {
  getRequestErrorMessage,
  requestJson,
} from "@/lib/http-client";
import type { ProjectReviewData } from "./types";

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

export function useProjectReview() {
  const [weeklyData, setWeeklyData] = useState<ProjectReviewData | null>(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadWeeklyData() {
      setError("");
      setSuccess("");
      setIsLoadingStats(true);

      try {
        const payload = await requestJson<{ data: ProjectReviewData }>(
          "/api/reviews/project-weekly",
          { method: "GET" },
          "加载全项目复盘数据失败",
        );

        if (!isCurrent) {
          return;
        }

        setWeeklyData(payload.data);
        setContent(payload.data.latestReview?.summary ?? "");
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setWeeklyData(null);
        setError(getRequestErrorMessage(error, "加载全项目复盘数据失败"));
      } finally {
        if (isCurrent) {
          setIsLoadingStats(false);
        }
      }
    }

    loadWeeklyData();

    return () => {
      isCurrent = false;
    };
  }, []);

  async function generateReview() {
    setError("");
    setSuccess("");
    setIsGenerating(true);

    try {
      const payload = await requestJson<{ data: { content: string } }>(
        "/api/reviews/project-generate",
        { method: "POST" },
        "生成全项目复盘失败",
      );

      setContent(payload.data.content);
    } catch (error) {
      setError(getRequestErrorMessage(error, "生成全项目复盘失败"));
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveReview() {
    if (!content.trim()) {
      setError("请先生成或填写复盘内容");
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
            goalId: null,
            content,
            type: "PROJECT_WEEKLY",
          }),
        },
        "保存全项目复盘失败",
      );

      setWeeklyData((current) =>
        current
          ? {
              ...current,
              latestReview: payload.data,
            }
          : current,
      );
      setSuccess("全项目复盘已保存。");
    } catch (error) {
      setError(getRequestErrorMessage(error, "保存全项目复盘失败"));
    } finally {
      setIsSaving(false);
    }
  }

  return {
    content,
    error,
    generateReview,
    isGenerating,
    isLoadingStats,
    isSaving,
    saveReview,
    setContent,
    success,
    weeklyData,
  };
}
