"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { LanguageRuntime } from "@/components/ui/language-runtime";
import {
  applyPreferences,
  defaultPreferences,
  readStoredPreferences,
  shellCopy,
  type AppPreferences,
} from "@/lib/preferences";

const primaryNav = [
  { href: "/", marker: "01" },
  { href: "/goals", marker: "02" },
  { href: "/tasks", marker: "03" },
  { href: "/ai-plan", marker: "04" },
  { href: "/reviews", marker: "05" },
  { href: "/settings", marker: "06" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [preferences, setPreferences] =
    useState<AppPreferences>(defaultPreferences);

  useEffect(() => {
    const stored = readStoredPreferences();
    applyPreferences(stored);
    window.setTimeout(() => setPreferences(stored), 0);

    function handlePreferencesChange(event: Event) {
      const next = (event as CustomEvent<AppPreferences>).detail;
      setPreferences(next);
      applyPreferences(next);
    }

    window.addEventListener("plan-preferences-change", handlePreferencesChange);

    return () => {
      window.removeEventListener(
        "plan-preferences-change",
        handlePreferencesChange,
      );
    };
  }, []);

  const copy = shellCopy[preferences.language] ?? shellCopy["zh-CN"];

  return (
    <div className="admin-frame">
      <aside className="admin-sidebar">
        <Link href="/" className="brand-lockup" aria-label={copy.brand}>
          <span className="brand-mark">P</span>
          <span>
            <span className="brand-title">{copy.brand}</span>
            <span className="brand-subtitle">Execution OS</span>
          </span>
        </Link>

        <nav className="sidebar-nav" aria-label={copy.navigationLabel}>
          {primaryNav.map((item, index) => {
            const active = isActivePath(pathname, item.href);
            const navCopy = copy.nav[index];

            return (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-link"
                data-active={active}
              >
                <span className="sidebar-marker">{item.marker}</span>
                <span className="min-w-0">
                  <span className="sidebar-label">{navCopy.label}</span>
                  <span className="sidebar-description">
                    {navCopy.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p className="text-xs font-bold text-[#6f7685]">
            {copy.architectureLabel}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#9aa3b5]">
            Goal / Task / Review / AI Plan
          </p>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--accent)]">
              {copy.topbarTitle}
            </p>
            <p className="mt-1 text-sm text-[#9aa3b5]">
              {copy.topbarSubtitle}
            </p>
          </div>
          <div className="topbar-actions" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </header>

        <div className="admin-content">
          <LanguageRuntime />
          {children}
        </div>
      </div>
    </div>
  );
}
