import type { Database } from "@dec-walls/db/client";
import { categories } from "@dec-walls/db/schema";
import { ConflictError, InputError, slugify } from "../products/_product-input";
import type { CategoryInput } from "./_category-input";

export const categoryColumns = {
  id: categories.id,
  slug: categories.slug,
  name: categories.name,
  parentId: categories.parentId,
  sortOrder: categories.sortOrder,
  status: categories.status,
  imageUrl: categories.imageUrl,
  imageStoragePath: categories.imageStoragePath,
};

export function categoryValues(input: CategoryInput) {
  const slug = slugify(input.slug ?? input.name);
  if (!slug) throw new InputError("slug: must contain letters or numbers");
  return {
    name: input.name,
    slug,
    parentId: input.parentId,
    status: input.status,
    imageUrl: input.imageUrl,
    imageStoragePath: input.imagePublicId,
  };
}

/** Turns a duplicate-slug violation (possibly wrapped by Drizzle) into a ConflictError. */
export function rethrowSlugConflict(err: unknown): never {
  const e = err as { code?: string; constraint_name?: string; cause?: { code?: string; constraint_name?: string } };
  const pg = e?.code ? e : e?.cause;
  if (pg?.code === "23505" && pg.constraint_name === "categories_slug_uq") {
    throw new ConflictError("A category with this slug already exists");
  }
  throw err;
}

export type { Database };
