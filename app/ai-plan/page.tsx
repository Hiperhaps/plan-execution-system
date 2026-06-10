import { AiPlanForm } from "@/components/ai-plan/ai-plan-form";
import { BackLink } from "@/components/ui/back-link";

export default function AiPlanPage() {
  return (
    <main className="app-shell page-frame">
      <BackLink href="/" label="返回首页" />

      <header className="page-hero">
        <div>
          <p className="page-kicker">AI Plan</p>
          <h1 className="page-title">AI 计划生成</h1>
          <p className="page-copy mt-4 max-w-2xl">
            输入目标、截止日期、每周可投入时间和偏好说明，生成可预览、可调整、可保存的阶段任务计划。
          </p>
        </div>
        <section className="panel-tight p-4">
          <p className="text-sm font-extrabold text-[#0f766e]">生成流程</p>
          <ol className="mt-3 grid gap-2 text-sm font-bold leading-6 text-[#6d746f]">
            <li>1. 填写目标边界</li>
            <li>2. 预览阶段与任务</li>
            <li>3. 调整后保存为目标</li>
          </ol>
        </section>
      </header>

      <AiPlanForm />
    </main>
  );
}
