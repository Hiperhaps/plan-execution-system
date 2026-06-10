"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRequestErrorMessage,
  requestJson,
} from "@/lib/http-client";
import { getReviewTypeLabel } from "@/lib/review-options";
import type { ReviewHistoryItem } from "./types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("zh-CN");
}

function getReviewTitle(review: ReviewHistoryItem) {
  return review.goal?.title ?? "全部目标";
}

function getReviewType(review: ReviewHistoryItem) {
  return getReviewTypeLabel(review.type);
}

function getPreview(summary: string) {
  const text = summary.replace(/\s+/g, " ").trim();

  return text.length > 72 ? `${text.slice(0, 72)}...` : text;
}

export function ReviewHistoryList({
  reviews,
}: {
  reviews: ReviewHistoryItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(reviews);
  const [selectedId, setSelectedId] = useState(reviews[0]?.id ?? "");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const selectedReview = useMemo(
    () => items.find((review) => review.id === selectedId) ?? items[0],
    [items, selectedId],
  );

  async function deleteOne(reviewId: string) {
    setError("");
    setDeletingId(reviewId);

    try {
      await requestJson<{ data: { id: string } }>(
        `/api/reviews/${reviewId}`,
        { method: "DELETE" },
        "删除复盘失败",
      );

      setItems((current) => {
        const next = current.filter((review) => review.id !== reviewId);

        if (selectedId === reviewId) {
          setSelectedId(next[0]?.id ?? "");
        }

        return next;
      });
      router.refresh();
    } catch (error) {
      setError(getRequestErrorMessage(error, "删除复盘失败"));
    } finally {
      setDeletingId(null);
    }
  }

  async function deleteAll() {
    setError("");
    setIsDeletingAll(true);

    try {
      await requestJson<{ data: { count: number } }>(
        "/api/reviews",
        { method: "DELETE" },
        "删除全部复盘失败",
      );

      setItems([]);
      setSelectedId("");
      router.refresh();
    } catch (error) {
      setError(getRequestErrorMessage(error, "删除全部复盘失败"));
    } finally {
      setIsDeletingAll(false);
    }
  }

  return (
    <section className="panel p-5">
      <div className="toolbar">
        <div>
          <p className="page-kicker">History</p>
          <h2 className="mt-2 text-xl font-extrabold text-[#1f2523]">
            历史复盘
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6d746f]">
            从列表中选择一条记录，查看完整复盘内容。
          </p>
        </div>
        <button
          type="button"
          onClick={deleteAll}
          disabled={items.length === 0 || isDeletingAll}
          className="btn-danger shrink-0"
        >
          {isDeletingAll ? "删除中..." : "删除全部复盘"}
        </button>
      </div>

      {error ? <p className="alert-error mt-4">{error}</p> : null}

      {items.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-[#d8d0c1] bg-[#f8f3ea] px-4 py-8 text-sm font-semibold text-[#6d746f]">
          还没有保存过复盘记录。
        </p>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(260px,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <div className="grid gap-3 lg:max-h-[640px] lg:overflow-auto lg:pr-2">
            {items.map((review) => {
              const isSelected = review.id === selectedReview?.id;

              return (
                <div
                  key={review.id}
                  className={`rounded-lg border p-4 text-left transition ${
                    isSelected
                      ? "border-[#0f766e] bg-[#eef4ef]"
                      : "border-[#e2d9cb] bg-[#f8f3ea] hover:border-[#b8ad9b]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(review.id)}
                    className="block w-full text-left"
                  >
                    <div className="flex flex-wrap gap-2">
                      <span className="chip">{getReviewType(review)}</span>
                      <span className="chip">{formatDate(review.periodStart)}</span>
                    </div>
                    <p className="mt-3 text-sm font-extrabold text-[#1f2523]">
                      {getReviewTitle(review)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#6d746f]">
                      {getPreview(review.summary)}
                    </p>
                  </button>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteOne(review.id)}
                      disabled={deletingId === review.id || isDeletingAll}
                      className="btn-danger min-h-9 px-3 py-1 text-xs"
                    >
                      {deletingId === review.id ? "删除中..." : "删除此复盘"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedReview ? (
            <article className="rounded-lg border border-[#e2d9cb] bg-[#f8f3ea] p-5 lg:sticky lg:top-6">
              <div className="flex flex-wrap gap-2">
                <span className="chip">{getReviewType(selectedReview)}</span>
                <span className="chip">{getReviewTitle(selectedReview)}</span>
                <span className="chip">
                  周期：{formatDate(selectedReview.periodStart)} -{" "}
                  {formatDate(selectedReview.periodEnd)}
                </span>
                <span className="chip">
                  保存：{formatDate(selectedReview.updatedAt)}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-[#1f2523]">
                {getReviewTitle(selectedReview)}
              </h3>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#383f3b]">
                {selectedReview.summary}
              </p>
              <button
                type="button"
                onClick={() => deleteOne(selectedReview.id)}
                disabled={deletingId === selectedReview.id || isDeletingAll}
                className="btn-danger mt-5"
              >
                {deletingId === selectedReview.id ? "删除中..." : "删除此复盘"}
              </button>
            </article>
          ) : null}
        </div>
      )}
    </section>
  );
}
