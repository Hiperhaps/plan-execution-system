import { BackLink } from "@/components/ui/back-link";
import { requirePageUserId } from "@/lib/page-auth";
import { TaskOverview } from "@/components/tasks/task-overview";
import { resolveEstimatedHours } from "@/lib/task-estimate";
import { listAllTasks } from "@/services/task.service";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const userId = await requirePageUserId();
  const tasks = await listAllTasks(userId);
  const totalHours = tasks.reduce(
    (sum, task) =>
      sum + (resolveEstimatedHours(task.estimatedHours, task.description) ?? 0),
    0,
  );

  return (
    <main className="app-shell page-frame">
      <BackLink href="/" label="返回首页" />

      <header className="page-hero">
        <div>
          <p className="page-kicker">Tasks</p>
          <h1 className="page-title">任务总览</h1>
          <p className="page-copy mt-4 max-w-2xl">
            跨目标查看所有任务状态，快速发现正在推进、已经逾期和已经完成的事项。
          </p>
        </div>
        <section className="panel-tight p-4">
          <p className="text-sm font-extrabold text-[#0f766e]">工作量</p>
          <p className="mt-3 font-serif text-4xl font-bold text-[#1f2523]">
            {totalHours}
            <span className="text-xl">h</span>
          </p>
          <p className="mt-1 text-xs font-bold text-[#6d746f]">
            当前任务预计总耗时
          </p>
        </section>
      </header>

      <TaskOverview
        tasks={tasks.map((task) => ({
          id: task.id,
          goalId: task.goalId,
          goalTitle: task.goal.title,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate?.toISOString() ?? null,
          estimatedHours: resolveEstimatedHours(
            task.estimatedHours,
            task.description,
          ),
        }))}
      />
    </main>
  );
}
