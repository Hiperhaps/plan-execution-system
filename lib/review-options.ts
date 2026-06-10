export const REVIEW_TYPES = [
  "GOAL_WEEKLY",
  "PROJECT_WEEKLY",
  "GOAL_COMPLETION",
] as const;

export type ReviewType = (typeof REVIEW_TYPES)[number];

export const reviewTypeLabels: Record<ReviewType, string> = {
  GOAL_WEEKLY: "目标周复盘",
  PROJECT_WEEKLY: "全项目周复盘",
  GOAL_COMPLETION: "目标完成总结",
};

export function getReviewTypeLabel(type: string | null | undefined) {
  if (!type) {
    return "目标周复盘";
  }

  return reviewTypeLabels[type as ReviewType] ?? type;
}
