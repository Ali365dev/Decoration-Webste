import { describe, expect, it } from "vitest";
import type { NavItemDto } from "@dec-walls/types";
import { contentVersion, navTreeToRows, rowsToNavTree, type NavRow } from "../../packages/domain/src/cms/rows";
import { defaultMenus } from "../../packages/domain/src/cms/defaults";

const seqId = () => {
  let n = 0;
  return () => `id-${++n}`;
};

const strip = (items: NavItemDto[]): unknown[] =>
  items.map(({ label, href, children }) => ({ label, href, children: strip(children) }));

describe("navigation rows", () => {
  it("round-trips the default main menu", () => {
    const rows = navTreeToRows("menu-1", defaultMenus.main.items, seqId());
    expect(rows.every((r) => r.menuId === "menu-1")).toBe(true);
    expect(strip(rowsToNavTree(rows))).toEqual(strip(defaultMenus.main.items));
  });

  it("numbers siblings 0, 10, 20…", () => {
    const rows = navTreeToRows("m", defaultMenus["footer-information"].items, seqId());
    expect(rows.map((r) => r.sortOrder)).toEqual([0, 10, 20, 30, 40]);
    expect(rows.every((r) => r.parentId === null)).toBe(true);
  });

  it("orders by sortOrder whatever the row order", () => {
    const rows: NavRow[] = [
      { id: "b", parentId: null, label: "B", href: "/b", sortOrder: 20 },
      { id: "a2", parentId: "a", label: "A2", href: "/a2", sortOrder: 10 },
      { id: "a", parentId: null, label: "A", href: "/a", sortOrder: 10 },
      { id: "a1", parentId: "a", label: "A1", href: "/a1", sortOrder: 0 },
    ];
    expect(strip(rowsToNavTree(rows))).toEqual([
      { label: "A", href: "/a", children: [{ label: "A1", href: "/a1", children: [] }, { label: "A2", href: "/a2", children: [] }] },
      { label: "B", href: "/b", children: [] },
    ]);
  });

  it("drops rows whose parent is missing", () => {
    const rows: NavRow[] = [
      { id: "a", parentId: null, label: "A", href: "/a", sortOrder: 0 },
      { id: "x", parentId: "gone", label: "X", href: "/x", sortOrder: 0 },
    ];
    expect(strip(rowsToNavTree(rows))).toEqual([{ label: "A", href: "/a", children: [] }]);
  });
});

describe("contentVersion", () => {
  it("ignores key order", () => {
    expect(contentVersion({ a: 1, b: { c: 2, d: [1, 2] } })).toBe(contentVersion({ b: { d: [1, 2], c: 2 }, a: 1 }));
  });

  it("changes when a nested value changes", () => {
    expect(contentVersion({ a: { b: [1, 2] } })).not.toBe(contentVersion({ a: { b: [1, 3] } }));
  });

  it("is a sha256 hex string", () => {
    expect(contentVersion([])).toMatch(/^[0-9a-f]{64}$/);
  });
});
