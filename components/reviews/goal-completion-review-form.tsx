"use client";

import { ReviewControls } from "@/components/reviews/review-controls";
import { ReviewEditor } from "@/components/reviews/review-editor";
import { ReviewTaskGroups } from "@/components/reviews/review-task-groups";
import { useGoalCompletionReview } from "@/components/reviews/use-goal-completion-review";
import type { GoalOption } from "./types";

type GoalCompletionReviewFormProps = {
  goals: GoalOption[];
};

export function GoalCompletionReviewForm({
  goals,
}: GoalCompletionReviewFormProps) {
  const {
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
  } = useGoalCompletionReview(goals);

  return (
    <div className="grid gap-6">
      <ReviewControls
        buttonLabel="AI 生成完成总结"
        canSave={Boolean(content.trim())}
        description="选择一个已完成或接近完成的目标，沉淀从开始到结束的经验。"
        error={error}
        goalId={goalId}
        goals={goals}
        isGenerating={isGenerating}
        isLoadingStats={isLoadingStats}
        isSaving={isSaving}
        onGenerate={generateReview}
        onGoalChange={setGoalId}
        onSave={saveReview}
        periodLabel="目标周期"
        saveLabel="保存完成总结"
        success={success}
        title="完成总结操作"
        reviewData={completionData}
      />

      {goals.length === 0 ? (
        <p className="panel-quiet border-dashed px-6 py-10 text-center text-sm font-semibold text-[#6d746f]">
          还没有目标，先创建目标后再进行完成总结。
        </p>
      ) : (
        <>
          <ReviewTaskGroups
            isLoadingStats={isLoadingStats}
            weeklyData={completionData}
          />
          <ReviewEditor content={content} onChange={setContent} />
        </>
      )}
    </div>
  );
}
