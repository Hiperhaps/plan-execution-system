"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GeneratedPlan } from "@/services/ai-plan.service";
import {
  getRequestErrorMessage,
  requestJson,
} from "@/lib/http-client";
import type {
  AiPlanAdjustment,
  AiPlanFormState,
  SavedGoalResponse,
} from "./types";

export function useAiPlan() {
  const router = useRouter();
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function generatePlan(
    form: AiPlanFormState,
    adjustment?: AiPlanAdjustment,
  ) {
    setError("");
    setPlan(null);
    setIsGenerating(true);

    try {
      const payload = await requestJson<{ data: GeneratedPlan }>(
        "/api/ai-plan/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            adjustment,
          }),
        },
        "生成计划失败",
      );

      setPlan(payload.data);
    } catch (error) {
      setError(getRequestErrorMessage(error, "生成计划失败"));
    } finally {
      setIsGenerating(false);
    }
  }

  async function savePlan() {
    if (!plan) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const payload = await requestJson<SavedGoalResponse>(
        "/api/ai-plan/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan }),
        },
        "保存计划失败",
      );

      router.push(`/goals/${payload.data.id}`);
      router.refresh();
    } catch (error) {
      setError(getRequestErrorMessage(error, "保存计划失败"));
    } finally {
      setIsSaving(false);
    }
  }

  return {
    error,
    generatePlan,
    isGenerating,
    isSaving,
    plan,
    savePlan,
  };
}
