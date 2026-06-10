import { ReviewWorkspace } from "@/components/reviews/review-workspace";
import { BackLink } from "@/components/ui/back-link";
import { listGoals } from "@/services/goal.service";
import { listReviews } from "@/services/review.service";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [goals, reviews] = await Promise.all([listGoals(), listReviews()]);

  return (
    <main className="app-shell page-frame">
      <BackLink href="/" label="返回首页" />

      <header className="page-hero">
        <div>
          <p className="page-kicker">Review Center</p>
          <h1 className="page-title">复盘中心</h1>
          <p className="page-copy mt-4 max-w-2xl">
            可以针对单个目标做周复盘，也可以从全项目视角检查整体推进节奏。
          </p>
        </div>
        <section className="panel-tight p-4">
          <p className="text-sm font-extrabold text-[#0f766e]">历史记录</p>
          <p className="mt-3 font-serif text-4xl font-bold text-[#1f2523]">
            {reviews.length}
          </p>
          <p className="mt-1 text-xs font-bold text-[#6d746f]">已保存复盘</p>
        </section>
      </header>

      <ReviewWorkspace
        goals={goals.map((goal) => ({
          id: goal.id,
          title: goal.title,
        }))}
          reviews={reviews.map((review) => ({
            id: review.id,
            type: review.type,
            goal: review.goal
              ? {
                  title: review.goal.title,
              }
            : null,
          periodStart: review.periodStart.toISOString(),
          periodEnd: review.periodEnd.toISOString(),
          summary: review.summary,
          createdAt: review.createdAt.toISOString(),
          updatedAt: review.updatedAt.toISOString(),
        }))}
      />
    </main>
  );
}
