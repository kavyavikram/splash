import { describe, expect, it } from "vitest";
import { accessCodeMatches } from "./access";

describe("accessCodeMatches", () => {
  it("accepts the right code, ignoring case and spaces", () => {
    expect(accessCodeMatches("pool-coach-2026", "pool-coach-2026")).toBe(true);
    expect(accessCodeMatches("  Pool-Coach-2026 ", "pool-coach-2026")).toBe(true);
  });

  it("rejects wrong or empty codes", () => {
    expect(accessCodeMatches("pool-coach", "pool-coach-2026")).toBe(false);
    expect(accessCodeMatches("", "pool-coach-2026")).toBe(false);
    expect(accessCodeMatches(null, "pool-coach-2026")).toBe(false);
  });

  it("fails closed when no code is configured", () => {
    expect(accessCodeMatches("", undefined)).toBe(false);
    expect(accessCodeMatches("anything", "")).toBe(false);
    expect(accessCodeMatches("  ", "  ")).toBe(false);
  });
});
