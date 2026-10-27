// The three SNAPkids pools. Ids match the `locations` table in Supabase.
export const LOCATIONS = [
  { id: "berkeley", name: "Berkeley" },
  { id: "palo-alto", name: "Palo Alto" },
  { id: "albany", name: "Albany" },
] as const;

export type LocationId = (typeof LOCATIONS)[number]["id"];

export const DEFAULT_LOCATION: LocationId = "berkeley";
export const LOCATION_COOKIE = "splash_location";

export function isLocationId(value: unknown): value is LocationId {
  return LOCATIONS.some((l) => l.id === value);
}
