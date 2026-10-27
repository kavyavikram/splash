import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCATION, LOCATION_COOKIE, isLocationId, type LocationId } from "./locations";

/** The location the visitor picked in the switcher (stored in a cookie). */
export async function getCurrentLocation(): Promise<LocationId> {
  const value = (await cookies()).get(LOCATION_COOKIE)?.value;
  return isLocationId(value) ? value : DEFAULT_LOCATION;
}
