"use client";

import { FormEvent, useState } from "react";
import { AiPlanInputForm } from "@/components/ai-plan/ai-plan-input-form";
import { AiPlanPreview } from "@/components/ai-plan/ai-plan-preview";
import {
  initialAiPlanForm,
  type AiPlanFormState,
} from "@/components/ai-plan/types";
import { useAiPlan } from "@/components/ai-plan/use-ai-plan";

export function AiPlanForm() {
  const [form, setForm] = useState<AiPlanFormState>(initialAiPlanForm);
  const {
    error,
    generatePlan,
    isGenerating,
    isSaving,
    plan,
    savePlan,
  } = useAiPlan();

  function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    generatePlan(form);
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
      <aside className="side-stack">
        <AiPlanInputForm
          error={error}
          form={form}
          isGenerating={isGenerating}
          isSaving={isSaving}
          onChange={setForm}
          onSubmit={handleGenerate}
        />
      </aside>
      <div className="main-stack min-w-0">
        <AiPlanPreview
          isGenerating={isGenerating}
          isSaving={isSaving}
          onAdjust={(adjustment) => generatePlan(form, adjustment)}
          onSave={savePlan}
          plan={plan}
        />
      </div>
    </section>
  );
}
