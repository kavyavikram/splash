import { notFound } from "next/navigation";
import { ProfileDetail } from "@/components/ProfileDetail";
import { getInstructor, getLocation } from "@/lib/data";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Instructor · Splash" };

export default async function InstructorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole();
  const instructor = await getInstructor((await params).id);
  if (!instructor) notFound();
  const location = await getLocation(instructor.location_id);

  return (
    <ProfileDetail
      title={instructor.name}
      subtitle={`${location?.name} · ${instructor.years_experience} years of experience`}
      rows={[
        { label: "Experience", value: `${instructor.years_experience} years with adaptive aquatics` },
        { label: "Teaching interests", value: instructor.teaching_interests.join(", ") },
        { label: "Availability", value: instructor.availability },
        { label: "Location", value: location?.short_name ?? "" },
      ]}
      note="Sample profile. No real personal information."
    />
  );
}
