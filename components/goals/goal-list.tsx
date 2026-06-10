"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalCard } from "@/components/goals/goal-card";
import { useDeleteGoal } from "@/components/goals/use-delete-goal";
import type { listGoalsWithProgress } from "@/services/goal.service";

export type GoalListItem = Awaited<
  ReturnType<typeof listGoalsWithProgress>
>[number];

type GoalListProps = {
  goals: GoalListItem[];
};

export function GoalList({ goals }: GoalListProps) {
  const [items, setItems] = useState(goals);
  const { deleteGoal, deletingId, error } = useDeleteGoal();

  async function handleDelete(goalId: string) {
    const deleted = await deleteGoal(goalId);

    if (deleted) {
      setItems((current) => current.filter((goal) => goal.id !== goalId));
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="还没有目标"
        description="先创建一个长期目标，再逐步拆解成可执行任务。"
      />
    );
  }

  return (
    <div className="grid gap-4">
      {error ? <p className="alert-error">{error}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            isDeleting={deletingId === goal.id}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
