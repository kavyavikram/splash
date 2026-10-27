import { describe, expect, it } from "vitest";
import { RESOURCES } from "@/content/resources";
import { filterResources, matchesQuery, searchItems } from "./search";

describe("matchesQuery", () => {
  it("matches any field, ignoring case, accents and extra spaces", () => {
    expect(matchesQuery(["Maya Chen", "Autism support"], "  AUTISM ")).toBe(true);
    expect(matchesQuery(["Zoë T."], "zoe")).toBe(true);
  });

  it("requires every word, in any order", () => {
    expect(matchesQuery(["Maya Chen", "Water confidence"], "water maya")).toBe(true);
    expect(matchesQuery(["Maya Chen", "Water confidence"], "water daniel")).toBe(false);
  });

  it("matches everything for an empty query", () => {
    expect(matchesQuery(["anything"], "")).toBe(true);
  });

  it("handles numbers and missing fields", () => {
    expect(matchesQuery(["Sam Torres", 8, null, undefined], "8")).toBe(true);
  });
});

describe("directory search", () => {
  const instructors = [
    { name: "Maya Chen", interests: ["Autism support", "Water confidence"] },
    { name: "Daniel Okafor", interests: ["Mobility support", "Floatation devices"] },
  ];
  const fields = (i: (typeof instructors)[number]) => [i.name, ...i.interests];

  it("finds instructors by name or teaching interest", () => {
    expect(searchItems(instructors, "okafor", fields).map((i) => i.name)).toEqual(["Daniel Okafor"]);
    expect(searchItems(instructors, "support", fields)).toHaveLength(2);
    expect(searchItems(instructors, "mobility", fields).map((i) => i.name)).toEqual(["Daniel Okafor"]);
    expect(searchItems(instructors, "backstroke", fields)).toEqual([]);
  });
});

describe("resource search", () => {
  it("shows all 11 resources by default", () => {
    expect(filterResources(RESOURCES, "", "All")).toHaveLength(11);
  });

  it("filters by category", () => {
    const safety = filterResources(RESOURCES, "", "Water Safety");
    expect(safety.map((r) => r.id)).toEqual(["r7", "r8"]);
  });

  it("searches titles, summaries, body text and tips", () => {
    expect(filterResources(RESOURCES, "bubbles", "All").map((r) => r.id)).toContain("r3");
    expect(filterResources(RESOURCES, "water watcher", "All").map((r) => r.id)).toEqual(["r8"]); // in a tip
  });

  it("combines search with the category filter", () => {
    expect(filterResources(RESOURCES, "song", "Swimming Games & Activities").map((r) => r.id)).toEqual(["r9", "r10", "r11"]);
    expect(filterResources(RESOURCES, "song", "Water Safety")).toEqual([]);
  });
});
