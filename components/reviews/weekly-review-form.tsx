"use client";

import { ReviewTaskGroups } from "@/components/reviews/review-task-groups";
import {
  useWeeklyReview,
  type WeeklyReviewFields,
} from "@/components/reviews/use-weekly-review";
import type { GoalOption } from "./types";

type WeeklyReviewFormProps = {
  goals: GoalOption[];
};

const reviewFieldMeta: Array<{
  key: keyof WeeklyReviewFields;
  title: string;
  subtitle: string;
  placeholder: string;
}> = [
  {
    key: "summary",
    title: "Summary",
    subtitle: "这一周期整体发生了什么，执行节奏如何。",
    placeholder: "概括本周期的推进情况、节奏变化和关键结论。",
  },
  {
    key: "wins",
    title: "Wins",
    subtitle: "完成得不错、值得保留的做法。",
    placeholder: "记录完成事项、有效策略、关键进展或正向反馈。",
  },
  {
    key: "blockers",
    title: "Blockers",
    subtitle: "阻碍、风险、卡点和反复拖延的原因。",
    placeholder: "写下阻碍来源、依赖问题、精力瓶颈或计划偏差。",
  },
  {
    key: "nextActions",
    title: "Next Actions",
    subtitle: "下一周期要做的具体动作。",
    placeholder: "列出下一步行动、负责人、截止时间或优先级。",
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("zh-CN");
}

function hasReviewContent(fields: WeeklyReviewFields) {
  return Object.values(fields).some((value) => value.trim().length > 0);
}

export function WeeklyReviewForm({ goals }: WeeklyReviewFormProps) {
  const {
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
  } = useWeeklyReview(goals);
  const canSave = hasReviewContent(fields);
  const completionRate = weeklyData?.completionRate ?? 0;
  const totalTasks = weeklyData?.totalTasks ?? 0;

  return (
    <section className="workspace-grid">
      <div className="main-stack">
        {goals.length === 0 ? (
          <p className="panel-quiet border-dashed px-6 py-10 text-center text-sm font-semibold text-[#6d746f]">
            还没有目标，先创建目标后再进行周复盘。
          </p>
        ) : (
          <>
            <section className="panel p-5">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
                <div>
                  <p className="page-kicker">Weekly Review Metrics</p>
                  <h2 className="mt-2 text-xl font-extrabold text-[#1f2523]">
                    周期执行统计
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#6d746f]">
                    {period.periodStart && period.periodEnd
                      ? `${formatDate(period.periodStart)} - ${formatDate(period.periodEnd)}`
                      : "请选择复盘周期"}
                    {weeklyData?.latestReview ? " / 已加载已保存复盘" : ""}
                  </p>
                </div>

                <div className="review-rate-dial">
                  <span>{completionRate}%</span>
                  <small>完成率</small>
                </div>
              </div>

              <div className="review-stat-grid mt-5">
                <StatTile
                  label="完成任务"
                  value={weeklyData?.completedTasks.length ?? 0}
                />
                <StatTile
                  label="未完成任务"
                  value={weeklyData?.incompleteTasks.length ?? 0}
                />
                <StatTile
                  label="逾期任务"
                  value={weeklyData?.delayedTasks.length ?? 0}
                  tone="danger"
                />
                <StatTile label="统计任务" value={totalTasks} />
              </div>
            </section>

            <ReviewTaskGroups
              isLoadingStats={isLoadingStats}
              weeklyData={weeklyData}
            />

            <section className="review-field-grid">
              {reviewFieldMeta.map((field) => (
                <label key={field.key} className="review-field-card">
                  <span>
                    <span className="page-kicker">{field.title}</span>
                    <span className="mt-2 block text-base font-extrabold text-[#1f2523]">
                      {field.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[#6d746f]">
                      {field.subtitle}
                    </span>
                  </span>
                  <textarea
                    value={fields[field.key]}
                    onChange={(event) =>
                      setReviewField(field.key, event.target.value)
                    }
                    className="field mt-4 min-h-40 leading-7"
                    placeholder={field.placeholder}
                  />
                </label>
              ))}
            </section>
          </>
        )}
      </div>

      <aside className="side-stack">
        <section className="panel p-5">
          <div>
            <p className="page-kicker">Controls</p>
            <h2 className="mt-2 text-lg font-extrabold text-[#1f2523]">
              周复盘操作
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6d746f]">
              选择目标与复盘周期后，系统会自动统计该周期内的完成、未完成和逾期任务。
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="field-label">选择目标</span>
              <select
                value={goalId}
                onChange={(event) => setGoalId(event.target.value)}
                className="field"
              >
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3">
              <label className="grid gap-2">
                <span className="field-label">开始日期</span>
                <input
                  type="date"
                  value={period.periodStart}
                  onChange={(event) =>
                    setPeriodField("periodStart", event.target.value)
                  }
                  className="field"
                />
              </label>
              <label className="grid gap-2">
                <span className="field-label">结束日期</span>
                <input
                  type="date"
                  value={period.periodEnd}
                  onChange={(event) =>
                    setPeriodField("periodEnd", event.target.value)
                  }
                  className="field"
                />
              </label>
              <button
                type="button"
                onClick={resetToCurrentWeek}
                className="btn-secondary"
              >
                回到本周
              </button>
            </div>

            <div className="grid gap-2">
              <button
                type="button"
                onClick={generateReview}
                disabled={!goalId || isGenerating || isLoadingStats}
                className="btn-primary"
              >
                {isGenerating ? "生成中..." : "AI 生成 Summary"}
              </button>
              <button
                type="button"
                onClick={saveReview}
                disabled={!canSave || isSaving}
                className="btn-secondary"
              >
                {isSaving ? "保存中..." : "保存周复盘"}
              </button>
            </div>
          </div>

          {error ? <p className="alert-error mt-4">{error}</p> : null}
          {success ? <p className="alert-success mt-4">{success}</p> : null}
        </section>
      </aside>
    </section>
  );
}

function StatTile({
  label,
  tone,
  value,
}: {
  label: string;
  tone?: "danger";
  value: number;
}) {
  return (
    <div className="metric-tile">
      <p className={tone === "danger" ? "text-[#c2412d]" : "text-[#0f766e]"}>
        <span className="font-serif text-3xl font-bold">{value}</span>
      </p>
      <p className="text-xs font-extrabold text-[#6d746f]">{label}</p>
    </div>
  );
}
