"use client";

import { FormEvent, useMemo, useState } from "react";
import type { TaskStatus } from "@/lib/task-options";
import type { TaskDelayDays } from "@/lib/task-delay-options";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";
import {
  emptyTaskForm,
  type TaskFormState,
  type TaskItem,
} from "@/components/tasks/types";
import { useTaskMutations } from "@/components/tasks/use-task-mutations";

type TaskManagerProps = {
  goalId: string;
  initialTasks: TaskItem[];
};

function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export function TaskManager({ goalId, initialTasks }: TaskManagerProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState<TaskFormState>(emptyTaskForm);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const {
    delayTask,
    error,
    isSubmitting,
    removeTask,
    saveTask,
    setError,
    updateTaskStatus,
  } = useTaskMutations();

  const editingTask = useMemo(
    () => tasks.find((task) => task.id === editingTaskId),
    [editingTaskId, tasks],
  );

  function resetForm() {
    setForm(emptyTaskForm);
    setEditingTaskId(null);
    setError("");
  }

  function startEdit(task: TaskItem) {
    setEditingTaskId(task.id);
    setForm({
      title: task.title,
      description: task.description ?? "",
      status: task.status as TaskFormState["status"],
      priority: task.priority as TaskFormState["priority"],
      dueDate: toDateInputValue(task.dueDate),
    });
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const savedTask = await saveTask({
      goalId,
      taskId: editingTaskId ?? undefined,
      form,
    });

    if (!savedTask) {
      return;
    }

    if (editingTaskId) {
      setTasks((current) =>
        current.map((task) => (task.id === editingTaskId ? savedTask : task)),
      );
    } else {
      setTasks((current) => [savedTask, ...current]);
    }

    resetForm();
  }

  async function handleStatusChange(task: TaskItem, status: TaskStatus) {
    const updatedTask = await updateTaskStatus(task.id, status);

    if (!updatedTask) {
      return;
    }

    setTasks((current) =>
      current.map((item) => (item.id === task.id ? updatedTask : item)),
    );
  }

  async function handleDelay(task: TaskItem, days: TaskDelayDays) {
    const updatedTask = await delayTask(task.id, days);

    if (!updatedTask) {
      return;
    }

    setTasks((current) =>
      current.map((item) => (item.id === task.id ? updatedTask : item)),
    );
  }

  async function handleDelete(taskId: string) {
    const deleted = await removeTask(taskId);

    if (!deleted) {
      return;
    }

    setTasks((current) => current.filter((task) => task.id !== taskId));
    if (editingTaskId === taskId) {
      resetForm();
    }
  }

  return (
    <section className="workspace-grid">
      <div className="main-stack">
        <TaskList
          tasks={tasks}
          onEdit={startEdit}
          onDelete={handleDelete}
          onDelay={handleDelay}
          onStatusChange={handleStatusChange}
        />
      </div>

      <aside className="side-stack">
        <TaskForm
          form={form}
          isEditing={Boolean(editingTask)}
          isSubmitting={isSubmitting}
          error={error}
          onChange={setForm}
          onCancelEdit={resetForm}
          onSubmit={handleSubmit}
        />
      </aside>
    </section>
  );
}
