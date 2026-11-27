import { z } from "zod/v4";
import { contactSchema, menuSchema, parseSection, SECTION_TYPES, type MenuKey, type NavItemInput, type SiteContactInput } from "@dec-walls/validation/cms";

export const CONFLICT_MESSAGE = "Someone else saved changes. Reload to see them.";

const httpError = (status: 400 | 409, message: string) => Object.assign(new Error(message), { status });

const first = (error: z.ZodError) => {
  const issue = error.issues[0];
  return `${issue?.path.join(".") || "input"}: ${issue?.message ?? "invalid"}`;
};

/** Refuses a save made from an out-of-date copy of the content. */
export function assertVersion(stored: string, given: string): void {
  if (stored !== given) throw httpError(409, CONFLICT_MESSAGE);
}

const homeBody = z.object({
  version: z.string().min(1),
  seoTitle: z.string().trim().max(70).nullable().optional(),
  seoDescription: z.string().trim().max(160).nullable().optional(),
  sections: z.array(
    z.object({ id: z.string().min(1), type: z.string().optional(), hidden: z.boolean(), data: z.record(z.string(), z.unknown()) }),
  ),
});

/** The one section type the owner can add or remove; every other section is fixed. */
export const REPEATABLE_TYPE = "category_showcase";
export const MAX_SHOWCASES = 8;
const NEW_ID = /^new-[\w-]{1,40}$/;

export type HomeUpdate = {
  version: string;
  seoTitle: string | null;
  seoDescription: string | null;
  sections: { id: string; type: string; hidden: boolean; isNew: boolean; data: Record<string, unknown> }[];
  /** Stored category showcases the owner removed. */
  removedIds: string[];
};

/**
 * Checks a home page save: the same sections as stored (only their order, visibility and content
 * may change) and each section's content valid for its type.
 */
export function parseHomeUpdate(body: unknown, existing: { id: string; type: string }[], currentVersion: string): HomeUpdate {
  const parsed = homeBody.safeParse(body);
  if (!parsed.success) throw httpError(400, first(parsed.error));
  const { version, seoTitle, seoDescription, sections } = parsed.data;
  // Before comparing section ids: a stale copy may hold ids that a newer save replaced.
  assertVersion(currentVersion, version);

  const types = new Map(existing.map((e) => [e.id, e.type]));
  const ids = sections.map((s) => s.id);
  const changed = () => httpError(400, "sections: the list of sections changed. Reload and try again.");
  if (new Set(ids).size !== ids.length) throw changed();

  for (const section of sections) {
    if (types.has(section.id)) continue;
    if (!NEW_ID.test(section.id)) throw changed();
    if (section.type !== REPEATABLE_TYPE) throw httpError(400, "sections: only category showcases can be added.");
  }
  const removedIds = existing.filter((e) => !ids.includes(e.id)).map((e) => e.id);
  if (removedIds.some((id) => types.get(id) !== REPEATABLE_TYPE)) {
    throw httpError(400, "sections: only category showcases can be removed. Reload and try again.");
  }
  const showcases = sections.filter((s) => (types.get(s.id) ?? s.type) === REPEATABLE_TYPE).length;
  if (showcases > MAX_SHOWCASES) throw httpError(400, `sections: the home page can have at most ${MAX_SHOWCASES} category showcases.`);

  return {
    version,
    seoTitle: seoTitle || null,
    seoDescription: seoDescription || null,
    removedIds,
    sections: sections.map((section, i) => {
      const isNew = !types.has(section.id);
      const type = isNew ? REPEATABLE_TYPE : types.get(section.id)!;
      const { hidden: _ignored, ...data } = section.data;
      // A stored section this code doesn't know is kept as it is rather than blocking the save.
      if (!(SECTION_TYPES as readonly string[]).includes(type)) return { id: section.id, type, hidden: section.hidden, isNew, data };
      const result = parseSection(type, data);
      if (!result.ok) throw httpError(400, `sections.${i} (${type}) ${result.error}`);
      return { id: section.id, type, hidden: section.hidden, isNew, data: result.data };
    }),
  };
}

export function parseMenuUpdate(key: MenuKey, body: unknown): { version: string; name: string; items: NavItemInput[] } {
  const parsed = z
    .object({ version: z.string().min(1), name: z.string().trim().min(1, "Enter a heading.").max(60), items: menuSchema(key) })
    .safeParse(body);
  if (!parsed.success) throw httpError(400, first(parsed.error));
  return parsed.data;
}

export function parseContactUpdate(body: unknown): SiteContactInput & { version: string } {
  const parsed = contactSchema.extend({ version: z.string().min(1) }).safeParse(body);
  if (!parsed.success) throw httpError(400, first(parsed.error));
  return parsed.data;
}
