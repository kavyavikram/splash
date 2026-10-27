import { describe, expect, it } from "vitest";
import {
  classesOn,
  formatDateShort,
  formatTimeRange,
  isDateString,
  monthGrid,
  parseMonthParam,
  shiftMonth,
  slotMeetsOn,
  todayInPacific,
  upcomingClasses,
  weekdayPlural,
  type ClassSlot,
} from "./calendar";

const session = { starts_on: "2026-10-01", ends_on: "2026-12-20" };
const fridayEvening: ClassSlot = { id: "berkeley-1", location_id: "berkeley", weekday: 5, start_time: "17:30:00", end_time: "18:30:00", ...session };
const sundayLate: ClassSlot = { id: "berkeley-3", location_id: "berkeley", weekday: 0, start_time: "12:30:00", end_time: "13:30:00", ...session };
const sundayEarly: ClassSlot = { id: "berkeley-2", location_id: "berkeley", weekday: 0, start_time: "11:30:00", end_time: "12:30:00", ...session };
const slots = [fridayEvening, sundayLate, sundayEarly];

describe("class placement", () => {
  it("places a weekly class on every matching weekday in the session", () => {
    const fridays = monthGrid({ year: 2026, month: 10 }).filter(
      (d): d is string => d !== null && slotMeetsOn(fridayEvening, d),
    );
    expect(fridays).toEqual(["2026-10-02", "2026-10-09", "2026-10-16", "2026-10-23", "2026-10-30"]);
  });

  it("does not place classes outside the session dates", () => {
    expect(slotMeetsOn(fridayEvening, "2026-09-25")).toBe(false); // Friday before start
    expect(slotMeetsOn(sundayEarly, "2026-12-20")).toBe(true); // last day is inclusive
    expect(slotMeetsOn(sundayEarly, "2026-12-27")).toBe(false); // Sunday after end
    expect(classesOn(slots, "2027-01-03")).toEqual([]);
  });

  it("does not place classes on other weekdays", () => {
    expect(classesOn(slots, "2026-10-28")).toEqual([]); // a Wednesday
  });

  it("orders classes on the same day by start time", () => {
    expect(classesOn(slots, "2026-10-04").map((s) => s.id)).toEqual(["berkeley-2", "berkeley-3"]);
  });

  it("lists upcoming classes in order, starting today", () => {
    const next = upcomingClasses(slots, "2026-10-30", 4).map((c) => `${c.date} ${c.slot.id}`);
    expect(next).toEqual([
      "2026-10-30 berkeley-1",
      "2026-11-01 berkeley-2",
      "2026-11-01 berkeley-3",
      "2026-11-06 berkeley-1",
    ]);
  });

  it("returns no upcoming classes after the session ends", () => {
    expect(upcomingClasses(slots, "2026-12-21", 3)).toEqual([]);
  });
});

describe("month grid", () => {
  it("pads the first week so day 1 falls on the right weekday", () => {
    const grid = monthGrid({ year: 2026, month: 10 }); // Oct 1, 2026 is a Thursday
    expect(grid.slice(0, 5)).toEqual([null, null, null, null, "2026-10-01"]);
    expect(grid.filter(Boolean)).toHaveLength(31);
  });

  it("handles leap years", () => {
    expect(monthGrid({ year: 2028, month: 2 }).filter(Boolean)).toHaveLength(29);
  });

  it("moves between months across year boundaries", () => {
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(shiftMonth({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
  });

  it("reads the month from the URL, ignoring bad values", () => {
    const fallback = { year: 2026, month: 10 };
    expect(parseMonthParam("2026-11", fallback)).toEqual({ year: 2026, month: 11 });
    expect(parseMonthParam("2026-13", fallback)).toEqual(fallback);
    expect(parseMonthParam("nope", fallback)).toEqual(fallback);
    expect(parseMonthParam(undefined, fallback)).toEqual(fallback);
  });
});

describe("dates and times", () => {
  it("uses the Pacific date, not the server's", () => {
    // 2026-10-28 03:00 UTC is still the evening of Oct 27 in California
    expect(todayInPacific(new Date("2026-10-28T03:00:00Z"))).toBe("2026-10-27");
  });

  it("validates date strings", () => {
    expect(isDateString("2026-10-30")).toBe(true);
    expect(isDateString("2026-02-30")).toBe(false);
    expect(isDateString("30/10/2026")).toBe(false);
  });

  it("formats times like the prototype", () => {
    expect(formatTimeRange("17:30:00", "18:30:00")).toBe("5:30 – 6:30 PM");
    expect(formatTimeRange("11:30", "12:30")).toBe("11:30 AM – 12:30 PM");
    expect(formatTimeRange("09:15", "09:55")).toBe("9:15 – 9:55 AM");
    expect(formatDateShort("2026-10-30")).toBe("Fri, Oct 30");
    expect(weekdayPlural(5)).toBe("Fridays");
  });
});
