import { z } from "zod";

/** A link or media path the storefront may use: a site path ("/…", not "//…") or an https URL. */
export const linkHref = z
  .string({ error: "Enter a link." })
  .trim()
  .min(1, "Enter a link.")
  .max(500)
  .regex(/^(\/(?!\/)|https:\/\/)/, "Links must start with / or https://");

/**
 * An image the storefront's next/image can load: a site path with no query string or # (the
 * loader refuses those for local images), or an https URL on a host allowed in
 * apps/storefront/next.config.ts `images.remotePatterns` (query strings are fine there).
 * Anything else makes the image loader throw and would take the page down.
 */
const IMAGE_HOSTS: RegExp[] = [
  /^https:\/\/res\.cloudinary\.com\/[^#\s]+$/,
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/[^#\s]+$/,
  /^https:\/\/bareezehome\.com\.pk\/cdn\/shop\/files\/[^#\s]+$/,
  /^https:\/\/pyariwalls\.pk\/cdn\/shop\/[^#\s]+$/,
];
export const imageSrc = z
  .string({ error: "Add an image." })
  .trim()
  .min(1, "Add an image.")
  .max(500)
  .refine(
    (v) => /^\/(?![\/\\])[^?#\s]+$/.test(v) || IMAGE_HOSTS.some((re) => re.test(v)),
    "Use an uploaded image, a site path like /home/hero.jpg, or a Cloudinary address",
  );

const text = (max: number) => z.string({ error: "This field is required." }).trim().min(1, "This field is required.").max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Choose a collection.");

export const SECTION_TYPES = [
  "announcement",
  "hero",
  "banner",
  "category_showcase",
  "product_grid",
  "collection_tabs",
  "video_showcase",
  "trust_badges",
  "customer_reviews",
  "newsletter",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export const TRUST_BADGE_ICONS = ["truck", "shield-check", "award", "badge-check", "star"] as const;

const hidden = { hidden: z.boolean().optional() };

export const sectionDataSchemas = {
  announcement: z.object({ ...hidden, messages: z.array(text(120)).min(1, "Add at least one message.").max(10) }),
  hero: z.object({
    ...hidden,
    slides: z
      .array(
        z.object({
          image: imageSrc,
          label: text(60),
          heading: text(60),
          ctaLabel: text(30),
          ctaHref: linkHref,
        }),
      )
      .min(1, "Add at least one slide.")
      .max(8),
  }),
  banner: z.object({
    ...hidden,
    variant: z.literal("category_grid"),
    tiles: z
      .array(
        z.object({
          label: text(60),
          href: linkHref,
          image: imageSrc,
          badge: optionalText(12),
          ctaLabel: text(30),
        }),
      )
      .min(1, "Add at least one tile.")
      .max(12),
  }),
  category_showcase: z.object({
    ...hidden,
    bannerImage: imageSrc,
    heading: text(60),
    ctaHref: linkHref,
    ctaLabel: optionalText(30),
    categoryTitle: text(60),
    categoryNav: z.array(z.object({ label: text(60), href: linkHref })).max(10),
    collectionSlug: slug,
  }),
  product_grid: z.object({
    ...hidden,
    collectionSlug: slug,
    limit: z.number().int().min(1).max(24).optional(),
    title: optionalText(80),
    subtitle: optionalText(200),
  }),
  collection_tabs: z.object({
    ...hidden,
    tabs: z.array(z.object({ label: text(30), collectionSlug: slug })).min(1, "Add at least one tab.").max(6),
  }),
  video_showcase: z.object({
    ...hidden,
    videoSrc: linkHref,
    videoSrcMobile: linkHref.optional(),
    posterSrc: imageSrc,
    heading: optionalText(80),
    description: optionalText(300),
    cta: z.object({ label: text(30), href: linkHref }).optional(),
  }),
  trust_badges: z.object({
    ...hidden,
    items: z.array(z.object({ icon: z.enum(TRUST_BADGE_ICONS), label: text(40) })).min(1, "Add at least one badge.").max(6),
  }),
  customer_reviews: z.object({
    ...hidden,
    eyebrow: optionalText(40),
    heading: text(80),
    subtitle: optionalText(200),
    reviews: z
      .array(
        z.object({
          name: text(60),
          location: text(60),
          rating: z.number().int().min(1).max(5),
          quote: text(400),
        }),
      )
      .max(20),
  }),
  newsletter: z.object({
    ...hidden,
    eyebrow: optionalText(40),
    heading: text(80),
    subtitle: optionalText(200),
    placeholder: optionalText(60),
    ctaLabel: optionalText(30),
  }),
} satisfies Record<SectionType, z.ZodType>;

export type SectionData<T extends SectionType> = z.infer<(typeof sectionDataSchemas)[T]>;

const formatIssue = (issue: z.core.$ZodIssue) => `${issue.path.join(".") || "data"}: ${issue.message}`;

/** Validates one section's data for its type. Unknown keys are dropped. */
export function parseSection(
  type: string,
  data: unknown,
): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  if (!(SECTION_TYPES as readonly string[]).includes(type)) return { ok: false, error: `Unknown section type "${type}"` };
  const result = sectionDataSchemas[type as SectionType].safeParse(data);
  return result.success
    ? { ok: true, data: result.data as Record<string, unknown> }
    : { ok: false, error: formatIssue(result.error.issues[0]!) };
}

export const MENU_KEYS = ["main", "footer-information", "footer-customer-service"] as const;
export type MenuKey = (typeof MENU_KEYS)[number];
export const MENU_DEPTH: Record<MenuKey, number> = { main: 3, "footer-information": 1, "footer-customer-service": 1 };

export type NavItemInput = { label: string; href: string; children: NavItemInput[] };

function navItemsSchema(depth: number): z.ZodType<NavItemInput[]> {
  const children = depth > 1 ? navItemsSchema(depth - 1) : z.array(z.never(), "Links at this level can't have sub-links.").max(0);
  return z
    .array(
      z.object({
        label: text(60),
        href: linkHref,
        children: children.default([]),
      }),
    )
    .max(60) as z.ZodType<NavItemInput[]>;
}

/** The items of one menu, nested no deeper than that menu allows (main: 3 levels, footers: 1). */
export function menuSchema(key: MenuKey) {
  return navItemsSchema(MENU_DEPTH[key]);
}

export const SOCIAL_NETWORKS = ["facebook", "instagram", "youtube"] as const;

export const contactSchema = z.object({
  address: text(200),
  email: z.string().trim().email("Enter a valid email address."),
  phone: text(30),
  social: z.array(z.object({ network: z.enum(SOCIAL_NETWORKS), href: linkHref })).max(SOCIAL_NETWORKS.length),
});
export type SiteContactInput = z.infer<typeof contactSchema>;
