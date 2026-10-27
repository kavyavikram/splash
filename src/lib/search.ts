// Search used by the directory and resource hub. Pure functions, shared by server and client.

/** Lowercase, strip accents, collapse spaces, so "  Zoë " matches "zoe". */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/** True when every word of the query appears somewhere in the fields (any order). */
export function matchesQuery(fields: (string | number | null | undefined)[], query: string): boolean {
  const words = normalize(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalize(fields.filter((f) => f !== null && f !== undefined).join(" "));
  return words.every((word) => haystack.includes(word));
}

export function searchItems<T>(items: T[], query: string, fields: (item: T) => (string | number | null | undefined)[]): T[] {
  return items.filter((item) => matchesQuery(fields(item), query));
}

export type SearchableResource = { title: string; summary: string; body: string; category: string; tips: string[] };

/** Resource hub: category pill ("All" or a category) plus text search. */
export function filterResources<T extends SearchableResource>(resources: T[], query: string, category: string): T[] {
  return searchItems(
    resources.filter((r) => category === "All" || r.category === category),
    query,
    (r) => [r.title, r.summary, r.body, r.category, ...r.tips],
  );
}
