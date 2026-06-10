"use client";

import {
  getTaskPriorityLabel,
  TASK_STATUSES,
  taskStatusLabels,
  type TaskStatus,
} from "@/lib/task-options";
import {
  TASK_DELAY_OPTIONS,
  type TaskDelayDays,
} from "@/lib/task-delay-options";
import type { TaskItem } from "@/components/tasks/types";

function formatDate(value: string | null) {
  if (!value) {
    return "未设置";
  }

  return new Date(value).toLocaleDateString("zh-CN");
}

function formatEstimatedHours(value: number | null) {
  return value ? `${value} 小时` : "未估时";
}

type TaskCardProps = {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (taskId: string) => void;
  onDelay: (task: TaskItem, days: TaskDelayDays) => void;
  onStatusChange: (task: TaskItem, status: TaskStatus) => void;
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onDelay,
  onStatusChange,
}: TaskCardProps) {
  return (
    <article className="task-row">
      <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-start">
        <div className="min-w-0">
          <h3 className="text-base font-extrabold leading-6 text-[#1f2523]">
            {task.title}
          </h3>
          {task.description ? (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6d746f]">
              {task.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 2xl:justify-end">
          <button
            type="button"
            onClick={() => onStatusChange(task, "DONE")}
            disabled={task.status === "DONE"}
            className="btn-primary min-h-9 px-3 py-1 text-xs"
          >
            {task.status === "DONE" ? "已完成" : "完成"}
          </button>
          <select
            defaultValue=""
            onChange={(event) => {
              const days = Number(event.target.value) as TaskDelayDays;

              if (days) {
                onDelay(task, days);
                event.currentTarget.value = "";
              }
            }}
            disabled={task.status === "DONE"}
            className="field h-9 min-h-9 w-28 py-0 text-xs"
          >
            <option value="">延后...</option>
            {TASK_DELAY_OPTIONS.map((option) => (
              <option key={option.days} value={option.days}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={task.status}
            onChange={(event) =>
              onStatusChange(task, event.target.value as TaskStatus)
            }
            className="field h-9 min-h-9 w-28 py-0 text-xs"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {taskStatusLabels[status]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="btn-secondary min-h-9 px-3 py-1 text-xs"
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="btn-danger min-h-9 px-3 py-1 text-xs"
          >
            删除
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-[#6d746f]">
        <span>状态：{taskStatusLabels[task.status as TaskStatus] ?? task.status}</span>
        <span>优先级：{getTaskPriorityLabel(task.priority)}</span>
        <span>预计：{formatEstimatedHours(task.estimatedHours)}</span>
        <span>截止：{formatDate(task.dueDate)}</span>
      </div>
    </article>
  );
}
