import { GoalForm } from "@/components/goals/goal-form";
import { BackLink } from "@/components/ui/back-link";

export default function NewGoalPage() {
  return (
    <main className="app-shell page-frame">
      <BackLink href="/goals" label="返回目标列表" />

      <header className="page-hero">
        <div>
          <p className="page-kicker">New Goal</p>
          <h1 className="page-title">创建目标</h1>
          <p className="page-copy mt-4 max-w-2xl">
            先写清楚方向、完成标准和当前状态，任务拆解可以在目标详情页继续完善。
          </p>
        </div>
      </header>

      <div className="workspace-grid">
        <div className="main-stack">
          <GoalForm />
        </div>
        <aside className="side-stack">
          <section className="panel p-4">
            <p className="page-kicker">Prompt</p>
            <h2 className="mt-2 text-lg font-extrabold text-[#1f2523]">
              写目标时保留边界
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#6d746f]">
              一个好目标最好能回答：为什么做、何时算完成、当前最明显的约束是什么。
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
