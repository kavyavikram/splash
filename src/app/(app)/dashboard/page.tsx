import Link from "next/link";
import { SwitchLocationButton } from "@/components/SwitchLocationButton";
import { formatDateLong, formatDateShort, formatTimeRange, todayInPacific, upcomingClasses, weekdayPlural } from "@/lib/calendar";
import { getCurrentLocation } from "@/lib/current-location";
import {
  firstName,
  getAllInstructors,
  getClassSlot,
  getClassSlots,
  getLocation,
  getSwimmer,
  getSwimmers,
  type Location,
} from "@/lib/data";
import { requireRole, type Profile } from "@/lib/session";

export const metadata = { title: "Dashboard · Splash" };

export default async function DashboardPage() {
  const { profile } = await requireRole();
  const locationId = await getCurrentLocation();
  const location = await getLocation(locationId);
  if (!location) return <p>Location not found.</p>;

  return profile.role === "instructor" ? (
    <InstructorDashboard profile={profile} location={location} />
  ) : (
    <FamilyDashboard profile={profile} location={location} />
  );
}

async function InstructorDashboard({ profile, location }: { profile: Profile; location: Location }) {
  const [slots, swimmers] = await Promise.all([getClassSlots(location.id), getSwimmers(location.id)]);
  const upcoming = upcomingClasses(slots, todayInPacific(), 3);
  const countIn = (slotId: string) => swimmers.filter((s) => s.class_slot_id === slotId).length;
  const name = firstName(profile.display_name);

  return (
    <>
      <div className="hero flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold">{name ? `Welcome back, Coach ${name}` : "Welcome back, Coach"}</h1>
          <p className="mt-1.5">
            {upcoming.length > 0 ? `Upcoming classes at ${location.name}` : `No upcoming classes at ${location.name}`}
          </p>
        </div>
        <Link href="/directory?tab=swimmers" className="btn-white px-6 py-3.5 text-base">
          Browse swimmer directory
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card" aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading" className="mb-3 text-lg font-bold">
            Upcoming classes
          </h2>
          {upcoming.length === 0 && <p className="muted">No classes scheduled in the current session.</p>}
          <ul>
            {upcoming.map(({ date, slot }) => (
              <li key={`${date}-${slot.id}`} className="border-t border-line-soft">
                <Link href={`/calendar/${slot.id}/${date}`} className="-mx-2 block min-h-11 rounded-lg px-2 py-2.5 hover:bg-ice">
                  <span className="block font-bold">
                    {formatDateShort(date)} · {formatTimeRange(slot.start_time, slot.end_time)}
                  </span>
                  <span className="muted">
                    {countIn(slot.id) === 1 ? "1 swimmer" : `${countIn(slot.id)} swimmers`} · {location.short_name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/calendar" className="btn-outline mt-3">
            View calendar
          </Link>
        </section>

        <section className="card" aria-labelledby="swimmers-heading">
          <h2 id="swimmers-heading" className="mb-3 text-lg font-bold">
            Swimmers at this location
          </h2>
          {swimmers.length === 0 && <p className="muted">No swimmers at this location yet.</p>}
          <ul>
            {swimmers.map((s) => {
              const slot = slots.find((x) => x.id === s.class_slot_id);
              return (
                <li key={s.id} className="border-t border-line-soft">
                  <Link href={`/directory/swimmers/${s.id}`} className="-mx-2 block min-h-11 rounded-lg px-2 py-2.5 hover:bg-ice">
                    <span className="block font-bold">{s.display_name}</span>
                    <span className="muted">
                      {s.pool}
                      {slot && ` · ${weekdayPlural(slot.weekday)}, ${formatTimeRange(slot.start_time, slot.end_time)}`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <ResourcesCard text="Techniques, games, equipment ideas, and water safety notes." title="Adaptive swimming resources" />
      </div>
    </>
  );
}

async function FamilyDashboard({ profile, location }: { profile: Profile; location: Location }) {
  const swimmer = profile.swimmer_id ? await getSwimmer(profile.swimmer_id) : null;
  if (!swimmer) {
    return (
      <div className="card">
        <p className="font-bold">We couldn&apos;t find your swimmer.</p>
        <Link href="/onboarding" className="btn mt-3">
          Choose your swimmer
        </Link>
      </div>
    );
  }

  const [slot, instructors, home] = await Promise.all([
    getClassSlot(swimmer.class_slot_id),
    getAllInstructors(),
    getLocation(swimmer.location_id),
  ]);
  const next = slot ? upcomingClasses([slot], todayInPacific(), 1)[0] : undefined;
  const myInstructors = instructors.filter((i) => swimmer.instructor_ids.includes(i.id));
  const elsewhere = swimmer.location_id !== location.id;

  return (
    <>
      {elsewhere && home && (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-teal bg-mint">
          <p>
            <b>{firstName(swimmer.display_name)}</b> swims at <b>{home.name}</b>. You&apos;re viewing {location.name}.
          </p>
          <SwitchLocationButton locationId={home.id} label={`Switch to ${home.name}`} />
        </div>
      )}

      <div className="hero">
        <h1 className="text-[28px] font-bold">Hi, {firstName(swimmer.display_name)} and family</h1>
        <p className="mt-1.5">Here is what is coming up in the pool.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card" aria-labelledby="next-heading">
          <h2 id="next-heading" className="mb-3 text-lg font-bold">
            Next lesson
          </h2>
          {next && slot && home ? (
            <>
              <p className="text-[22px] font-bold">{formatDateLong(next.date)}</p>
              <p>
                {formatTimeRange(slot.start_time, slot.end_time)} · {swimmer.pool} · {home.short_name}
              </p>
              <p className="muted mt-1.5 mb-4">Bring: towel, goggles, swim shoes (sample note).</p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/calendar/${slot.id}/${next.date}`} className="btn">
                  Class details
                </Link>
                <Link href="/calendar" className="btn-outline">
                  View calendar
                </Link>
              </div>
            </>
          ) : (
            <p className="muted">No more lessons this session.</p>
          )}
        </section>

        <section className="card" aria-labelledby="instructor-heading">
          <h2 id="instructor-heading" className="mb-3 text-lg font-bold">
            {myInstructors.length > 1 ? "Your instructors" : "Your instructor"}
          </h2>
          <ul className="space-y-3">
            {myInstructors.map((i) => (
              <li key={i.id}>
                <p className="text-lg font-bold">{i.name}</p>
                <p className="muted mt-0.5 mb-2">
                  {i.years_experience} years of experience · {swimmer.pool}
                </p>
                <Link href={`/directory/instructors/${i.id}`} className="btn-outline" aria-label={`View ${i.name}'s profile`}>
                  View profile
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ResourcesCard text="Water safety tips and fun practice ideas for home." title="Resource hub" />
      </div>
    </>
  );
}

function ResourcesCard({ title, text }: { title: string; text: string }) {
  return (
    <section className="card bg-mint">
      <h2 className="mb-1 text-lg font-bold">{title}</h2>
      <p className="muted mb-3.5">{text}</p>
      <Link href="/resources" className="btn">
        Open resource hub
      </Link>
    </section>
  );
}
