import Link from "next/link";
import { GoalList } from "@/components/goals/goal-list";
import { BackLink } from "@/components/ui/back-link";
import { listGoalsWithProgress } from "@/services/goal.service";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const goals = await listGoalsWithProgress();
  const activeGoals = goals.filter(
    (goal) => goal.displayStatus === "ACTIVE",
  ).length;
  const completedGoals = goals.filter(
    (goal) => goal.displayStatus === "COMPLETED",
  ).length;

  return (
    <main className="app-shell page-frame">
      <BackLink href="/" label="返回首页" />

      <header className="page-hero">
        <div>
          <p className="page-kicker">Goals Archive</p>
          <h1 className="page-title">目标管理</h1>
          <p className="page-copy mt-4 max-w-2xl">
            用一个清晰的目标库管理长期方向，再进入详情页拆解任务和推进状态。
          </p>
        </div>
        <div className="panel-tight p-4">
          <p className="text-sm font-extrabold text-[#0f766e]">目标概览</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <MiniStat label="全部" value={goals.length} />
            <MiniStat label="进行中" value={activeGoals} />
            <MiniStat label="已完成" value={completedGoals} />
          </div>
        </div>
      </header>

      <div className="toolbar">
        <p className="text-sm font-bold text-[#6d746f]">
          点击目标进入详情，或直接删除不再需要的目标。
        </p>
        <Link href="/goals/new" className="btn-primary">
          新增目标
        </Link>
      </div>

      <GoalList goals={goals} />
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-serif text-3xl font-bold text-[#1f2523]">{value}</p>
      <p className="mt-1 text-xs font-bold text-[#6d746f]">{label}</p>
    </div>
  );
}
