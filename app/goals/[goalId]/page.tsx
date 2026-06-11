import { notFound } from "next/navigation";
import { TaskManager } from "@/components/tasks/task-manager";
import type { TaskItem } from "@/components/tasks/types";
import { BackLink } from "@/components/ui/back-link";
import { getGoalStatusLabel } from "@/lib/goal-options";
import { requirePageUserId } from "@/lib/page-auth";
import { resolveEstimatedHours } from "@/lib/task-estimate";
import { getGoalById } from "@/services/goal.service";
import { listTasksByGoal } from "@/services/task.service";

type GoalDetailPageProps = {
  params: Promise<{
    goalId: string;
  }>;
};

function toTaskItem(task: Awaited<ReturnType<typeof listTasksByGoal>>[number]) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    phase: task.phase,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    estimatedHours: resolveEstimatedHours(
      task.estimatedHours,
      task.description,
    ),
  } satisfies TaskItem;
}

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const userId = await requirePageUserId();
  const { goalId } = await params;
  const [goal, tasks] = await Promise.all([
    getGoalById(userId, goalId),
    listTasksByGoal(userId, goalId),
  ]);

  if (!goal) {
    notFound();
  }

  const doneTasks = tasks.filter((task) => task.status === "DONE").length;
  const totalHours = tasks.reduce(
    (sum, task) =>
      sum + (resolveEstimatedHours(task.estimatedHours, task.description) ?? 0),
    0,
  );

  return (
    <main className="app-shell page-frame">
      <BackLink href="/goals" label="返回目标列表" />

      <header className="page-hero">
        <div>
          <p className="page-kicker">Goal Detail</p>
          <h1 className="page-title">{goal.title}</h1>
          {goal.description ? (
            <p className="page-copy mt-4 max-w-3xl">{goal.description}</p>
          ) : null}
        </div>

        <section className="panel-tight p-4">
          <div className="flex flex-wrap gap-2">
            <span className="chip">{getGoalStatusLabel(goal.status)}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <GoalStat label="任务" value={tasks.length} />
            <GoalStat label="完成" value={doneTasks} />
            <GoalStat label="预计" value={totalHours} suffix="h" />
          </div>
        </section>
      </header>

      <TaskManager goalId={goal.id} initialTasks={tasks.map(toTaskItem)} />
    </main>
  );
}

function GoalStat({
  label,
  suffix,
  value,
}: {
  label: string;
  suffix?: string;
  value: number;
}) {
  return (
    <div>
      <p className="font-serif text-3xl font-bold text-[#1f2523]">
        {value}
        {suffix ? <span className="text-lg">{suffix}</span> : null}
      </p>
      <p className="mt-1 text-xs font-bold text-[#6d746f]">{label}</p>
    </div>
  );
}
