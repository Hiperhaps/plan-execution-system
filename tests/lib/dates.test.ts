import { describe, expect, it } from "vitest";
import {
  getCurrentWeekRange,
  getDayRange,
  getUpcomingRange,
} from "@/lib/dates";

describe("date utilities", () => {
  it("returns the full local day range", () => {
    const { start, end } = getDayRange(new Date("2026-06-10T12:30:00.000Z"));

    expect(start).toEqual(new Date(2026, 5, 10, 0, 0, 0, 0));
    expect(end).toEqual(new Date(2026, 5, 10, 23, 59, 59, 999));
  });

  it("returns upcoming range from tomorrow through the requested number of days", () => {
    const { start, end } = getUpcomingRange(
      3,
      new Date("2026-06-10T12:30:00.000Z"),
    );

    expect(start).toEqual(new Date(2026, 5, 11, 0, 0, 0, 0));
    expect(end).toEqual(new Date(2026, 5, 13, 23, 59, 59, 999));
  });

  it("uses Monday as the beginning of the current week", () => {
    const { start, end } = getCurrentWeekRange(
      new Date("2026-06-10T12:30:00.000Z"),
    );

    expect(start).toEqual(new Date(2026, 5, 8, 0, 0, 0, 0));
    expect(end).toEqual(new Date(2026, 5, 14, 23, 59, 59, 999));
  });
});
