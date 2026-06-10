import type { AiPlanAdjustment } from "@/services/ai-plan.service";

export type AiPlanFormState = {
  goal: string;
  deadline: string;
  weeklyHours: string;
  preference: string;
};

export type { AiPlanAdjustment };

export type SavedGoalResponse = {
  data: {
    id: string;
  };
};

export const initialAiPlanForm: AiPlanFormState = {
  goal: "",
  deadline: "",
  weeklyHours: "5",
  preference: "",
};
