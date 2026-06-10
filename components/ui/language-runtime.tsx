"use client";

import { useEffect, useRef } from "react";
import {
  readStoredPreferences,
  uiTranslations,
  type AppPreferences,
  type LanguageCode,
} from "@/lib/preferences";

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function shouldSkipTextNode(node: Text) {
  const parent = node.parentElement;

  if (!parent) {
    return true;
  }

  return ["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(parent.tagName);
}

function translateText(source: string, language: LanguageCode) {
  const dictionary = uiTranslations[language] ?? {};
  const normalized = normalizeText(source);
  const exact = dictionary[normalized];

  if (exact) {
    return source.replace(normalized, exact);
  }

  const prefixKeys = ["状态：", "优先级：", "预计：", "截止：", "所属目标："];
  const suffixKeys = [" 个任务已完成", " 任务已完成", " 小时"];

  for (const key of prefixKeys) {
    const translated = dictionary[key];

    if (translated && source.trimStart().startsWith(key)) {
      const rest = source.slice(source.indexOf(key) + key.length);
      const translatedRest = dictionary[normalizeText(rest)] ?? rest;

      return source.replace(`${key}${rest}`, `${translated}${translatedRest}`);
    }
  }

  for (const key of suffixKeys) {
    const translated = dictionary[normalizeText(key)];

    if (translated && source.includes(key)) {
      return source.replace(key, ` ${translated}`);
    }
  }

  return source;
}

export function LanguageRuntime() {
  const originals = useRef(new WeakMap<Text, string>());

  useEffect(() => {
    const root = document.querySelector(".admin-content");

    if (!root) {
      return;
    }

    const rootNode = root;

    function translate(language = readStoredPreferences().language) {
      const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];

      while (walker.nextNode()) {
        const node = walker.currentNode as Text;

        if (!shouldSkipTextNode(node) && normalizeText(node.textContent ?? "")) {
          nodes.push(node);
        }
      }

      for (const node of nodes) {
        const original = originals.current.get(node) ?? node.textContent ?? "";

        if (!originals.current.has(node)) {
          originals.current.set(node, original);
        }

        node.textContent =
          language === "zh-CN" ? original : translateText(original, language);
      }
    }

    const scheduleTranslate = () => {
      window.requestAnimationFrame(() => translate());
    };
    const observer = new MutationObserver(scheduleTranslate);

    translate();
    observer.observe(rootNode, { childList: true, subtree: true });

    function handlePreferencesChange(event: Event) {
      const next = (event as CustomEvent<AppPreferences>).detail;
      translate(next.language);
    }

    window.addEventListener("plan-preferences-change", handlePreferencesChange);

    return () => {
      observer.disconnect();
      window.removeEventListener(
        "plan-preferences-change",
        handlePreferencesChange,
      );
    };
  }, []);

  return null;
}
