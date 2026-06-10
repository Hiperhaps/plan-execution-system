"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import { GoalProgressSection } from "@/components/dashboard/goal-progress-section";
import {
  ReminderSection,
  sortByUrgency,
} from "@/components/dashboard/reminder-section";
import { TaskSection } from "@/components/dashboard/task-section";
import type {
  DashboardTaskItem,
  GoalProgressItem,
} from "@/components/dashboard/types";
import { useCompleteTask } from "@/components/dashboard/use-complete-task";

type ActionLink = {
  href: string;
  label: string;
  description: string;
  tone: string;
};

type DashboardProps = {
  actionLinks: ActionLink[];
  todayTasks: DashboardTaskItem[];
  overdueTasks: DashboardTaskItem[];
  upcomingTasks: DashboardTaskItem[];
  inProgressTasks: DashboardTaskItem[];
  weekTasks: DashboardTaskItem[];
  goalProgress: GoalProgressItem[];
};

type DashboardModuleId = "today" | "overdue" | "inProgress" | "week";

type DashboardModule = {
  id: DashboardModuleId;
  title: string;
  content: ReactNode;
};

const MODULE_STORAGE_KEY = "plan-execution-system.dashboard.module-order";

const DEFAULT_MODULE_ORDER: DashboardModuleId[] = [
  "today",
  "overdue",
  "inProgress",
  "week",
];

function isDashboardModuleId(value: string): value is DashboardModuleId {
  return DEFAULT_MODULE_ORDER.includes(value as DashboardModuleId);
}

function normalizeModuleOrder(value: string[] | null) {
  if (!value) {
    return DEFAULT_MODULE_ORDER;
  }

  const validItems = value.filter(isDashboardModuleId);
  const missingItems = DEFAULT_MODULE_ORDER.filter(
    (item) => !validItems.includes(item),
  );

  return [...validItems, ...missingItems];
}

function moveModule(
  order: DashboardModuleId[],
  fromId: DashboardModuleId,
  toId: DashboardModuleId,
) {
  const next = [...order];
  const fromIndex = next.indexOf(fromId);
  const toIndex = next.indexOf(toId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return order;
  }

  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);

  return next;
}

