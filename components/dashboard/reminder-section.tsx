import Link from "next/link";
import {
  getTaskPriorityLabel,
  getTaskPriorityRank,
} from "@/lib/task-options";
import {
  TASK_DELAY_OPTIONS,
  type TaskDelayDays,
} from "@/lib/task-delay-options";
import type { ReminderTaskItem, ReminderType } from "@/components/dashboard/types";

const reminderLabels: Record<ReminderType, string> = {
  OVERDUE: "已逾期",
  TODAY: "今天到期",
  UPCOMING: "三天内截止",
};

const reminderStyles: Record<ReminderType, string> = {
  OVERDUE: "bg-[#fff1ec] text-[#c2412d] border-[#f1c3b9]",
  TODAY: "bg-[#fff5d8] text-[#a66a02] border-[#efd28d]",
  UPCOMING: "bg-[#e8f3ef] text-[#0f766e] border-[#b8ddd3]",
};

const reminderRank: Record<ReminderType, number> = {
  OVERDUE: 0,
  TODAY: 1,
  UPCOMING: 2,
};

function formatDate(value: string | null) {
  if (!value) {
    return "未设置日期";
  }

  return new Date(value).toLocaleDateString("zh-CN");
}

function dueTime(value: string | null) {
  return value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
}

function formatEstimatedHours(value: number | null) {
  return value ? `${value} 小时` : "未估时";
}

export function sortByUrgency(tasks: ReminderTaskItem[]) {
  return [...tasks].sort((a, b) => {
    const reminderDiff =
      reminderRank[a.reminderType] - reminderRank[b.reminderType];

    if (reminderDiff !== 0) {
      return reminderDiff;
    }

    const dueDiff = dueTime(a.dueDate) - dueTime(b.dueDate);

    if (dueDiff !== 0) {
      return dueDiff;
    }

    return getTaskPriorityRank(a.priority) - getTaskPriorityRank(b.priority);
  });
}

type ReminderSectionProps = {
  reminders: ReminderTaskItem[];
  onComplete: (taskId: string) => void;
  onDelay: (taskId: string, days: TaskDelayDays) => void;
  actionTaskId: string | null;
};

export function ReminderSection({
  reminders,
  onComplete,
  onDelay,
  actionTaskId,
}: ReminderSectionProps) {
  return (
    <section className="panel overflow-hidden">
      <div className="toolbar border-b border-[#e2d9cb] bg-[#fffdf7] p-4">
        <div>
          <p className="page-kicker">Priority Radar</p>
          <h2 className="mt-1 text-xl font-extrabold text-[#1f2523]">
            任务提醒
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6d746f]">
            按紧急程度排序，先处理逾期和今天必须收口的任务。
          </p>
        </div>
        <span className="count-pill">{reminders.length}</span>
      </div>

      <div className="p-4">
        {reminders.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#d8d0c1] bg-[#f8f3ea] px-4 py-8 text-sm font-semibold text-[#6d746f]">
            当前没有需要提醒的任务。
          </p>
        ) : (
          <div className="grid gap-2">
            {reminders.map((task) => (
              <article
                key={`${task.reminderType}-${task.id}`}
                className="task-row"
              >
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-extrabold ${reminderStyles[task.reminderType]}`}
                      >
                        {reminderLabels[task.reminderType]}
                      </span>
                      <span className="text-xs font-bold text-[#6d746f]">
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                    <Link
                      href={`/goals/${task.goalId}`}
                      className="mt-2 block text-sm font-extrabold leading-6 text-[#1f2523] transition hover:text-[#0f766e]"
                    >
                      {task.title}
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <button
                      type="button"
                      onClick={() => onComplete(task.id)}
                      disabled={actionTaskId === task.id}
                      className="btn-primary min-h-9 px-3 py-1 text-xs"
                    >
                      {actionTaskId === task.id ? "处理中..." : "完成"}
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
                      disabled={actionTaskId === task.id}
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
                  <span>{task.goalTitle}</span>
                  <span>优先级：{getTaskPriorityLabel(task.priority)}</span>
                  <span>预计：{formatEstimatedHours(task.estimatedHours)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
