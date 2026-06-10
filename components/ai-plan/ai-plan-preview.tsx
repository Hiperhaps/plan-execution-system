"use client";

import { getTaskPriorityLabel } from "@/lib/task-options";
import type { GeneratedPlan } from "@/services/ai-plan.service";
import type { AiPlanAdjustment } from "@/components/ai-plan/types";

type AiPlanPreviewProps = {
  isGenerating: boolean;
  isSaving: boolean;
  onAdjust: (adjustment: AiPlanAdjustment) => void;
  onSave: () => void;
  plan: GeneratedPlan | null;
};

const adjustmentOptions: Array<{
  label: string;
  value: AiPlanAdjustment;
}> = [
  { label: "重新生成计划", value: "REGENERATE" },
  { label: "缩短计划", value: "SHORTEN" },
  { label: "放宽计划", value: "RELAX" },
  { label: "增加任务细节", value: "ADD_DETAIL" },
  { label: "减少任务数量", value: "REDUCE_TASKS" },
  { label: "偏重理论学习", value: "THEORY_FOCUSED" },
  { label: "偏重实践执行", value: "PRACTICE_FOCUSED" },
];

const difficultyLabels: Record<
  GeneratedPlan["phases"][number]["tasks"][number]["difficulty"],
  string
> = {
  EASY: "低",
  MEDIUM: "中",
  HARD: "高",
};

export function AiPlanPreview({
  isGenerating,
  isSaving,
  onAdjust,
  onSave,
  plan,
}: AiPlanPreviewProps) {
  return (
    <section className="panel p-5">
      <div className="toolbar">
        <div>
          <p className="page-kicker">Preview</p>
          <h2 className="mt-2 text-lg font-extrabold text-[#1f2523]">
            计划预览
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6d746f]">
            生成后先检查阶段、任务密度和时间边界，再保存到系统。
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={!plan || isSaving || isGenerating}
          className="btn-primary shrink-0"
        >
          {isSaving ? "保存中..." : "保存计划"}
        </button>
      </div>

      {plan ? (
        <div className="mt-5 border-t border-[#e2d9cb] pt-5">
          <p className="text-sm font-extrabold text-[#1f2523]">
            不满意这版计划？
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {adjustmentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onAdjust(option.value)}
                disabled={isGenerating || isSaving}
                className="btn-secondary min-h-9 px-3 py-1 text-xs"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        {isGenerating ? (
          <div className="rounded-lg border border-dashed border-[#d8d0c1] bg-[#f8f3ea] px-4 py-12 text-center text-sm font-semibold text-[#6d746f]">
            正在生成结构化计划...
          </div>
        ) : plan ? (
          <PlanContent plan={plan} />
        ) : (
          <div className="rounded-lg border border-dashed border-[#d8d0c1] bg-[#f8f3ea] px-4 py-12 text-center text-sm font-semibold text-[#6d746f]">
            还没有生成计划。
          </div>
        )}
      </div>
    </section>
  );
}

function PlanContent({ plan }: { plan: GeneratedPlan }) {
  return (
    <div>
      <div className="border-b border-[#e2d9cb] pb-5">
        <div className="flex flex-wrap gap-2">
          {plan.targetDate ? (
            <span className="chip">目标日期：{plan.targetDate}</span>
          ) : null}
          <span className="chip">{plan.phases.length} 个阶段</span>
        </div>
        <h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#1f2523]">
          {plan.goalTitle}
        </h3>
        {plan.goalDescription ? (
          <p className="mt-3 text-sm leading-7 text-[#6d746f]">
            {plan.goalDescription}
          </p>
        ) : null}
        {plan.planningNotes ? (
          <p className="mt-3 rounded-lg bg-[#f8f3ea] p-3 text-sm leading-7 text-[#6d746f]">
            {plan.planningNotes}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-5">
        {plan.phases.map((phase, phaseIndex) => (
          <section
            key={`${phase.title}-${phaseIndex}`}
            className="rounded-lg border border-[#e2d9cb] bg-[#f8f3ea]/55 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="page-kicker">Phase {phaseIndex + 1}</p>
                <h4 className="mt-2 text-lg font-extrabold text-[#1f2523]">
                  {phase.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#6d746f]">
                  {phase.objective}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <span className="chip">开始：{phase.startDate}</span>
                <span className="chip">结束：{phase.endDate}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {phase.tasks.map((task, taskIndex) => (
                <article key={`${task.title}-${taskIndex}`} className="task-row">
                  <div className="min-w-0">
                    <h5 className="text-sm font-extrabold leading-6 text-[#1f2523]">
                      {task.title}
                    </h5>
                    {task.description ? (
                      <p className="mt-1 text-sm leading-6 text-[#6d746f]">
                        {task.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.isReviewTask ? <span className="chip">复盘节点</span> : null}
                    <span className="chip">
                      优先级：{getTaskPriorityLabel(task.priority)}
                    </span>
                    <span className="chip">
                      难度：{difficultyLabels[task.difficulty]}
                    </span>
                    <span className="chip">预计：{task.estimatedHours} 小时</span>
                    <span className="chip">截止：{task.dueDate}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
