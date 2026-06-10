"use client";

import { useEffect, useState } from "react";
import {
  getRequestErrorMessage,
  requestJson,
} from "@/lib/http-client";
import type { GoalOption, WeeklyReviewData } from "./types";

export type WeeklyReviewFields = {
  summary: string;
  wins: string;
  blockers: string;
  nextActions: string;
};

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

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentWeekInputs(now = new Date()) {
  const start = new Date(now);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    periodStart: toDateInputValue(start),
    periodEnd: toDateInputValue(end),
  };
}

const emptyFields: WeeklyReviewFields = {
  summary: "",
  wins: "",
  blockers: "",
  nextActions: "",
};

function fieldsHaveContent(fields: WeeklyReviewFields) {
  return Object.values(fields).some((value) => value.trim().length > 0);
}

export function useWeeklyReview(goals: GoalOption[]) {
  const [goalId, setGoalId] = useState(goals[0]?.id ?? "");
  const [period, setPeriod] = useState(() => getCurrentWeekInputs());
  const [weeklyData, setWeeklyData] = useState<WeeklyReviewData | null>(null);
  const [fields, setFields] = useState<WeeklyReviewFields>(emptyFields);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!goalId || !period.periodStart || !period.periodEnd) {
      return;
    }

    let isCurrent = true;

    async function loadWeeklyData() {
      setError("");
      setSuccess("");
      setIsLoadingStats(true);

      try {
        const searchParams = new URLSearchParams({
          goalId,
          periodStart: period.periodStart,
          periodEnd: period.periodEnd,
        });
        const payload = await requestJson<{ data: WeeklyReviewData }>(
          `/api/reviews/weekly?${searchParams.toString()}`,
          { method: "GET" },
          "加载周期任务统计失败",
        );

        if (!isCurrent) {
          return;
        }

        setWeeklyData(payload.data);
        setFields({
          summary: payload.data.latestReview?.summary ?? "",
          wins: payload.data.latestReview?.wins ?? "",
          blockers: payload.data.latestReview?.blockers ?? "",
          nextActions: payload.data.latestReview?.nextActions ?? "",
        });
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setWeeklyData(null);
        setFields(emptyFields);
        setError(getRequestErrorMessage(error, "加载周期任务统计失败"));
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
  }, [goalId, period.periodEnd, period.periodStart]);

  function setReviewField(key: keyof WeeklyReviewFields, value: string) {
    setFields((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function setPeriodField(key: keyof typeof period, value: string) {
    setPeriod((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetToCurrentWeek() {
    setPeriod(getCurrentWeekInputs());
  }

  async function generateReview() {
    if (!goalId) {
      return;
    }

    setError("");
    setSuccess("");
    setIsGenerating(true);

    try {
      const payload = await requestJson<{ data: { content: string } }>(
        "/api/reviews/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goalId }),
        },
        "生成复盘建议失败",
      );

      setReviewField("summary", payload.data.content);
    } catch (error) {
      setError(getRequestErrorMessage(error, "生成复盘建议失败"));
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveReview() {
    if (!goalId || !fieldsHaveContent(fields)) {
      setError("请先填写至少一项复盘内容");
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
            periodEnd: period.periodEnd,
            periodStart: period.periodStart,
            summary: fields.summary,
            wins: fields.wins,
            blockers: fields.blockers,
            nextActions: fields.nextActions,
            type: "GOAL_WEEKLY",
          }),
        },
        "保存复盘失败",
      );

      setWeeklyData((current) =>
        current
          ? {
              ...current,
              latestReview: payload.data,
            }
          : current,
      );
      setSuccess("复盘记录已保存。");
    } catch (error) {
      setError(getRequestErrorMessage(error, "保存复盘失败"));
    } finally {
      setIsSaving(false);
    }
  }

  return {
    error,
    fields,
    generateReview,
    goalId,
    isGenerating,
    isLoadingStats,
    isSaving,
    period,
    resetToCurrentWeek,
    saveReview,
    setGoalId,
    setPeriodField,
    setReviewField,
    success,
    weeklyData,
  };
}
