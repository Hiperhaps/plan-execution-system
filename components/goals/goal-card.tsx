import Link from "next/link";
import { getGoalStatusLabel, type GoalStatus } from "@/lib/goal-options";
import type { GoalListItem } from "@/components/goals/goal-list";

type GoalCardProps = {
  goal: GoalListItem;
  isDeleting: boolean;
  onDelete: (goalId: string) => void;
};

const statusCopy: Record<
  GoalStatus,
  {
    className: string;
    label: string;
    note: string;
  }
> = {
  ACTIVE: {
    className: "goal-status-badge goal-status-badge--active",
    label: "未完成",
    note: "仍有任务待推进",
  },
  COMPLETED: {
    className: "goal-status-badge goal-status-badge--completed",
    label: "已完成",
    note: "目标任务已收束",
  },
  ARCHIVED: {
    className: "goal-status-badge goal-status-badge--archived",
    label: "已归档",
    note: "已归档保存",
  },
};

export function GoalCard({ goal, isDeleting, onDelete }: GoalCardProps) {
  const displayStatus = goal.displayStatus as GoalStatus;
  const status = statusCopy[displayStatus] ?? {
    className: "goal-status-badge goal-status-badge--active",
    label: getGoalStatusLabel(goal.status),
    note: "目标状态",
  };

  return (
    <article className="panel p-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="page-kicker">Goal</p>
            <span className={status.className}>
              <span>{status.label}</span>
              <small>{status.note}</small>
            </span>
          </div>
          <Link
            href={`/goals/${goal.id}`}
            className="mt-2 block text-lg font-extrabold leading-7 text-[#1f2523] transition hover:text-[#0f766e]"
          >
            {goal.title}
          </Link>
          {goal.description ? (
            <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#6d746f]">
              {goal.description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          disabled={isDeleting}
          className="btn-danger min-h-9 px-3 py-1 text-xs"
        >
          {isDeleting ? "删除中..." : "删除目标"}
        </button>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e2d9cb] pt-4">
        <p className="text-xs font-bold text-[#6d746f]">
          创建于 {goal.createdAt.toLocaleDateString("zh-CN")}
        </p>
        <div className="goal-progress-meta">
          <span>
            {goal.completedTasks}/{goal.totalTasks} 任务已完成
          </span>
          <span>{goal.progress}%</span>
        </div>
        <Link href={`/goals/${goal.id}`} className="text-sm font-bold text-[#0f766e]">
          查看详情
        </Link>
      </div>
      <div className="goal-progress-bar mt-3" aria-hidden="true">
        <span style={{ width: `${goal.progress}%` }} />
      </div>
    </article>
  );
}
