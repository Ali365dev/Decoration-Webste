import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
  sort: z.string().optional(),
  q: z.string().optional(),
});

export const moneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().length(3).default("PKR"),
});

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const productCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema,
  description: z.string().max(10000).optional(),
  price: moneySchema,
  compareAtPrice: moneySchema.optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
});

export const addToCartSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99).default(1),
});

export const checkoutSchema = z.object({
  cartId: z.string().uuid(),
  email: z.string().email(),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().length(2).default("PK"),
    phone: z.string().optional(),
  }),
});

export const cmsPageUpsertSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  scheduledAt: z.string().datetime().optional(),
  blocks: z
    .array(
      z.object({
        type: z.enum([
          "announcement",
          "hero",
          "video",
          "collection_tabs",
          "banner",
          "product_grid",
          "newsletter",
          "rich_text",
        ]),
        sortOrder: z.number().int().min(0),
        data: z.record(z.string(), z.unknown()),
      }),
    )
    .default([]),
});

export const phoneSchema = z
  .string()
  .min(7)
  .max(20)
  .regex(/^\+?[0-9]{7,20}$/);

export const addressSchema = z.object({
  fullName: z.string().min(1).max(200),
  line1: z.string().min(1).max(300),
  line2: z.string().max(300).optional(),
  city: z.string().min(1).max(100),
  region: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().length(2).default("PK"),
  phone: phoneSchema.optional(),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  orderId: z.string().uuid().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().max(100).optional(),
});

export const sizeSkuSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/);

export const couponCodeSchema = z
  .string()
  .min(1)
  .max(32)
  .regex(/^[A-Z0-9]+$/);

export type PaginationInput = z.infer<typeof paginationSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CmsPageUpsertInput = z.infer<typeof cmsPageUpsertSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
