"use client";

import type { FormEvent } from "react";
import type { AiPlanFormState } from "./types";

type AiPlanInputFormProps = {
  error: string;
  form: AiPlanFormState;
  isGenerating: boolean;
  isSaving: boolean;
  onChange: (form: AiPlanFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AiPlanInputForm({
  error,
  form,
  isGenerating,
  isSaving,
  onChange,
  onSubmit,
}: AiPlanInputFormProps) {
  return (
    <form onSubmit={onSubmit} className="panel p-5">
      <div>
        <p className="page-kicker">Input</p>
        <h2 className="mt-2 text-lg font-extrabold text-[#1f2523]">
          目标输入
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6d746f]">
          给 AI 足够约束，计划才会更贴近现实。
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="field-label">目标</span>
          <textarea
            value={form.goal}
            onChange={(event) =>
              onChange({
                ...form,
                goal: event.target.value,
              })
            }
            required
            className="field min-h-32 leading-7"
            placeholder="例如：一周内完成计划执行系统 MVP"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">截止日期</span>
          <input
            type="date"
            value={form.deadline}
            onChange={(event) =>
              onChange({
                ...form,
                deadline: event.target.value,
              })
            }
            required
            className="field"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">每周可投入时间</span>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="168"
              step="1"
              value={form.weeklyHours}
              onChange={(event) =>
                onChange({
                  ...form,
                  weeklyHours: event.target.value,
                })
              }
              required
              className="field pr-24"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-bold text-[#6d746f]">
              小时 / 周
            </span>
          </div>
        </label>

        <label className="grid gap-2">
          <span className="field-label">偏好说明</span>
          <textarea
            value={form.preference}
            onChange={(event) =>
              onChange({
                ...form,
                preference: event.target.value,
              })
            }
            className="field min-h-28 leading-7"
            placeholder="例如：优先周末做深度任务，工作日只安排轻量任务。"
          />
        </label>

        {error ? <p className="alert-error">{error}</p> : null}

        <button
          type="submit"
          disabled={isGenerating || isSaving}
          className="btn-primary"
        >
          {isGenerating ? "生成中..." : "生成计划"}
        </button>
      </div>
    </form>
  );
}
