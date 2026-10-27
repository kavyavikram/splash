import Link from "next/link";
import {
  WEEKDAY_LABELS,
  classesOn,
  formatDateShort,
  formatMonthParam,
  formatTime,
  formatTimeRange,
  monthGrid,
  monthLabel,
  parseMonthParam,
  shiftMonth,
  todayInPacific,
} from "@/lib/calendar";
import { getCurrentLocation } from "@/lib/current-location";
import { getClassSlots, getLocation } from "@/lib/data";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Calendar · Splash" };

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  await requireRole();
  const locationId = await getCurrentLocation();
  const [location, slots] = await Promise.all([getLocation(locationId), getClassSlots(locationId)]);

  const today = todayInPacific();
  const [year, month] = today.split("-").map(Number);
  const shown = parseMonthParam((await searchParams).month, { year, month });
  const days = monthGrid(shown);
  const classDays = days.filter((d): d is string => d !== null && classesOn(slots, d).length > 0);
  const monthHref = (delta: number) => `/calendar?month=${formatMonthParam(shiftMonth(shown, delta))}`;
  const classHref = (slotId: string, date: string) => `/calendar/${slotId}/${date}`;

  return (
    <>
      <div>
        <h1 className="text-[28px] font-bold">Calendar</h1>
        <p className="muted mt-1">
          Sample class schedule for {location?.name}. Choose a class to see who is teaching and attending.
        </p>
      </div>

      <nav aria-label="Month" className="flex flex-wrap items-center gap-3">
        <Link href={monthHref(-1)} className="btn-outline">
          <span aria-hidden="true">←&nbsp;</span>Previous<span className="sr-only"> month</span>
        </Link>
        <h2 className="min-w-[160px] text-center text-xl font-bold" aria-live="polite">
          {monthLabel(shown)}
        </h2>
        <Link href={monthHref(1)} className="btn-outline">
          Next<span className="sr-only"> month</span>
          <span aria-hidden="true">&nbsp;→</span>
        </Link>
      </nav>

      {/* Month grid: tablets and up */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
          {WEEKDAY_LABELS.map((d) => (
            <b key={d} className="muted px-1.5 py-1">
              {d}
            </b>
          ))}
        </div>
        <ol className="mt-1.5 grid grid-cols-7 gap-1.5">
          {days.map((date, i) =>
            date === null ? (
              <li key={`blank-${i}`} aria-hidden="true" />
            ) : (
              <li
                key={date}
                className={`min-h-[84px] rounded-[10px] border p-1.5 ${date === today ? "border-primary bg-sky" : "border-line"}`}
              >
                <span className="muted">
                  <span className="sr-only">{formatDateShort(date)}</span>
                  <span aria-hidden="true">{Number(date.slice(8))}</span>
                </span>
                {classesOn(slots, date).map((slot) => (
                  <Link
                    key={slot.id}
                    href={classHref(slot.id, date)}
                    className="mt-1 flex min-h-9 items-center justify-center rounded-lg bg-primary px-0.5 py-1.5 text-xs text-white hover:bg-primary-dark"
                    aria-label={`${formatDateShort(date)}, ${formatTimeRange(slot.start_time, slot.end_time)} class`}
                  >
                    {formatTime(slot.start_time)}
                  </Link>
                ))}
              </li>
            ),
          )}
        </ol>
      </div>

      {/* Agenda list: phones */}
      <div className="md:hidden">
        {classDays.length === 0 ? (
          <EmptyMonth />
        ) : (
          <ol className="space-y-3">
            {classDays.map((date) => (
              <li key={date} className={`card p-4 ${date === today ? "border-primary" : ""}`}>
                <h3 className="mb-2 font-bold">
                  {formatDateShort(date)}
                  {date === today && <span className="chip ml-2">Today</span>}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {classesOn(slots, date).map((slot) => (
                    <Link key={slot.id} href={classHref(slot.id, date)} className="btn px-4 text-sm">
                      {formatTimeRange(slot.start_time, slot.end_time)}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
      {classDays.length === 0 && (
        <div className="hidden md:block">
          <EmptyMonth />
        </div>
      )}
    </>
  );
}

function EmptyMonth() {
  return (
    <div className="card text-center">
      <p className="font-bold">No classes this month.</p>
      <p className="muted">The current session runs October 1 – December 20, 2026.</p>
    </div>
  );
}
