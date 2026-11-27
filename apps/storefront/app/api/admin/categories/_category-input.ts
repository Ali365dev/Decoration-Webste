import { z } from "zod/v4";

const nullableText = z
  .string()
  .nullish()
  .transform((v) => (v && v.trim() ? v.trim() : null));

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1).optional(),
  parentId: z
    .union([z.uuid(), z.literal("")])
    .nullish()
    .transform((v) => (v ? v : null)),
  status: z.enum(["draft", "published", "scheduled", "archived"]).default("published"),
  imageUrl: nullableText,
  imagePublicId: nullableText,
});

export type CategoryInput = z.output<typeof categoryInputSchema>;
