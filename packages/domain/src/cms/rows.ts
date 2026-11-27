import { createHash } from "node:crypto";
import type { NavItemDto } from "@dec-walls/types";

export type NavRow = { id: string; parentId: string | null; label: string; href: string; sortOrder: number };

/** Builds the nested menu from flat `navigation_items` rows. Rows whose parent is missing are dropped. */
export function rowsToNavTree(rows: NavRow[]): NavItemDto[] {
  const byParent = new Map<string | null, NavRow[]>();
  for (const row of rows) {
    const list = byParent.get(row.parentId) ?? [];
    list.push(row);
    byParent.set(row.parentId, list);
  }
  const build = (parentId: string | null): NavItemDto[] =>
    [...(byParent.get(parentId) ?? [])]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((row) => ({ id: row.id, label: row.label, href: row.href, children: build(row.id) }));
  return build(null);
}

/** Flattens a menu into `navigation_items` rows; siblings are numbered 0, 10, 20… */
export function navTreeToRows(
  menuId: string,
  items: NavItemDto[],
  newId: () => string,
): (NavRow & { menuId: string })[] {
  const rows: (NavRow & { menuId: string })[] = [];
  const walk = (list: NavItemDto[], parentId: string | null) => {
    list.forEach((item, index) => {
      const id = newId();
      rows.push({ id, menuId, parentId, label: item.label, href: item.href, sortOrder: index * 10 });
      walk(item.children ?? [], id);
    });
  };
  walk(items, null);
  return rows;
}

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((key) => [key, stable((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
}

/** A fingerprint of saved content, used to refuse a save made from an out-of-date copy. */
export function contentVersion(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}
