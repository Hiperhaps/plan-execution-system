import Link from "next/link";
import type { GoalProgressItem } from "@/components/dashboard/types";

export function GoalProgressSection({ goals }: { goals: GoalProgressItem[] }) {
  const averageProgress =
    goals.length === 0
      ? 0
      : Math.round(
          goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length,
        );

  return (
    <section className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="page-kicker">Goals</p>
          <h2 className="mt-1 text-lg font-extrabold text-[#1f2523]">
            目标进度
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#6d746f]">
            平均完成度 {averageProgress}%
          </p>
        </div>
        <span className="count-pill">{goals.length}</span>
      </div>

      <div className="mt-4">
        {goals.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#d8d0c1] bg-[#f8f3ea] px-4 py-8 text-sm font-semibold text-[#6d746f]">
            还没有目标，先创建一个目标开始规划。
          </p>
        ) : (
          <div className="grid gap-3">
            {goals.map((goal) => (
              <Link
                key={goal.id}
                href={`/goals/${goal.id}`}
                className="block rounded-lg border border-[#e2d9cb] bg-[#fffdf7]/80 p-3 transition hover:border-[#b8ad9b] hover:bg-[#fffdf7]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-extrabold text-[#1f2523]">
                      {goal.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[#6d746f]">
                      {goal.completedTasks}/{goal.totalTasks} 个任务已完成
                    </p>
                  </div>
                  <span className="font-serif text-xl font-bold text-[#0f766e]">
                    {goal.progress}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eee7d9]">
                  <div
                    className="h-full rounded-full bg-[#0f766e] transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
