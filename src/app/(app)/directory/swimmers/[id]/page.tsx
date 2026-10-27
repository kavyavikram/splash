import { notFound } from "next/navigation";
import { ProfileDetail } from "@/components/ProfileDetail";
import { formatTimeRange, weekdayPlural } from "@/lib/calendar";
import { getAllInstructors, getClassSlot, getLocation, getSwimmer, getSwimmerProfile, instructorNames } from "@/lib/data";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Swimmer · Splash" };

export default async function SwimmerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { profile: me } = await requireRole();
  // Instructors only. RLS also returns no profile to anyone else, so this is belt and braces.
  if (me.role !== "instructor") notFound();

  const id = (await params).id;
  const [swimmer, profile] = await Promise.all([getSwimmer(id), getSwimmerProfile(id)]);
  if (!swimmer || !profile) notFound();
  const [location, slot, instructors] = await Promise.all([
    getLocation(swimmer.location_id),
    getClassSlot(swimmer.class_slot_id),
    getAllInstructors(),
  ]);
  const years = `${profile.years_with_snapkids} ${profile.years_with_snapkids === 1 ? "year" : "years"}`;

  return (
    <ProfileDetail
      title={swimmer.display_name}
      subtitle={`${location?.name} · ${years} with SNAPkids`}
      rows={[
        { label: "Condition", value: profile.condition },
        { label: "Nonverbal", value: profile.nonverbal },
        { label: "Specific considerations", value: profile.considerations },
        { label: "Years with SNAPkids", value: String(profile.years_with_snapkids) },
        { label: "Focus for this session", value: profile.session_focus },
        { label: "Past instructors", value: profile.past_instructors },
        { label: "Pool assignment", value: `${swimmer.pool} (based on swimmer level)` },
        { label: "Current instructors", value: instructorNames(swimmer.instructor_ids, instructors) },
        {
          label: "Class",
          value: slot ? `${weekdayPlural(slot.weekday)}, ${formatTimeRange(slot.start_time, slot.end_time)}` : "Not scheduled",
        },
      ]}
      note="Sample profile. No real personal or medical information."
    />
  );
}
