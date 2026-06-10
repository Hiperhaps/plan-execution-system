"use client";

import type { TaskStatus } from "@/lib/task-options";
import type { TaskDelayDays } from "@/lib/task-delay-options";
import { TaskCard } from "@/components/tasks/task-card";
import type { TaskItem } from "@/components/tasks/types";

type TaskListProps = {
  tasks: TaskItem[];
  onEdit: (task: TaskItem) => void;
  onDelete: (taskId: string) => void;
  onDelay: (task: TaskItem, days: TaskDelayDays) => void;
  onStatusChange: (task: TaskItem, status: TaskStatus) => void;
};

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onDelay,
  onStatusChange,
}: TaskListProps) {
  const groupedTasks = tasks.reduce<Array<{ phase: string; tasks: TaskItem[] }>>(
    (groups, task) => {
      const phase = task.phase || "未分阶段";
      const existingGroup = groups.find((group) => group.phase === phase);

      if (existingGroup) {
        existingGroup.tasks.push(task);
      } else {
        groups.push({ phase, tasks: [task] });
      }

      return groups;
    },
    [],
  );

  return (
    <div className="panel p-5">
      <div className="toolbar">
        <div>
          <h2 className="section-title">任务列表</h2>
          <p className="mt-1 text-sm leading-6 text-[#6d746f]">
            按阶段组织行动项，并在列表内直接完成、延期或变更状态。
          </p>
        </div>
        <span className="count-pill">{tasks.length}</span>
      </div>

      <div className="mt-5 grid gap-4">
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#d8d0c1] bg-[#f8f3ea] px-4 py-8 text-sm font-semibold text-[#6d746f]">
            这个目标下还没有任务。
          </p>
        ) : (
          groupedTasks.map((group) => (
            <section
              key={group.phase}
              className="rounded-lg border border-[#e2d9cb] bg-[#f8f3ea]/55 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-extrabold text-[#1f2523]">
                  {group.phase}
                </h3>
                <span className="chip">{group.tasks.length} 个任务</span>
              </div>
              <div className="grid gap-3">
                {group.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDelay={onDelay}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
