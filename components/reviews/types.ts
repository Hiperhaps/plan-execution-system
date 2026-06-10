export type GoalOption = {
  id: string;
  title: string;
};

export type ReviewTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  goalTitle?: string;
};

export type LatestReview = {
  id: string;
  summary: string;
  wins: string | null;
  blockers: string | null;
  nextActions: string | null;
  createdAt: string;
  updatedAt: string;
} | null;

export type ReviewStatsData = {
  periodStart: string;
  periodEnd: string;
  completedTasks: ReviewTask[];
  incompleteTasks: ReviewTask[];
  delayedTasks: ReviewTask[];
  completionRate: number;
  totalTasks: number;
  latestReview: LatestReview;
};

export type WeeklyReviewData = ReviewStatsData & {
  goal: GoalOption;
};

export type ProjectReviewData = ReviewStatsData;

export type GoalCompletionReviewData = ReviewStatsData & {
  goal: GoalOption;
};

export type ReviewHistoryItem = {
  id: string;
  type: string;
  goal: {
    title: string;
  } | null;
  periodStart: string;
  periodEnd: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
};
