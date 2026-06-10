import Link from "next/link";
import {
  getTaskPriorityLabel,
  getTaskStatusLabel,
  TASK_STATUSES,
  type TaskStatus,
} from "@/lib/task-options";

type OverviewTask = {
  id: string;
  goalId: string;
  goalTitle: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  estimatedHours: number | null;
};

type TaskOverviewProps = {
  tasks: OverviewTask[];
};

const statusTone: Record<TaskStatus, string> = {
  TODO: "border-t-[#687a36]",
  IN_PROGRESS: "border-t-[#0f766e]",
  DONE: "border-t-[#b8ad9b]",
  DELAYED: "border-t-[#c2412d]",
};

function formatDate(value: string | null) {
  if (!value) {
    return "未设置";
  }

  return new Date(value).toLocaleDateString("zh-CN");
}

function formatEstimatedHours(value: number | null) {
  return value ? `${value} 小时` : "未估时";
}

function isOverdue(task: OverviewTask) {
  if (!task.dueDate || task.status === "DONE") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(task.dueDate).getTime() < today.getTime();
}

export function TaskOverview({ tasks }: TaskOverviewProps) {
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    overdue: tasks.filter(isOverdue).length,
    done: tasks.filter((task) => task.status === "DONE").length,
  };

  const groupedTasks = TASK_STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((task) => task.status === status),
  }));

  if (tasks.length === 0) {
    return (
      <div className="panel-quiet border-dashed px-6 py-10 text-center">
        <p className="text-sm font-extrabold text-[#1f2523]">还没有任务</p>
        <p className="mt-2 text-sm leading-6 text-[#6d746f]">
          进入目标详情页创建任务后，这里会显示跨目标的任务概览。
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="metric-strip">
        <StatCard label="全部任务" value={stats.total} />
        <StatCard label="进行中" value={stats.inProgress} />
        <StatCard label="已逾期" value={stats.overdue} tone="text-[#c2412d]" />
        <StatCard label="已完成" value={stats.done} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {groupedTasks.map((group) => (
          <div
            key={group.status}
            className={`panel border-t-4 ${statusTone[group.status]} p-5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="section-title">
                  {getTaskStatusLabel(group.status)}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#6d746f]">
                  按状态聚合，方便快速扫一遍执行情况。
                </p>
              </div>
              <span className="count-pill">{group.tasks.length}</span>
            </div>

            <div className="mt-4 grid gap-3">
              {group.tasks.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[#d8d0c1] bg-[#f8f3ea] px-4 py-8 text-sm font-semibold text-[#6d746f]">
                  暂无{getTaskStatusLabel(group.status)}任务。
                </p>
              ) : (
                group.tasks.map((task) => (
                  <TaskOverviewCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "text-[#0f766e]",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="metric-tile">
      <p className={`font-serif text-3xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs font-extrabold text-[#6d746f]">{label}</p>
    </div>
  );
}

function TaskOverviewCard({ task }: { task: OverviewTask }) {
  return (
    <Link
      href={`/goals/${task.goalId}`}
      className="task-row block"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold leading-6 text-[#1f2523]">
            {task.title}
          </h3>
          <p className="mt-1 text-xs font-bold text-[#6d746f]">
            所属目标：{task.goalTitle}
          </p>
          {task.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6d746f]">
              {task.description}
            </p>
          ) : null}
        </div>
        {isOverdue(task) ? (
          <span className="chip shrink-0 bg-[#fff1ec] text-[#c2412d]">
            已逾期
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="chip">优先级：{getTaskPriorityLabel(task.priority)}</span>
        <span className="chip">预计：{formatEstimatedHours(task.estimatedHours)}</span>
        <span className="chip">截止：{formatDate(task.dueDate)}</span>
      </div>
    </Link>
  );
}
