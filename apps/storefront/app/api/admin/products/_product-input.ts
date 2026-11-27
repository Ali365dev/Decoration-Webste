import { z } from "zod/v4";

export class InputError extends Error {
  status = 400;
}

export class ConflictError extends Error {
  status = 409;
}

const money = z.coerce.number().positive();
const count = z.coerce.number().int().min(0);
const optionalText = z
  .string()
  .nullish()
  .transform((v) => (v && v.trim() ? v.trim() : null));

export const productInputSchema = z.object({
  name: z.string().trim().min(3),
  slug: z.string().trim().min(1).optional(),
  description: optionalText,
  status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
  priceAmount: money,
  compareAtAmount: z.coerce
    .number()
    .min(0)
    .nullish()
    .transform((v) => (v ? v : null)),
  material: optionalText,
  sku: z.string().trim().min(1),
  stock: count,
  categoryId: z.uuid().nullish().transform((v) => v ?? null),
  collectionIds: z.array(z.uuid()).default([]),
  variants: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        priceAmount: money,
        inventoryQuantity: count,
        sku: z.string().trim().min(1).optional(),
      }),
    )
    .default([]),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        publicId: z.string().nullish().transform((v) => v ?? null),
        isPrimary: z.boolean().default(false),
      }),
    )
    .default([]),
});

export type ProductInput = z.output<typeof productInputSchema>;

export interface VariantRow {
  sku: string;
  title: string;
  priceAmount: string;
  inventoryQuantity: number;
  isDefault: boolean;
  sortOrder: number;
  isActive: true;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function nextFreeSlug(base: string, taken: string[]): string {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export function buildVariantRows(input: ProductInput): VariantRow[] {
  const rows: VariantRow[] = input.variants.length
    ? input.variants.map((v, i) => ({
        sku: v.sku ?? `${input.sku}-${slugify(v.title)}`,
        title: v.title,
        priceAmount: String(v.priceAmount),
        inventoryQuantity: v.inventoryQuantity,
        isDefault: i === 0,
        sortOrder: i,
        isActive: true,
      }))
    : [
        {
          sku: input.sku,
          title: "Default",
          priceAmount: String(input.priceAmount),
          inventoryQuantity: input.stock,
          isDefault: true,
          sortOrder: 0,
          isActive: true,
        },
      ];

  const seen = new Set<string>();
  for (const r of rows) {
    if (seen.has(r.sku)) throw new InputError("Two sizes have the same SKU");
    seen.add(r.sku);
  }
  return rows;
}

export function planVariantChanges(
  existing: { id: string; sku: string }[],
  next: VariantRow[],
): { insert: VariantRow[]; update: { id: string; row: VariantRow }[]; deactivate: string[] } {
  const bySku = new Map(existing.map((e) => [e.sku, e.id]));
  const nextSkus = new Set(next.map((r) => r.sku));
  return {
    insert: next.filter((r) => !bySku.has(r.sku)),
    update: next.filter((r) => bySku.has(r.sku)).map((row) => ({ id: bySku.get(row.sku)!, row })),
    deactivate: existing.filter((e) => !nextSkus.has(e.sku)).map((e) => e.id),
  };
}
