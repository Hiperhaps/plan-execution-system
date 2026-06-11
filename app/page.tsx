import { Dashboard } from "@/components/dashboard/dashboard";
import type { DashboardTaskItem } from "@/components/dashboard/types";
import { requirePageUserId } from "@/lib/page-auth";
import { resolveEstimatedHours } from "@/lib/task-estimate";
import { listGoalProgress } from "@/services/goal.service";
import {
  listInProgressTasks,
  listOverdueTasks,
  listThisWeekTasks,
  listTodayTasks,
  listUpcomingTasks,
} from "@/services/task.service";

export const dynamic = "force-dynamic";

const navigation = [
  {
    href: "/goals",
    label: "目标管理",
    description: "目标、阶段和进度",
    tone: "border-t-[#0f766e]",
  },
  {
    href: "/tasks",
    label: "任务总览",
    description: "状态与截止日期",
    tone: "border-t-[#687a36]",
  },
  {
    href: "/ai-plan",
    label: "AI 计划",
    description: "拆解目标任务",
    tone: "border-t-[#a66a02]",
  },
  {
    href: "/reviews",
    label: "复盘中心",
    description: "周复盘与调整",
    tone: "border-t-[#c2412d]",
  },
];

function toDashboardTask(
  task: Awaited<ReturnType<typeof listTodayTasks>>[number],
): DashboardTaskItem {
  return {
    id: task.id,
    goalId: task.goalId,
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    estimatedHours: resolveEstimatedHours(
      task.estimatedHours,
      task.description,
    ),
    goalTitle: task.goal.title,
  };
}

export default async function Home() {
  const userId = await requirePageUserId();
  const [
    todayTasks,
    overdueTasks,
    upcomingTasks,
    inProgressTasks,
    weekTasks,
    goalProgress,
  ] = await Promise.all([
    listTodayTasks(userId),
    listOverdueTasks(userId),
    listUpcomingTasks(userId),
    listInProgressTasks(userId),
    listThisWeekTasks(userId),
    listGoalProgress(userId),
  ]);

  const reminderCount =
    todayTasks.length + overdueTasks.length + upcomingTasks.length;
  const totalEstimatedHours = weekTasks.reduce(
    (sum, task) =>
      sum + (resolveEstimatedHours(task.estimatedHours, task.description) ?? 0),
    0,
  );

  return (
    <main className="app-shell page-frame">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Execution Console</p>
          <h1 className="page-title">计划执行系统</h1>
          <p className="page-copy mt-4 max-w-2xl">
            先处理提醒和逾期，再推进今日任务。首页只保留高频入口和可执行信息。
          </p>
        </div>

        <section className="panel-tight p-3">
          <p className="text-xs font-extrabold text-[#0f766e]">今日节奏</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Metric value={todayTasks.length} label="今日" />
            <Metric value={overdueTasks.length} label="逾期" tone="text-[#c2412d]" />
            <Metric value={reminderCount} label="提醒" tone="text-[#a66a02]" />
          </div>
        </section>
      </header>

      <section className="metric-strip">
        <MetricTile label="进行中" value={inProgressTasks.length} />
        <MetricTile label="本周任务" value={weekTasks.length} />
        <MetricTile label="预计小时" value={totalEstimatedHours} suffix="h" />
        <MetricTile label="目标数量" value={goalProgress.length} />
      </section>

      <Dashboard
        actionLinks={navigation}
        todayTasks={todayTasks.map(toDashboardTask)}
        overdueTasks={overdueTasks.map(toDashboardTask)}
        upcomingTasks={upcomingTasks.map(toDashboardTask)}
        inProgressTasks={inProgressTasks.map(toDashboardTask)}
        weekTasks={weekTasks.map(toDashboardTask)}
        goalProgress={goalProgress}
      />
    </main>
  );
}

function Metric({
  label,
  tone = "text-[#1f2523]",
  value,
}: {
  label: string;
  tone?: string;
  value: number;
}) {
  return (
    <div className="min-w-0">
      <p className={`font-serif text-2xl font-bold leading-none ${tone}`}>{value}</p>
      <p className="mt-1 text-xs font-bold leading-none text-[#6d746f]">{label}</p>
    </div>
  );
}

function MetricTile({
  label,
  suffix,
  value,
}: {
  label: string;
  suffix?: string;
  value: number;
}) {
  return (
    <div className="metric-tile">
      <p className="text-xs font-extrabold text-[#6d746f]">{label}</p>
      <p className="font-serif text-2xl font-bold leading-none text-[#1f2523]">
        {value}
        {suffix ? <span className="text-sm">{suffix}</span> : null}
      </p>
    </div>
  );
}