export function Dashboard({
  actionLinks,
  todayTasks,
  overdueTasks,
  upcomingTasks,
  inProgressTasks,
  weekTasks,
  goalProgress,
}: DashboardProps) {
  const [moduleOrder, setModuleOrder] = useState<DashboardModuleId[]>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_MODULE_ORDER;
    }

    const savedOrder = window.localStorage.getItem(MODULE_STORAGE_KEY);

    try {
      return normalizeModuleOrder(JSON.parse(savedOrder ?? "null"));
    } catch {
      return DEFAULT_MODULE_ORDER;
    }
  });
  const [draggingId, setDraggingId] = useState<DashboardModuleId | null>(null);
  const { actionTaskId, completeTask, delayTask, error } = useCompleteTask();
  const reminders = useMemo(
    () =>
      sortByUrgency([
        ...overdueTasks.map((task) => ({
          ...task,
          reminderType: "OVERDUE" as const,
        })),
        ...todayTasks.map((task) => ({
          ...task,
          reminderType: "TODAY" as const,
        })),
        ...upcomingTasks.map((task) => ({
          ...task,
          reminderType: "UPCOMING" as const,
        })),
      ]),
    [overdueTasks, todayTasks, upcomingTasks],
  );
  const modules = useMemo<Record<DashboardModuleId, DashboardModule>>(
    () => ({
      today: {
        id: "today",
        title: "今日到期",
        content: (
          <TaskSection
            title="今日到期"
            subtitle="把今天能收束的事项先推进。"
            viewLabel="日期"
            tasks={todayTasks}
            emptyText="今天没有到期的未完成任务。"
            onComplete={completeTask}
            onDelay={delayTask}
            actionTaskId={actionTaskId}
          />
        ),
      },
      overdue: {
        id: "overdue",
        title: "逾期任务",
        content: (
          <TaskSection
            title="逾期任务"
            subtitle="需要重新评估截止日期，或立刻处理。"
            viewLabel="风险"
            tasks={overdueTasks}
            emptyText="目前没有逾期未完成任务。"
            onComplete={completeTask}
            onDelay={delayTask}
            actionTaskId={actionTaskId}
          />
        ),
      },
      inProgress: {
        id: "inProgress",
        title: "进行中任务",
        content: (
          <TaskSection
            title="进行中任务"
            subtitle="已经启动的任务优先保持推进。"
            viewLabel="状态"
            tasks={inProgressTasks}
            emptyText="目前没有标记为进行中的任务。"
            onComplete={completeTask}
            onDelay={delayTask}
            actionTaskId={actionTaskId}
          />
        ),
      },
      week: {
        id: "week",
        title: "本周任务",
        content: (
          <TaskSection
            title="本周任务"
            subtitle="检查本周计划是否与目标进度匹配。"
            viewLabel="周"
            tasks={weekTasks}
            emptyText="本周还没有设置截止日期的任务。"
            onComplete={completeTask}
            onDelay={delayTask}
            actionTaskId={actionTaskId}
          />
        ),
      },
    }),
    [
      actionTaskId,
      completeTask,
      delayTask,
      inProgressTasks,
      overdueTasks,
      todayTasks,
      weekTasks,
    ],
  );

  useEffect(() => {
    window.localStorage.setItem(
      MODULE_STORAGE_KEY,
      JSON.stringify(moduleOrder),
    );
  }, [moduleOrder]);

  function handleDragStart(
    event: DragEvent<HTMLDivElement>,
    moduleId: DashboardModuleId,
  ) {
    setDraggingId(moduleId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", moduleId);
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
    moduleId: DashboardModuleId,
  ) {
    event.preventDefault();

    if (!draggingId || draggingId === moduleId) {
      return;
    }

    setModuleOrder((current) => moveModule(current, draggingId, moduleId));
  }

  function handleDragEnd() {
    setDraggingId(null);
  }

  return (
    <section className="workspace-grid">
      <div className="main-stack">
        {error ? <p className="alert-error">{error}</p> : null}

        <ReminderSection
          reminders={reminders}
          onComplete={completeTask}
          onDelay={delayTask}
          actionTaskId={actionTaskId}
        />

        <div className="toolbar panel-quiet px-3 py-2">
          <p className="text-sm font-extrabold text-[#1f2523]">任务视图</p>
          <button
            type="button"
            onClick={() => setModuleOrder(DEFAULT_MODULE_ORDER)}
            className="btn-secondary min-h-8 px-3 py-1 text-xs"
          >
            恢复默认
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {moduleOrder.map((moduleId) => {
            const dashboardModule = modules[moduleId];

            return (
              <DraggableModule
                key={dashboardModule.id}
                dashboardModule={dashboardModule}
                isDragging={draggingId === dashboardModule.id}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
              />
            );
          })}
        </div>
      </div>

      <aside className="side-stack">
        <GoalProgressSection goals={goalProgress} />

        <section className="panel p-3">
          <div className="toolbar">
            <h2 className="text-sm font-extrabold text-[#1f2523]">常用入口</h2>
            <span className="chip">4</span>
          </div>
          <div className="rail-nav mt-3">
            {actionLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-tile ${item.tone}`}
              >
                <span className="block text-sm font-extrabold leading-5 text-[#1f2523]">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs leading-4 text-[#6d746f]">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </aside>
    </section>
  );
}

function DraggableModule({
  dashboardModule,
  isDragging,
  onDragEnd,
  onDragOver,
  onDragStart,
}: {
  dashboardModule: DashboardModule;
  isDragging: boolean;
  onDragEnd: () => void;
  onDragOver: (
    event: DragEvent<HTMLDivElement>,
    moduleId: DashboardModuleId,
  ) => void;
  onDragStart: (
    event: DragEvent<HTMLDivElement>,
    moduleId: DashboardModuleId,
  ) => void;
}) {
  return (
    <div
      draggable
      onDragEnd={onDragEnd}
      onDragOver={(event) => onDragOver(event, dashboardModule.id)}
      onDragStart={(event) => onDragStart(event, dashboardModule.id)}
      className={`group relative min-w-0 transition ${
        isDragging ? "scale-[0.99] opacity-60" : ""
      }`}
      aria-label={dashboardModule.title}
    >
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 z-10 hidden h-8 w-8 cursor-grab select-none items-center justify-center rounded-full border border-[#d8d0c1] bg-[#fffdf7]/95 text-sm font-extrabold text-[#6d746f] shadow-sm transition group-hover:flex group-active:cursor-grabbing"
      >
        ::
      </span>
      {dashboardModule.content}
    </div>
  );
}
