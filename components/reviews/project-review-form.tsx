"use client";

import { ReviewEditor } from "@/components/reviews/review-editor";
import { ReviewTaskGroups } from "@/components/reviews/review-task-groups";
import { useProjectReview } from "@/components/reviews/use-project-review";

export function ProjectReviewForm() {
  const {
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
  } = useProjectReview();

  return (
    <section className="workspace-grid">
      <div className="main-stack">
        <ReviewTaskGroups
          isLoadingStats={isLoadingStats}
          weeklyData={weeklyData}
        />
        <ReviewEditor content={content} onChange={setContent} />
      </div>

      <aside className="side-stack">
        <div className="panel p-5">
          <div>
            <p className="page-kicker">Project Review</p>
            <h2 className="mt-2 text-lg font-extrabold text-[#1f2523]">
              全项目复盘
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d746f]">
              汇总所有目标下本周相关任务，关注整体节奏、阻塞和下周优先级。
            </p>
          </div>

          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={generateReview}
              disabled={isGenerating || isLoadingStats}
              className="btn-primary"
            >
              {isGenerating ? "生成中..." : "AI 生成全项目复盘"}
            </button>
            <button
              type="button"
              onClick={saveReview}
              disabled={!content.trim() || isSaving}
              className="btn-secondary"
            >
              {isSaving ? "保存中..." : "保存全项目复盘"}
            </button>
          </div>

          {weeklyData ? (
            <p className="mt-4 text-sm font-bold leading-6 text-[#6d746f]">
              本周周期：
              {new Date(weeklyData.periodStart).toLocaleDateString("zh-CN")} -{" "}
              {new Date(weeklyData.periodEnd).toLocaleDateString("zh-CN")}
              {weeklyData.latestReview ? " / 已加载本周已保存复盘" : ""}
            </p>
          ) : null}

          {error ? <p className="alert-error mt-4">{error}</p> : null}
          {success ? <p className="alert-success mt-4">{success}</p> : null}
        </div>
      </aside>
    </section>
  );
}
