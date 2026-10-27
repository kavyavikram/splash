import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateLong, formatTimeRange, isDateString, slotMeetsOn } from "@/lib/calendar";
import {
  POOLS,
  getAllInstructors,
  getClassRoster,
  getClassSlot,
  getClassSummary,
  getLocation,
  instructorNames,
} from "@/lib/data";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Class details · Splash" };

export default async function ClassDetailPage({ params }: { params: Promise<{ slotId: string; date: string }> }) {
  const { profile } = await requireRole();
  const { slotId, date } = await params;
  if (!isDateString(date)) notFound();
  const slot = await getClassSlot(slotId);
  if (!slot || !slotMeetsOn(slot, date)) notFound();

  const isInstructor = profile.role === "instructor";
  const [location, instructors, roster, summary] = await Promise.all([
    getLocation(slot.location_id),
    getAllInstructors(),
    isInstructor ? getClassRoster(slot.id) : Promise.resolve([]),
    getClassSummary(slot.id),
  ]);
  const total = POOLS.reduce((n, p) => n + summary.poolCounts[p], 0);

  return (
    <>
      <Link href={`/calendar?month=${date.slice(0, 7)}`} className="btn-outline self-start">
        <span aria-hidden="true">←&nbsp;</span>Back to calendar
      </Link>

      <div className="card">
        <h1 className="text-[26px] font-bold">
          {formatDateLong(date)} · {formatTimeRange(slot.start_time, slot.end_time)}
        </h1>
        {location && (
          <p className="muted mt-1 mb-3">
            {location.address} · {location.pool_note}
          </p>
        )}
        <p>
          <b>Instructors assigned:</b> {instructorNames(summary.instructorIds, instructors).replaceAll(" & ", ", ") || "To be announced"}
        </p>
        <p className="muted">{total === 1 ? "1 swimmer attending" : `${total} swimmers attending`}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {POOLS.map((pool) => {
          const inPool = roster.filter((s) => s.pool === pool);
          const count = summary.poolCounts[pool];
          return (
            <section key={pool} className="card" aria-labelledby={`${pool}-heading`}>
              <h2 id={`${pool}-heading`} className="mb-2 text-lg font-bold">
                {pool}
              </h2>
              {count === 0 ? (
                <p className="muted">No swimmers assigned to this pool.</p>
              ) : isInstructor ? (
                <ul>
                  {inPool.map((s) => (
                    <li key={s.id} className="border-t border-line-soft">
                      <Link href={`/directory/swimmers/${s.id}`} className="-mx-2 block min-h-11 rounded-lg px-2 py-2 hover:bg-ice">
                        <span className="block font-bold">{s.display_name}</span>
                        <span className="muted">
                          {s.instructor_ids.length > 1 ? "Instructors" : "Instructor"}: {instructorNames(s.instructor_ids, instructors)}
                          {s.condition && ` · ${s.condition}`}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{count === 1 ? "1 swimmer" : `${count} swimmers`}</p>
              )}
            </section>
          );
        })}
      </div>
      <p className="muted">
        Sample pairings. Pool assignment is based on swimmer level, and each swimmer works with 1–2 instructors.
      </p>
    </>
  );
}
