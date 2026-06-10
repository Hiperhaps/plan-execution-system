"use client";

import {
  getTaskPriorityLabel,
  getTaskStatusLabel,
} from "@/lib/task-options";
import type { ReviewTask } from "./types";

function formatDate(value: string | null) {
  if (!value) {
    return "未设置日期";
  }

  return new Date(value).toLocaleDateString("zh-CN");
}

export function ReviewTaskGroup({
  emptyText,
  tasks,
  title,
  tone,
}: {
  emptyText: string;
  tasks: ReviewTask[];
  title: string;
  tone: string;
}) {
  return (
    <section className={`panel border-t-4 ${tone} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="section-title">{title}</h2>
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
                <h3 className="text-sm font-extrabold text-[#1f2523]">
                  {task.title}
                </h3>
                {task.description ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6d746f]">
                    {task.description}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.goalTitle ? (
                    <span className="chip">目标：{task.goalTitle}</span>
                  ) : null}
                  <span className="chip">{getTaskStatusLabel(task.status)}</span>
                  <span className="chip">
                    优先级：{getTaskPriorityLabel(task.priority)}
                  </span>
                  <span className="chip">{formatDate(task.dueDate)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
