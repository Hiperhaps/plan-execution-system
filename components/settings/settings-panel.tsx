"use client";

import { useEffect, useMemo, useState } from "react";
import {
  applyPreferences,
  backgroundOptions,
  defaultPreferences,
  languageOptions,
  persistPreferences,
  readStoredPreferences,
  shellCopy,
  themeOptions,
  type AppPreferences,
  type BackgroundId,
  type LanguageCode,
  type ThemeId,
} from "@/lib/preferences";

type ColorPreferenceKey =
  | "customAccent"
  | "customAccent2"
  | "customBackground"
  | "customPanel";

const colorControls: Array<{
  key: ColorPreferenceKey;
  label: string;
  description: string;
}> = [
  {
    key: "customAccent",
    label: "主强调色",
    description: "按钮、导航高亮、关键数据",
  },
  {
    key: "customAccent2",
    label: "辅助强调色",
    description: "标签、提示、渐变第二色",
  },
  {
    key: "customBackground",
    label: "页面底色",
    description: "系统右侧工作区底色",
  },
  {
    key: "customPanel",
    label: "面板底色",
    description: "卡片、表单和列表容器",
  },
];

export function SettingsPanel() {
  const [preferences, setPreferences] =
    useState<AppPreferences>(defaultPreferences);

  useEffect(() => {
    const stored = readStoredPreferences();
    applyPreferences(stored);
    window.setTimeout(() => setPreferences(stored), 0);
  }, []);

  const copy = shellCopy[preferences.language] ?? shellCopy["zh-CN"];
  const selectedTheme = useMemo(
    () =>
      themeOptions.find((theme) => theme.id === preferences.theme) ??
      themeOptions[0],
    [preferences.theme],
  );
  const selectedBackground = useMemo(
    () =>
      backgroundOptions.find(
        (background) => background.id === preferences.background,
      ) ?? backgroundOptions[0],
    [preferences.background],
  );
  const selectedLanguage = useMemo(
    () =>
      languageOptions.find((language) => language.code === preferences.language),
    [preferences.language],
  );

  function updatePreferences(next: AppPreferences) {
    setPreferences(next);
    persistPreferences(next);
  }

  function setTheme(theme: ThemeId) {
    updatePreferences({ ...preferences, theme });
  }

  function setBackground(background: BackgroundId) {
    updatePreferences({ ...preferences, background });
  }

  function setLanguage(language: LanguageCode) {
    updatePreferences({ ...preferences, language });
  }

  function setCustomColor(key: ColorPreferenceKey, value: string) {
    updatePreferences({
      ...preferences,
      [key]: value,
      theme:
        key === "customAccent" || key === "customAccent2"
          ? "custom"
          : preferences.theme,
      background:
        key === "customBackground" || key === "customPanel"
          ? "custom"
          : preferences.background,
    });
  }

  function resetPreferences() {
    updatePreferences(defaultPreferences);
  }

  return (
    <section className="settings-grid">
      <div className="settings-main">
        <section className="panel p-5">
          <div>
            <p className="page-kicker">Quick Select</p>
            <h2 className="mt-2 text-xl font-extrabold text-[var(--ink)]">
              快速选择
            </h2>
          </div>

          <div className="settings-select-grid mt-4">
            <label className="settings-select-field">
              <span>主题颜色</span>
              <select
                value={preferences.theme}
                onChange={(event) => setTheme(event.target.value as ThemeId)}
                className="field"
              >
                {themeOptions.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="settings-select-field">
              <span>背景样式</span>
              <select
                value={preferences.background}
                onChange={(event) =>
                  setBackground(event.target.value as BackgroundId)
                }
                className="field"
              >
                {backgroundOptions.map((background) => (
                  <option key={background.id} value={background.id}>
                    {background.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="settings-select-field">
              <span>系统语言</span>
              <select
                value={preferences.language}
                onChange={(event) =>
                  setLanguage(event.target.value as LanguageCode)
                }
                className="field"
              >
                {languageOptions.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.nativeName} / {language.englishName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="panel p-5">
          <div className="toolbar">
            <div>
              <p className="page-kicker">Visual Theme</p>
              <h2 className="mt-2 text-xl font-extrabold text-[var(--ink)]">
                全局视觉颜色
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                选择系统强调色，或使用自定义颜色搭配导航、按钮、提示和关键数据。
              </p>
            </div>
            <span className="chip">{selectedTheme.name}</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {themeOptions.map((theme) => {
              const active = preferences.theme === theme.id;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setTheme(theme.id)}
                  className="theme-card"
                  data-active={active}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-extrabold text-[var(--ink)]">
                        {theme.name}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
                        {theme.description}
                      </span>
                    </span>
                    <span className="theme-check">{active ? "Active" : ""}</span>
                  </span>
                  <span className="mt-4 flex gap-2">
                    {theme.colors.map((color) => (
                      <span
                        key={color}
                        className="theme-swatch"
                        style={{ background: color }}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel p-5">
          <div className="toolbar">
            <div>
              <p className="page-kicker">Background</p>
              <h2 className="mt-2 text-xl font-extrabold text-[var(--ink)]">
                页面背景
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                背景不仅可以切换预设，也可以像文档配色一样单独设置页面底色和面板底色。
              </p>
            </div>
            <span className="chip">{selectedBackground.name}</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {backgroundOptions.map((background) => {
              const active = preferences.background === background.id;

              return (
                <button
                  key={background.id}
                  type="button"
                  onClick={() => setBackground(background.id)}
                  className="background-card"
                  data-active={active}
                >
                  <span className="background-preview">
                    <span
                      style={{
                        backgroundColor: background.colors.sidebar,
                        borderColor: background.colors.line,
                      }}
                    />
                    <span style={{ backgroundColor: background.colors.panel }} />
                  </span>
                  <span className="mt-3 block text-sm font-extrabold text-[var(--ink)]">
                    {background.name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
                    {background.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel p-5">
          <div>
            <p className="page-kicker">Custom Palette</p>
            <h2 className="mt-2 text-xl font-extrabold text-[var(--ink)]">
              自定义调色板
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              选择自定义主题或自定义背景后，下方颜色会直接驱动全局 CSS 变量。
            </p>
          </div>

          <div className="custom-color-grid mt-5">
            {colorControls.map((control) => (
              <label key={control.key} className="color-control">
                <span>
                  <span className="block text-sm font-extrabold text-[var(--ink)]">
                    {control.label}
                  </span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    {control.description}
                  </span>
                </span>
                <span className="color-input-wrap">
                  <input
                    type="color"
                    value={preferences[control.key]}
                    onChange={(event) =>
                      setCustomColor(control.key, event.target.value)
                    }
                    aria-label={control.label}
                  />
                  <span>{preferences[control.key]}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="panel p-5">
          <div>
            <p className="page-kicker">Language</p>
            <h2 className="mt-2 text-xl font-extrabold text-[var(--ink)]">
              系统语言
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              选择语言后，左侧导航、系统外框、设置页以及常用功能页的系统文案会同步切换。
            </p>
          </div>

          <div className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {languageOptions.map((language) => {
              const active = preferences.language === language.code;

              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => setLanguage(language.code)}
                  className="language-row"
                  data-active={active}
                >
                  <span>
                    <span className="block text-sm font-extrabold text-[var(--ink)]">
                      {language.nativeName}
                    </span>
                    <span className="mt-1 block text-xs text-[var(--muted)]">
                      {language.englishName} / {language.code}
                    </span>
                  </span>
                  <span className="language-dot" />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="settings-side">
        <section className="panel p-5">
          <p className="page-kicker">Live Preview</p>
          <h2 className="mt-2 text-lg font-extrabold text-[var(--ink)]">
            应用预览
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            当前选择会立即作用到系统外框和右侧功能页面。
          </p>

          <div className="settings-preview mt-5">
            <div className="preview-sidebar">
              <span className="preview-brand">P</span>
              <div className="mt-4 grid gap-2">
                {copy.nav.slice(0, 5).map((item, index) => (
                  <span
                    key={item.label}
                    className="preview-nav"
                    data-active={index === 0}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="preview-content">
              <span className="preview-pill">{copy.topbarTitle}</span>
              <div className="mt-4 h-16 rounded-lg bg-[var(--accent-soft)]" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <span className="h-12 rounded-lg bg-[var(--panel-soft)]" />
                <span className="h-12 rounded-lg bg-[var(--panel-soft)]" />
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--line)]">
                <span className="block h-full w-2/3 rounded-full bg-[var(--accent)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="panel p-5">
          <p className="page-kicker">Language Coverage</p>
          <h2 className="mt-2 text-lg font-extrabold text-[var(--ink)]">
            语言覆盖范围
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            系统静态文案会切换语言；你自己创建的目标、任务、复盘内容不会被自动翻译。
          </p>
        </section>

        <section className="panel p-5">
          <p className="page-kicker">Current</p>
          <h2 className="mt-2 text-lg font-extrabold text-[var(--ink)]">
            当前设置
          </h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted)]">主题</dt>
              <dd className="font-extrabold text-[var(--ink)]">
                {selectedTheme.name}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted)]">背景</dt>
              <dd className="font-extrabold text-[var(--ink)]">
                {selectedBackground.name}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted)]">语言</dt>
              <dd className="font-extrabold text-[var(--ink)]">
                {selectedLanguage?.nativeName}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={resetPreferences}
            className="btn-secondary mt-5 w-full"
          >
            恢复默认偏好
          </button>
        </section>
      </aside>
    </section>
  );
}
