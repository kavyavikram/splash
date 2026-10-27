import Link from "next/link";
import { SearchableCards, type CardItem } from "@/components/SearchableCards";
import { getCurrentLocation } from "@/lib/current-location";
import { getAllInstructors, getLocation, getSwimmersWithProfiles, instructorNames } from "@/lib/data";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Directory · Splash" };

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { profile } = await requireRole();
  const isInstructor = profile.role === "instructor";
  // Families only ever get the instructor tab.
  const tab = isInstructor && (await searchParams).tab === "swimmers" ? "swimmers" : "instructors";

  const locationId = await getCurrentLocation();
  const [location, instructors] = await Promise.all([getLocation(locationId), getAllInstructors()]);

  let items: CardItem[];
  if (tab === "instructors") {
    items = instructors
      .filter((i) => i.location_id === locationId)
      .map((i) => ({
        id: i.id,
        href: `/directory/instructors/${i.id}`,
        title: i.name,
        subtitle: `${location?.name} · ${i.years_experience} years of experience`,
        chips: i.teaching_interests,
        searchText: [i.availability],
      }));
  } else {
    const swimmers = await getSwimmersWithProfiles(locationId);
    items = swimmers.map((s) => ({
      id: s.id,
      href: `/directory/swimmers/${s.id}`,
      title: s.display_name,
      subtitle: s.profile
        ? `${location?.name} · ${s.profile.years_with_snapkids} ${s.profile.years_with_snapkids === 1 ? "year" : "years"} with SNAPkids`
        : (location?.name ?? ""),
      chips: [s.profile?.condition, s.pool].filter((c): c is string => Boolean(c)),
      searchText: [
        instructorNames(s.instructor_ids, instructors),
        s.profile?.session_focus ?? "",
        s.profile?.considerations ?? "",
        s.profile?.nonverbal ?? "",
      ],
    }));
  }

  return (
    <>
      <div>
        <h1 className="text-[28px] font-bold">
          {tab === "instructors" ? "Instructor directory" : "Swimmer directory"} · {location?.name}
        </h1>
        <p className="muted mt-1">Fictional sample profiles for demo purposes only.</p>
      </div>

      {isInstructor && (
        <nav aria-label="Directory" className="flex flex-wrap gap-2">
          <Link href="/directory" aria-current={tab === "instructors" ? "page" : undefined} className={`pill ${tab === "instructors" ? "pill-on" : ""}`}>
            Instructors
          </Link>
          <Link href="/directory?tab=swimmers" aria-current={tab === "swimmers" ? "page" : undefined} className={`pill ${tab === "swimmers" ? "pill-on" : ""}`}>
            Swimmers
          </Link>
        </nav>
      )}

      {/* key resets the search box when switching tabs or locations */}
      <SearchableCards
        key={`${tab}-${locationId}`}
        items={items}
        label={tab === "instructors" ? "Search instructors" : "Search swimmers"}
        placeholder={tab === "instructors" ? "Search by name, interest, or availability" : "Search by name, goal, or need"}
      />
    </>
  );
}
