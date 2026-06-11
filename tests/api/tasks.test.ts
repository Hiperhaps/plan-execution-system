import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasksByGoal,
  updateTask,
} from "@/services/task.service";
import { requireApiUserId } from "@/lib/auth-session";
import * as tasksRoute from "@/app/api/tasks/route";
import * as taskRoute from "@/app/api/tasks/[taskId]/route";

vi.mock("@/lib/auth-session", () => ({
  requireApiUserId: vi.fn(),
}));

vi.mock("@/services/task.service", () => ({
  createTask: vi.fn(),
  deleteTask: vi.fn(),
  getTaskById: vi.fn(),
  listTasksByGoal: vi.fn(),
  updateTask: vi.fn(),
}));

const mockedCreateTask = vi.mocked(createTask);
const mockedDeleteTask = vi.mocked(deleteTask);
const mockedGetTaskById = vi.mocked(getTaskById);
const mockedListTasksByGoal = vi.mocked(listTasksByGoal);
const mockedUpdateTask = vi.mocked(updateTask);
const mockedRequireApiUserId = vi.mocked(requireApiUserId);

const now = new Date("2026-06-05T08:00:00.000Z");
const dueDate = new Date("2026-06-10T00:00:00.000Z");
const userId = "user-1";

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function routeContext(taskId: string) {
  return {
    params: Promise.resolve({ taskId }),
  };
}

describe("Task API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRequireApiUserId.mockResolvedValue(userId);
  });

  it("requires goalId when listing tasks", async () => {
    const response = await tasksRoute.GET(
      new Request("http://localhost/api/tasks"),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ message: "缺少 goalId" });
    expect(mockedListTasksByGoal).not.toHaveBeenCalled();
  });

  it("lists tasks by goal", async () => {
    const tasks = [
      {
        id: "task-1",
        userId,
        goalId: "goal-1",
        title: "设计数据模型",
        description: null,
        phase: null,
        estimatedHours: null,
        status: "TODO",
        priority: "HIGH",
        dueDate,
        completedAt: null,
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
    ];
    mockedListTasksByGoal.mockResolvedValue(tasks);

    const response = await tasksRoute.GET(
      new Request("http://localhost/api/tasks?goalId=goal-1"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ data: tasks.map(serializeDates) });
    expect(mockedListTasksByGoal).toHaveBeenCalledWith(userId, "goal-1");
  });

  it("creates a task", async () => {
    const task = {
      id: "task-1",
      userId,
      goalId: "goal-1",
      title: "设计数据模型",
      description: null,
      phase: null,
      estimatedHours: 2,
      status: "DONE",
      priority: "HIGH",
      dueDate,
      completedAt: now,
      order: 0,
      createdAt: now,
      updatedAt: now,
    };
    mockedCreateTask.mockResolvedValue(task);

    const response = await tasksRoute.POST(
      jsonRequest("http://localhost/api/tasks", {
        goalId: "goal-1",
        title: "设计数据模型",
        priority: "HIGH",
        status: "DONE",
        dueDate: "2026-06-10",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toEqual({ data: serializeDates(task) });
    expect(mockedCreateTask).toHaveBeenCalledWith(userId, {
      goalId: "goal-1",
      title: "设计数据模型",
      description: undefined,
      status: "DONE",
      priority: "HIGH",
      dueDate: expect.any(Date),
      completedAt: expect.any(Date),
    });
  });

  it("returns 400 when creating a task with invalid input", async () => {
    const response = await tasksRoute.POST(
      jsonRequest("http://localhost/api/tasks", {
        goalId: "goal-1",
        title: "",
        priority: "URGENT",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe("请求参数不正确");
    expect(payload.issues.title).toBeDefined();
    expect(payload.issues.priority).toBeDefined();
    expect(mockedCreateTask).not.toHaveBeenCalled();
  });

  it("returns a single task", async () => {
    const task = {
      id: "task-1",
      userId,
      goalId: "goal-1",
      title: "设计数据模型",
      description: null,
      phase: null,
      estimatedHours: null,
      status: "TODO",
      priority: "HIGH",
      dueDate,
      completedAt: null,
      order: 0,
      createdAt: now,
      updatedAt: now,
    };
    mockedGetTaskById.mockResolvedValue(task);

    const response = await taskRoute.GET(
      new Request("http://localhost/api/tasks/task-1"),
      routeContext("task-1"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ data: serializeDates(task) });
    expect(mockedGetTaskById).toHaveBeenCalledWith(userId, "task-1");
  });

  it("returns 404 when a task does not exist", async () => {
    mockedGetTaskById.mockResolvedValue(null);

    const response = await taskRoute.GET(
      new Request("http://localhost/api/tasks/missing"),
      routeContext("missing"),
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({ message: "任务不存在" });
  });

  it("updates a task and sets completedAt when marked done", async () => {
    const task = {
      id: "task-1",
      userId,
      goalId: "goal-1",
      title: "设计数据模型",
      description: null,
      phase: null,
      estimatedHours: 2,
      status: "DONE",
      priority: "HIGH",
      dueDate,
      completedAt: now,
      order: 0,
      createdAt: now,
      updatedAt: now,
    };
    mockedUpdateTask.mockResolvedValue(task);

    const response = await taskRoute.PATCH(
      jsonRequest("http://localhost/api/tasks/task-1", {
        status: "DONE",
      }),
      routeContext("task-1"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ data: serializeDates(task) });
    expect(mockedUpdateTask).toHaveBeenCalledWith(userId, "task-1", {
      status: "DONE",
      completedAt: expect.any(Date),
    });
  });

  it("deletes a task", async () => {
    mockedDeleteTask.mockResolvedValue({ count: 1 });

    const response = await taskRoute.DELETE(
      new Request("http://localhost/api/tasks/task-1"),
      routeContext("task-1"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ data: { id: "task-1" } });
    expect(mockedDeleteTask).toHaveBeenCalledWith(userId, "task-1");
  });
});

function serializeDates<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
