// ALL Splash sample data lives here. Every name is fictional (from reference/prototype.html).
// To change the class schedule: edit SESSION and CLASS_SLOTS below, then run `npm run seed`.

export type Pool = "Instructional pool" | "Lap pool";

export type SeedLocation = {
  id: string; // matches src/lib/locations.ts
  name: string;
  short_name: string;
  address: string;
  pool_note: string;
};

export type SeedInstructor = {
  id: string;
  name: string;
  location_id: string;
  years_experience: number;
  teaching_interests: string[];
  availability: string;
};

export type SeedClassSlot = {
  id: string;
  location_id: string;
  weekday: number; // 0 = Sunday … 6 = Saturday
  start_time: string; // 24h "HH:MM"
  end_time: string; // 24h "HH:MM"
};

export type SeedSwimmer = {
  id: string;
  display_name: string;
  location_id: string;
  class_slot_id: string;
  pool: Pool;
  instructor_ids: string[];
  // Private profile: readable by instructors only (RLS)
  condition: string;
  nonverbal: string;
  considerations: string;
  years_with_snapkids: number;
  session_focus: string;
  past_instructors: string;
};

/** Classes repeat weekly on their weekday between these dates (inclusive). */
export const SESSION = { starts_on: "2026-10-01", ends_on: "2026-12-20" };

export const LOCATIONS: SeedLocation[] = [
  {
    id: "berkeley",
    name: "Berkeley",
    short_name: "Downtown Berkeley YMCA",
    address: "Downtown Berkeley YMCA, 2001 Allston Way",
    pool_note: "Warm water pool with chair lift",
  },
  {
    id: "palo-alto",
    name: "Palo Alto",
    short_name: "Palo Alto Family YMCA",
    address: "Palo Alto Family YMCA, 3412 Ross Road",
    pool_note: "Warmer instructional pool and cooler lap pool",
  },
  {
    id: "albany",
    name: "Albany",
    short_name: "Albany Aquatic Center",
    address: "Albany Aquatic Center, 1311 Portland Ave",
    pool_note: "Warm water pool with chair lift",
  },
];

export const INSTRUCTORS: SeedInstructor[] = [
  { id: "i1", name: "Maya Chen", location_id: "berkeley", years_experience: 6, teaching_interests: ["Autism support", "Water confidence"], availability: "Fridays and Sundays" },
  { id: "i2", name: "Daniel Okafor", location_id: "berkeley", years_experience: 10, teaching_interests: ["Mobility support", "Floatation devices"], availability: "Fridays and Sundays" },
  { id: "i3", name: "Priya Raman", location_id: "palo-alto", years_experience: 3, teaching_interests: ["Sensory needs", "Games and songs"], availability: "Saturdays" },
  { id: "i4", name: "Sam Torres", location_id: "palo-alto", years_experience: 8, teaching_interests: ["Stroke basics", "Water safety"], availability: "Saturdays" },
  { id: "i5", name: "Lena Ortiz", location_id: "albany", years_experience: 5, teaching_interests: ["Early swimmers", "Communication cards"], availability: "Sundays" },
  { id: "i6", name: "Marcus Bell", location_id: "albany", years_experience: 7, teaching_interests: ["Teen swimmers", "Independence"], availability: "Sundays" },
];

export const CLASS_SLOTS: SeedClassSlot[] = [
  { id: "berkeley-1", location_id: "berkeley", weekday: 5, start_time: "17:30", end_time: "18:30" },
  { id: "berkeley-2", location_id: "berkeley", weekday: 0, start_time: "11:30", end_time: "12:30" },
  { id: "berkeley-3", location_id: "berkeley", weekday: 0, start_time: "12:30", end_time: "13:30" },
  { id: "palo-alto-1", location_id: "palo-alto", weekday: 6, start_time: "12:45", end_time: "13:25" },
  { id: "palo-alto-2", location_id: "palo-alto", weekday: 6, start_time: "13:30", end_time: "14:10" },
  { id: "palo-alto-3", location_id: "palo-alto", weekday: 6, start_time: "14:15", end_time: "14:55" },
  { id: "palo-alto-4", location_id: "palo-alto", weekday: 6, start_time: "15:00", end_time: "15:40" },
  { id: "albany-1", location_id: "albany", weekday: 0, start_time: "09:15", end_time: "09:55" },
  { id: "albany-2", location_id: "albany", weekday: 0, start_time: "10:00", end_time: "10:40" },
];

