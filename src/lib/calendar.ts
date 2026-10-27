// Calendar logic: which weekly class lands on which day. Pure functions, no database.
// Dates are plain "YYYY-MM-DD" strings so time zones can't shift a class to the wrong day.

export type ClassSlot = {
  id: string;
  location_id: string;
  weekday: number; // 0 = Sunday
  start_time: string; // "HH:MM" or "HH:MM:SS"
  end_time: string;
  starts_on: string; // session start, "YYYY-MM-DD"
  ends_on: string; // session end (inclusive)
};

export type YearMonth = { year: number; month: number }; // month 1-12

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAY_LABELS = WEEKDAYS;

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateString(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function toUtc(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function isDateString(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = toUtc(value);
  return toDateString(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()) === value;
}

export function weekdayOf(date: string): number {
  return toUtc(date).getUTCDay();
}

export function addDays(date: string, days: number): string {
  const d = toUtc(date);
  d.setUTCDate(d.getUTCDate() + days);
  return toDateString(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** Today's date in the Bay Area, whatever time zone the server runs in. */
export function todayInPacific(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(now);
}

/** True when this weekly class meets on `date` (right weekday, inside the session dates). */
export function slotMeetsOn(slot: ClassSlot, date: string): boolean {
  return weekdayOf(date) === slot.weekday && date >= slot.starts_on && date <= slot.ends_on;
}

export function classesOn(slots: ClassSlot[], date: string): ClassSlot[] {
  return slots.filter((s) => slotMeetsOn(s, date)).sort((a, b) => a.start_time.localeCompare(b.start_time));
}

/** The next `limit` class meetings on or after `from`, in date and time order. */
export function upcomingClasses(
  slots: ClassSlot[],
  from: string,
  limit: number,
  maxDays = 366,
): { date: string; slot: ClassSlot }[] {
  const result: { date: string; slot: ClassSlot }[] = [];
  for (let i = 0; i < maxDays && result.length < limit; i++) {
    const date = addDays(from, i);
    for (const slot of classesOn(slots, date)) {
      if (result.length < limit) result.push({ date, slot });
    }
  }
  return result;
}

/**
 * Month grid for a Sunday-first calendar: leading `null`s for the days before the 1st,
 * then one date string per day of the month.
 */
export function monthGrid({ year, month }: YearMonth): (string | null)[] {
  const first = toDateString(year, month, 1);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (string | null)[] = Array(weekdayOf(first)).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(toDateString(year, month, day));
  return cells;
}

export function shiftMonth({ year, month }: YearMonth, delta: number): YearMonth {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function formatMonthParam({ year, month }: YearMonth): string {
  return `${year}-${pad(month)}`;
}

/** Reads "?month=2026-11"; falls back when missing or malformed. */
export function parseMonthParam(param: unknown, fallback: YearMonth): YearMonth {
  if (typeof param !== "string") return fallback;
  const match = /^(\d{4})-(\d{2})$/.exec(param);
  if (!match) return fallback;
  const month = Number(match[2]);
  return month >= 1 && month <= 12 ? { year: Number(match[1]), month } : fallback;
}

export function monthLabel({ year, month }: YearMonth): string {
  return `${MONTHS[month - 1]} ${year}`;
}

/** "Fri, Oct 30" */
export function formatDateShort(date: string): string {
  const d = toUtc(date);
  return `${WEEKDAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}`;
}

/** "Friday, October 30" */
export function formatDateLong(date: string): string {
  const d = toUtc(date);
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(d);
  return `${weekday}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function parseTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return { hour12: h % 12 === 0 ? 12 : h % 12, minutes: pad(m), period: h < 12 ? "AM" : "PM" };
}

/** "5:30 PM" */
export function formatTime(time: string): string {
  const t = parseTime(time);
  return `${t.hour12}:${t.minutes} ${t.period}`;
}

/** "5:30 – 6:30 PM", or "11:30 AM – 12:30 PM" when the period changes. */
export function formatTimeRange(start: string, end: string): string {
  const s = parseTime(start);
  const e = parseTime(end);
  const startText = s.period === e.period ? `${s.hour12}:${s.minutes}` : formatTime(start);
  return `${startText} – ${formatTime(end)}`;
}

/** "Fridays" */
export function weekdayPlural(weekday: number): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(2026, 0, 4 + weekday)), // Jan 4, 2026 is a Sunday
  ) + "s";
}
