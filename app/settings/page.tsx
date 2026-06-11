import { SettingsPanel } from "@/components/settings/settings-panel";
import { requirePageUserId } from "@/lib/page-auth";

export default async function SettingsPage() {
  await requirePageUserId();

  return (
    <main className="app-shell page-frame">
      <header className="page-hero">
        <div>
          <p className="page-kicker">System Settings</p>
          <h1 className="page-title">设置中心</h1>
          <p className="page-copy mt-4 max-w-2xl">
            管理系统级视觉颜色、背景和语言偏好。偏好会保存在本机浏览器中，并立即应用到左侧导航、系统外框和常用功能页面。
          </p>
        </div>

        <section className="panel-tight p-4">
          <p className="text-sm font-extrabold text-[var(--accent)]">
            Preferences
          </p>
          <p className="mt-2 text-sm leading-6 text-[#9aa3b5]">
            主题色、背景和语言都会实时更新；用户自己输入的目标与任务内容保持原文。
          </p>
        </section>
      </header>

      <SettingsPanel />
    </main>
  );
}
