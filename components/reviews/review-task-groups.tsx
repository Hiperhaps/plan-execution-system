"use client";

import { ReviewTaskGroup } from "@/components/reviews/review-task-group";
import type { ReviewStatsData } from "./types";

export function ReviewTaskGroups({
  isLoadingStats,
  weeklyData,
}: {
  isLoadingStats: boolean;
  weeklyData: ReviewStatsData | null;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ReviewTaskGroup
        title="完成任务"
        tasks={weeklyData?.completedTasks ?? []}
        emptyText={isLoadingStats ? "加载中..." : "该周期没有完成任务。"}
        tone="border-t-[#0f766e]"
      />
      <ReviewTaskGroup
        title="未完成任务"
        tasks={weeklyData?.incompleteTasks ?? []}
        emptyText={isLoadingStats ? "加载中..." : "该周期没有未完成任务。"}
        tone="border-t-[#a66a02]"
      />
      <ReviewTaskGroup
        title="逾期任务"
        tasks={weeklyData?.delayedTasks ?? []}
        emptyText={isLoadingStats ? "加载中..." : "该周期没有逾期任务。"}
        tone="border-t-[#c2412d]"
      />
    </div>
  );
}
