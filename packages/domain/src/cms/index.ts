import type {
  CmsPageDto,
  NavItemDto,
  ProductDto,
} from "@dec-walls/types";
import { homeProducts } from "../seed/products";
import { mainNav } from "./navigation";

export { homeProducts, mainNav };

export const categoryTiles = [
  {
    label: "Home Decor",
    href: "/collections/home-decor",
    image: "/home/banner-a1.jpg",
  },
  {
    label: "Baby & Nursery",
    href: "/collections/baby-and-nursery",
    image: "/home/banner-a3.jpg",
  },
  {
    label: "Bedding",
    href: "/collections/bedding",
    image: "/home/cat-1.jpg",
  },
  {
    label: "Canvas & Wall Art",
    href: "/collections/canvas-and-wall-art",
    image: homeProducts.find((product) => product.slug === "makkah-madinah-scenic-frame-set")?.primaryImageUrl ?? "/home/cat-4.jpg",
  },
  {
    label: "Curtains & Blinds",
    href: "/collections/curtains-and-blinds",
    image: "/home/p1.jpg",
  },
];

export const lifestyleTiles = [
  {
    label: "Prayer Mat",
    href: "/collections/new-in",
    image: "/home/banner-a1.jpg",
  },
  {
    label: "Cushions",
    href: "/collections/new-in",
    image: "/home/banner-a2.jpg",
  },
  {
    label: "Khaise",
    href: "/collections/new-in",
    image: "/home/banner-a3.jpg",
  },
  {
    label: "Table Linen",
    href: "/collections/new-in",
    image: "/home/banner-a4.jpg",
  },
  {
    label: "Throws",
    href: "/collections/new-in",
    image: "/home/banner-a5.jpg",
  },
  {
    label: "Decor",
    href: "/collections/new-in",
    image: "/home/banner-a6.jpg",
  },
];

const homePage: CmsPageDto = {
  id: "page-home",
  slug: "home",
  title: "Dec Walls",
  status: "published",
  seoTitle: "Dec Walls | Home textiles",
  seoDescription:
    "Shop bedding, bath, dining, living, and accessories.",
  blocks: [
    {
      id: "b-announce",
      type: "announcement",
      sortOrder: 0,
      data: {
        messages: [
          "NEW ARRIVALS ARE NOW LIVE!",
          "WINTER COLLECTION '26!",
          "AVAILABLE IN-STORES & ONLINE",
        ],
      },
    },
    {
      id: "b-hero",
      type: "hero",
      sortOrder: 1,
      data: {
        titleLine1: "NEW",
        titleLine2: "Arrivals",
        ctaHref: "/collections/new-in",
        imageUrl: "/home/hero-1.jpg",
        imageUrlAlt: "/home/hero-2.jpg",
      },
    },
    {
      id: "b-categories",
      type: "banner",
      sortOrder: 2,
      data: { variant: "category_grid", tiles: categoryTiles },
    },
    {
      id: "b-lifestyle",
      type: "banner",
      sortOrder: 3,
      data: { variant: "lifestyle_grid", tiles: lifestyleTiles },
    },
    {
      id: "b-new-in",
      type: "product_grid",
      sortOrder: 4,
      data: {
        title: "NEW IN",
        subtitle: "Here's some of our most popular products people are in love with.",
        collectionSlug: "new-in",
      },
    },
    {
      id: "b-tabs",
      type: "collection_tabs",
      sortOrder: 5,
      data: {
        tabs: [
          { label: "BEDDING", collectionSlug: "new-in" },
          { label: "BATH", collectionSlug: "new-in" },
          { label: "DINING", collectionSlug: "new-in" },
          { label: "LIVING", collectionSlug: "new-in" },
        ],
      },
    },
    {
      id: "b-sale",
      type: "product_grid",
      sortOrder: 6,
      data: {
        title: "SALE",
        collectionSlug: "sale",
      },
    },
    {
      id: "b-video",
      type: "video",
      sortOrder: 7,
      data: {
        posterUrl: "/home/video-poster.jpg",
      },
    },
    {
      id: "b-support",
      type: "rich_text",
      sortOrder: 8,
      data: {
        variant: "support",
        title: "Support",
        body: "Contact us 9am to 6pm · 5 days a week",
        phone: "0300-0606662",
        imageUrl: "/home/support.jpg",
      },
    },
  ],
};

export async function getPublishedPageBySlug(
  slug: string,
): Promise<CmsPageDto | null> {
  if (slug === "home" || slug === "") return homePage;
  return null;
}

export async function listPagesAdmin(): Promise<CmsPageDto[]> {
  return [homePage];
}

export async function getMainNavigation(): Promise<NavItemDto[]> {
  return mainNav;
}

export async function resolveProductGridBlock(
  collectionSlug: string,
): Promise<ProductDto[]> {
  if (collectionSlug === "sale") {
    return homeProducts.filter((p) => p.compareAtPrice);
  }
  return homeProducts.filter((p) => p.label === "NEW IN");
}

export async function getFooterLinks() {
  return {
    customerCare: [
      { label: "Contact us", href: "/pages/contact" },
      { label: "Shipping", href: "/pages/shipping" },
      { label: "Returns", href: "/pages/returns" },
    ],
    information: [
      { label: "About", href: "/pages/about" },
      { label: "Stores", href: "/pages/stores" },
    ],
    policies: [
      { label: "Privacy", href: "/pages/privacy" },
      { label: "Terms", href: "/pages/terms" },
    ],
  };
}
