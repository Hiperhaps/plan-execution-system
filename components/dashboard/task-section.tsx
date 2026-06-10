import Link from "next/link";
import {
  getTaskPriorityLabel,
  getTaskStatusLabel,
} from "@/lib/task-options";
import {
  TASK_DELAY_OPTIONS,
  type TaskDelayDays,
} from "@/lib/task-delay-options";
import type { DashboardTaskItem } from "@/components/dashboard/types";

function formatDate(value: string | null) {
  if (!value) {
    return "未设置日期";
  }

  return new Date(value).toLocaleDateString("zh-CN");
}

function formatEstimatedHours(value: number | null) {
  return value ? `${value} 小时` : "未估时";
}

type TaskSectionProps = {
  title: string;
  subtitle: string;
  viewLabel?: string;
  tasks: DashboardTaskItem[];
  emptyText: string;
  onComplete: (taskId: string) => void;
  onDelay: (taskId: string, days: TaskDelayDays) => void;
  actionTaskId: string | null;
};

export function TaskSection({
  title,
  subtitle,
  viewLabel,
  tasks,
  emptyText,
  onComplete,
  onDelay,
  actionTaskId,
}: TaskSectionProps) {
  return (
    <section className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="section-title">{title}</h2>
            {viewLabel ? <span className="chip">{viewLabel}</span> : null}
          </div>
          <p className="mt-1 text-sm leading-6 text-[#6d746f]">{subtitle}</p>
        </div>
        <span className="count-pill">{tasks.length}</span>
      </div>

      <div className="mt-4">
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#d8d0c1] bg-[#f8f3ea] px-4 py-8 text-sm font-semibold text-[#6d746f]">
            {emptyText}
          </p>
        ) : (
          <div className="grid gap-2">
            {tasks.map((task) => (
              <article key={task.id} className="task-row">
                <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-center">
                  <div className="min-w-0">
                    <Link
                      href={`/goals/${task.goalId}`}
                      className="block text-sm font-extrabold leading-6 text-[#1f2523] transition hover:text-[#0f766e]"
                    >
                      {task.title}
                    </Link>
                    <p className="mt-1 truncate text-xs font-bold text-[#6d746f]">
                      {task.goalTitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 2xl:justify-end">
                    <button
                      type="button"
                      onClick={() => onComplete(task.id)}
                      disabled={task.status === "DONE" || actionTaskId === task.id}
                      className="btn-primary min-h-9 px-3 py-1 text-xs"
                    >
                      {task.status === "DONE"
                        ? "已完成"
                        : actionTaskId === task.id
                          ? "处理中..."
                          : "完成"}
                    </button>
                    <select
                      defaultValue=""
                      onChange={(event) => {
                        const days = Number(event.target.value) as TaskDelayDays;

                        if (days) {
                          onDelay(task.id, days);
                          event.currentTarget.value = "";
                        }
                      }}
                      disabled={task.status === "DONE" || actionTaskId === task.id}
                      className="field h-9 min-h-9 w-28 py-0 text-xs"
                    >
                      <option value="">延后...</option>
                      {TASK_DELAY_OPTIONS.map((option) => (
                        <option key={option.days} value={option.days}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-[#6d746f]">
                  <span>状态：{getTaskStatusLabel(task.status)}</span>
                  <span>优先级：{getTaskPriorityLabel(task.priority)}</span>
                  <span>预计：{formatEstimatedHours(task.estimatedHours)}</span>
                  <span>截止：{formatDate(task.dueDate)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
