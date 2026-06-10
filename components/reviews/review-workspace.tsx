"use client";

import { useState } from "react";
import { GoalCompletionReviewForm } from "@/components/reviews/goal-completion-review-form";
import { ProjectReviewForm } from "@/components/reviews/project-review-form";
import { ReviewHistoryList } from "@/components/reviews/review-history-list";
import { WeeklyReviewForm } from "@/components/reviews/weekly-review-form";
import type { GoalOption, ReviewHistoryItem } from "./types";

type ReviewMode = "weekly" | "project" | "completion";

const reviewModeOptions: Array<{
  label: string;
  value: ReviewMode;
}> = [
  { label: "目标周复盘", value: "weekly" },
  { label: "全项目复盘", value: "project" },
  { label: "目标完成总结", value: "completion" },
];

export function ReviewWorkspace({
  goals,
  reviews,
}: {
  goals: GoalOption[];
  reviews: ReviewHistoryItem[];
}) {
  const [mode, setMode] = useState<ReviewMode>("weekly");

  return (
    <div className="grid gap-6">
      <section className="panel p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <p className="page-kicker">Review Mode</p>
            <h2 className="mt-2 text-xl font-extrabold text-[#1f2523]">
              选择复盘类型
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d746f]">
              周复盘看本周执行，全项目复盘看整体节奏，完成总结沉淀单个目标从开始到结束的经验。
            </p>
          </div>
          <label className="grid gap-2">
            <span className="field-label">复盘类型</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as ReviewMode)}
              className="field"
            >
              {reviewModeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {mode === "weekly" ? (
        <WeeklyReviewForm goals={goals} />
      ) : mode === "project" ? (
        <ProjectReviewForm />
      ) : (
        <GoalCompletionReviewForm goals={goals} />
      )}

      <ReviewHistoryList reviews={reviews} />
    </div>
  );
}
