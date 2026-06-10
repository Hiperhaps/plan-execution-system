"use client";

import { FormEvent } from "react";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  taskPriorityLabels,
  taskStatusLabels,
} from "@/lib/task-options";
import type { TaskFormState } from "@/components/tasks/types";

type TaskFormProps = {
  form: TaskFormState;
  isEditing: boolean;
  isSubmitting: boolean;
  error: string;
  onChange: (form: TaskFormState) => void;
  onCancelEdit: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TaskForm({
  form,
  isEditing,
  isSubmitting,
  error,
  onChange,
  onCancelEdit,
  onSubmit,
}: TaskFormProps) {
  return (
    <form onSubmit={onSubmit} className="panel p-5">
      <div>
        <p className="page-kicker">Task Editor</p>
        <h2 className="mt-2 text-lg font-extrabold text-[#1f2523]">
          {isEditing ? "编辑任务" : "新增任务"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6d746f]">
          下一步越具体，执行越轻。
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="field-label">任务标题</span>
          <input
            value={form.title}
            onChange={(event) =>
              onChange({
                ...form,
                title: event.target.value,
              })
            }
            required
            className="field"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">描述</span>
          <textarea
            value={form.description}
            onChange={(event) =>
              onChange({
                ...form,
                description: event.target.value,
              })
            }
            className="field min-h-28 leading-7"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <label className="grid gap-2">
            <span className="field-label">状态</span>
            <select
              value={form.status}
              onChange={(event) =>
                onChange({
                  ...form,
                  status: event.target.value as TaskFormState["status"],
                })
              }
              className="field"
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {taskStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="field-label">优先级</span>
            <select
              value={form.priority}
              onChange={(event) =>
                onChange({
                  ...form,
                  priority: event.target.value as TaskFormState["priority"],
                })
              }
              className="field"
            >
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {taskPriorityLabels[priority]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2">
          <span className="field-label">截止日期</span>
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) =>
              onChange({
                ...form,
                dueDate: event.target.value,
              })
            }
            className="field"
          />
        </label>

        {error ? <p className="alert-error">{error}</p> : null}

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting
              ? "保存中..."
              : isEditing
                ? "保存修改"
                : "新增任务"}
          </button>
          {isEditing ? (
            <button type="button" onClick={onCancelEdit} className="btn-secondary">
              取消编辑
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
