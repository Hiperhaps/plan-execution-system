"use client";

import type { GoalOption, ReviewStatsData } from "./types";

export function ReviewControls({
  buttonLabel = "AI 生成复盘",
  description = "选择目标后生成建议，也可以直接编辑并保存。",
  error,
  goalId,
  goals,
  isGenerating,
  isLoadingStats,
  isSaving,
  onGenerate,
  onGoalChange,
  onSave,
  periodLabel = "本周周期",
  saveLabel = "保存复盘",
  success,
  title = "复盘操作",
  reviewData,
  canSave,
}: {
  buttonLabel?: string;
  canSave: boolean;
  description?: string;
  error: string;
  goalId: string;
  goals: GoalOption[];
  isGenerating: boolean;
  isLoadingStats: boolean;
  isSaving: boolean;
  onGenerate: () => void;
  onGoalChange: (goalId: string) => void;
  onSave: () => void;
  periodLabel?: string;
  saveLabel?: string;
  success: string;
  title?: string;
  reviewData: ReviewStatsData | null;
}) {
  return (
    <section className="panel p-5">
      <div>
        <p className="page-kicker">Controls</p>
        <h2 className="mt-2 text-lg font-extrabold text-[#1f2523]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6d746f]">
          {description}
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="field-label">选择目标</span>
          <select
            value={goalId}
            onChange={(event) => onGoalChange(event.target.value)}
            className="field"
          >
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={!goalId || isGenerating || isLoadingStats}
            className="btn-primary"
          >
            {isGenerating ? "生成中..." : buttonLabel}
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave || isSaving}
            className="btn-secondary"
          >
            {isSaving ? "保存中..." : saveLabel}
          </button>
        </div>
      </div>

      {reviewData ? (
        <p className="mt-4 text-sm font-bold leading-6 text-[#6d746f]">
          {periodLabel}：
          {new Date(reviewData.periodStart).toLocaleDateString("zh-CN")} -{" "}
          {new Date(reviewData.periodEnd).toLocaleDateString("zh-CN")}
          {reviewData.latestReview ? " / 已加载已保存复盘" : ""}
        </p>
      ) : null}

      {error ? <p className="alert-error mt-4">{error}</p> : null}
      {success ? <p className="alert-success mt-4">{success}</p> : null}
    </section>
  );
}
