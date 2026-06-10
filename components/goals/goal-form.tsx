"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  getRequestErrorMessage,
  requestJson,
} from "@/lib/http-client";

type FormState = {
  title: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
};

const initialState: FormState = {
  title: "",
  description: "",
  status: "ACTIVE",
};

export function GoalForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await requestJson<{ data: unknown }>(
        "/api/goals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description || undefined,
            status: form.status,
          }),
        },
        "创建目标失败",
      );

      router.push("/goals");
      router.refresh();
    } catch (error) {
      setError(getRequestErrorMessage(error, "创建目标失败"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-6">
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="field-label">目标标题</span>
          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            className="field"
            placeholder="例如：三个月内完成 Next.js 项目 MVP"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">目标描述</span>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className="field min-h-36 leading-7"
            placeholder="补充目标背景、完成标准或约束条件。"
          />
        </label>

        <label className="grid gap-2">
          <span className="field-label">状态</span>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as FormState["status"],
              }))
            }
            className="field"
          >
            <option value="ACTIVE">进行中</option>
            <option value="COMPLETED">已完成</option>
            <option value="ARCHIVED">已归档</option>
          </select>
        </label>

        {error ? <p className="alert-error">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "创建中..." : "创建目标"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/goals")}
            className="btn-secondary"
          >
            取消
          </button>
        </div>
      </div>
    </form>
  );
}
