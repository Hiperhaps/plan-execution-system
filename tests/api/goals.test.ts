import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  createGoal,
  deleteGoal,
  getGoalById,
  listGoals,
  updateGoal,
} from "@/services/goal.service";
import { requireApiUserId } from "@/lib/auth-session";
import * as goalsRoute from "@/app/api/goals/route";
import * as goalRoute from "@/app/api/goals/[goalId]/route";

vi.mock("@/lib/auth-session", () => ({
  requireApiUserId: vi.fn(),
}));

vi.mock("@/services/goal.service", () => ({
  createGoal: vi.fn(),
  deleteGoal: vi.fn(),
  getGoalById: vi.fn(),
  listGoals: vi.fn(),
  updateGoal: vi.fn(),
}));

const mockedCreateGoal = vi.mocked(createGoal);
const mockedDeleteGoal = vi.mocked(deleteGoal);
const mockedGetGoalById = vi.mocked(getGoalById);
const mockedListGoals = vi.mocked(listGoals);
const mockedUpdateGoal = vi.mocked(updateGoal);
const mockedRequireApiUserId = vi.mocked(requireApiUserId);

const now = new Date("2026-06-05T08:00:00.000Z");
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

function routeContext(goalId: string) {
  return {
    params: Promise.resolve({ goalId }),
  };
}

describe("Goal API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRequireApiUserId.mockResolvedValue(userId);
  });

  it("lists goals", async () => {
    const goals = [
      {
        id: "goal-1",
        userId,
        title: "完成 MVP",
        description: null,
        status: "ACTIVE",
        startDate: null,
        targetDate: null,
        createdAt: now,
        updatedAt: now,
      },
    ];
    mockedListGoals.mockResolvedValue(goals);

    const response = await goalsRoute.GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ data: goals.map(serializeDates) });
    expect(mockedListGoals).toHaveBeenCalledWith(userId);
  });

  it("creates a goal", async () => {
    const goal = {
      id: "goal-1",
      userId,
      title: "完成 MVP",
      description: null,
      status: "ACTIVE",
      startDate: null,
      targetDate: null,
      createdAt: now,
      updatedAt: now,
    };
    mockedCreateGoal.mockResolvedValue(goal);

    const response = await goalsRoute.POST(
      jsonRequest("http://localhost/api/goals", {
        title: "完成 MVP",
        description: "",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toEqual({ data: serializeDates(goal) });
    expect(mockedCreateGoal).toHaveBeenCalledWith(userId, {
      title: "完成 MVP",
      description: null,
      status: "ACTIVE",
    });
  });

  it("returns 400 when creating a goal with invalid input", async () => {
    const response = await goalsRoute.POST(
      jsonRequest("http://localhost/api/goals", {
        title: "",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.message).toBe("请求参数不正确");
    expect(payload.issues.title).toBeDefined();
    expect(mockedCreateGoal).not.toHaveBeenCalled();
  });

  it("returns a single goal", async () => {
    const goal = {
      id: "goal-1",
      userId,
      title: "完成 MVP",
      description: "基础版本",
      status: "ACTIVE",
      startDate: null,
      targetDate: null,
      createdAt: now,
      updatedAt: now,
    };
    mockedGetGoalById.mockResolvedValue(goal);

    const response = await goalRoute.GET(
      new Request("http://localhost/api/goals/goal-1"),
      routeContext("goal-1"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ data: serializeDates(goal) });
    expect(mockedGetGoalById).toHaveBeenCalledWith(userId, "goal-1");
  });

  it("returns 404 when a goal does not exist", async () => {
    mockedGetGoalById.mockResolvedValue(null);

    const response = await goalRoute.GET(
      new Request("http://localhost/api/goals/missing"),
      routeContext("missing"),
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({ message: "目标不存在" });
  });

  it("updates a goal", async () => {
    const goal = {
      id: "goal-1",
      userId,
      title: "完成 MVP v2",
      description: null,
      status: "COMPLETED",
      startDate: null,
      targetDate: null,
      createdAt: now,
      updatedAt: now,
    };
    mockedUpdateGoal.mockResolvedValue(goal);

    const response = await goalRoute.PATCH(
      jsonRequest("http://localhost/api/goals/goal-1", {
        title: "完成 MVP v2",
        description: "",
        status: "COMPLETED",
      }),
      routeContext("goal-1"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ data: serializeDates(goal) });
    expect(mockedUpdateGoal).toHaveBeenCalledWith(userId, "goal-1", {
      title: "完成 MVP v2",
      description: null,
      status: "COMPLETED",
    });
  });

  it("deletes a goal", async () => {
    mockedDeleteGoal.mockResolvedValue({ count: 1 });

    const response = await goalRoute.DELETE(
      new Request("http://localhost/api/goals/goal-1"),
      routeContext("goal-1"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ data: { id: "goal-1" } });
    expect(mockedDeleteGoal).toHaveBeenCalledWith(userId, "goal-1");
  });
});

function serializeDates<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