export const SWIMMERS: SeedSwimmer[] = [
  {
    id: "s1",
    display_name: "Jordan R.",
    location_id: "berkeley",
    class_slot_id: "berkeley-1",
    pool: "Instructional pool",
    instructor_ids: ["i1"],
    condition: "Autism",
    nonverbal: "Yes, uses picture cards",
    considerations: "Show picture cards before entering the water; quiet lane preferred.",
    years_with_snapkids: 3,
    session_focus: "Independent back float",
    past_instructors: "Daniel Okafor, Sam Torres",
  },
  {
    id: "s2",
    display_name: "Ava M.",
    location_id: "berkeley",
    class_slot_id: "berkeley-1",
    pool: "Instructional pool",
    instructor_ids: ["i1", "i2"],
    condition: "Cerebral palsy",
    nonverbal: "No",
    considerations: "Needs seated transfer with the chair lift; tires after 30 minutes.",
    years_with_snapkids: 5,
    session_focus: "Steady kicking with a board",
    past_instructors: "Priya Raman",
  },
  {
    id: "s3",
    display_name: "Leo P.",
    location_id: "berkeley",
    class_slot_id: "berkeley-2",
    pool: "Lap pool",
    instructor_ids: ["i2"],
    condition: "Developmental delay",
    nonverbal: "No, uses short phrases",
    considerations: "Give a two-minute warning before activity changes.",
    years_with_snapkids: 2,
    session_focus: "Freestyle arm pattern",
    past_instructors: "Maya Chen",
  },
  {
    id: "s4",
    display_name: "Nia W.",
    location_id: "palo-alto",
    class_slot_id: "palo-alto-1",
    pool: "Lap pool",
    instructor_ids: ["i4"],
    condition: "Down syndrome",
    nonverbal: "No",
    considerations: "Clear, short verbal cues work best; loves high-fives.",
    years_with_snapkids: 4,
    session_focus: "Breathing with side kicks",
    past_instructors: "Priya Raman, Lena Ortiz",
  },
  {
    id: "s5",
    display_name: "Eli K.",
    location_id: "palo-alto",
    class_slot_id: "palo-alto-2",
    pool: "Instructional pool",
    instructor_ids: ["i3"],
    condition: "Autism",
    nonverbal: "Yes, uses a communication device",
    considerations: "Keep sounds low and use the same entry routine each week.",
    years_with_snapkids: 1,
    session_focus: "Comfort with face in water",
    past_instructors: "None yet",
  },
  {
    id: "s6",
    display_name: "Zoe T.",
    location_id: "palo-alto",
    class_slot_id: "palo-alto-3",
    pool: "Instructional pool",
    instructor_ids: ["i3", "i4"],
    condition: "Muscular dystrophy",
    nonverbal: "No",
    considerations: "Conserve energy: rest breaks every 10 minutes, no overexertion.",
    years_with_snapkids: 6,
    session_focus: "Gentle floating and range of motion",
    past_instructors: "Daniel Okafor, Marcus Bell",
  },
  {
    id: "s10",
    display_name: "Ruby H.",
    location_id: "berkeley",
    class_slot_id: "berkeley-3",
    pool: "Instructional pool",
    instructor_ids: ["i2"],
    condition: "Spina bifida",
    nonverbal: "No",
    considerations: "Uses a seated transfer; check skin comfort after each lesson.",
    years_with_snapkids: 4,
    session_focus: "Supported kicking on back",
    past_instructors: "Maya Chen",
  },
  {
    id: "s11",
    display_name: "Theo N.",
    location_id: "palo-alto",
    class_slot_id: "palo-alto-4",
    pool: "Lap pool",
    instructor_ids: ["i4"],
    condition: "Developmental delay",
    nonverbal: "No",
    considerations: "Likes a predictable routine; offer choices of two.",
    years_with_snapkids: 3,
    session_focus: "Side breathing practice",
    past_instructors: "Priya Raman",
  },
  {
    id: "s7",
    display_name: "Mateo S.",
    location_id: "albany",
    class_slot_id: "albany-1",
    pool: "Instructional pool",
    instructor_ids: ["i5"],
    condition: "Cerebral palsy",
    nonverbal: "No",
    considerations: "Support head and trunk during floats; prefers warm water time.",
    years_with_snapkids: 2,
    session_focus: "Back float with support",
    past_instructors: "Maya Chen",
  },
  {
    id: "s8",
    display_name: "Hannah L.",
    location_id: "albany",
    class_slot_id: "albany-2",
    pool: "Lap pool",
    instructor_ids: ["i6"],
    condition: "Developmental delay",
    nonverbal: "No",
    considerations: "Uses visual timers; praise effort over results.",
    years_with_snapkids: 7,
    session_focus: "Backstroke arms",
    past_instructors: "Sam Torres, Lena Ortiz",
  },
  {
    id: "s9",
    display_name: "Omar D.",
    location_id: "albany",
    class_slot_id: "albany-2",
    pool: "Lap pool",
    instructor_ids: ["i6", "i5"],
    condition: "Autism",
    nonverbal: "Yes, uses signs and gestures",
    considerations: "Avoid sudden splashes; offer calm choices.",
    years_with_snapkids: 3,
    session_focus: "Rhythmic kicking across the pool",
    past_instructors: "Priya Raman",
  },
];
