import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Checks the instructor access code. Ignores surrounding spaces and letter case so a
 * code read aloud or typed on a phone still works. Fails closed when no code is configured.
 */
export function accessCodeMatches(input: unknown, expected: string | undefined): boolean {
  if (typeof input !== "string" || !expected?.trim()) return false;
  // Hash both sides so the comparison takes the same time whatever the input length.
  const digest = (s: string) => createHash("sha256").update(s.trim().toLowerCase()).digest();
  return timingSafeEqual(digest(input), digest(expected));
}
