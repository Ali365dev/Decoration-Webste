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
    badge: "50%*",
    ctaLabel: "Shop Now",
  },
  {
    label: "Baby & Nursery",
    href: "/collections/baby-and-nursery",
    image: "/home/banner-a3.jpg",
    ctaLabel: "Shop Now",
  },
  {
    label: "Bedding",
    href: "/collections/bedding",
    image: "/home/cat-1.jpg",
    badge: "30%*",
    ctaLabel: "Shop Bedding",
  },
  {
    label: "Canvas & Wall Art",
    href: "/collections/canvas-and-wall-art",
    image: homeProducts.find((product) => product.slug === "makkah-madinah-scenic-frame-set")?.primaryImageUrl ?? "/home/cat-4.jpg",
    badge: "50%*",
    ctaLabel: "Discover Now",
  },
  {
    label: "Curtains & Blinds",
    href: "/collections/curtains-and-blinds",
    image: "/home/p1.jpg",
    ctaLabel: "Explore All",
  },
  {
    label: "Cushions & Throws",
    href: "/collections/new-in",
    image: "/home/banner-a2.jpg",
    ctaLabel: "Shop Now",
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
      sortOrder: 1.5,
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
      id: "b-showcase",
      type: "category_showcase",
      sortOrder: 4,
      data: {
        bannerImage: "/home/hero-decor.jpg",
        heading: "Home Decor",
        ctaHref: "/collections/home-decor",
        ctaLabel: "Shop Now",
        categoryTitle: "Home Decor",
        categoryNav: [
          { label: "Luxury Home Decor", href: "/collections/home-decor-luxury" },
          { label: "Curtains & Blinds", href: "/collections/home-decor-curtains" },
          { label: "Furniture", href: "/collections/home-decor-furniture" },
          { label: "Premium Blinds", href: "/collections/home-decor-blinds" },
        ],
        collectionSlug: "home-decor-luxury",
      },
    },
    {
      id: "b-showcase-bedding",
      type: "category_showcase",
      sortOrder: 4.3,
      data: {
        bannerImage: "/home/hero-bedding.jpg",
        heading: "Bedding",
        ctaHref: "/collections/bedding",
        ctaLabel: "Shop Now",
        categoryTitle: "Bedding",
        categoryNav: [
          { label: "Bed Linen", href: "/collections/bedding-bed-linen" },
          { label: "Bedding Essentials", href: "/collections/bedding-essentials" },
          { label: "Comfort & Luxury", href: "/collections/bedding-comfort-luxury" },
          { label: "Kitchen Linen", href: "/collections/bedding-kitchen-linen" },
          { label: "Islamic Essentials", href: "/collections/bedding-islamic-essentials" },
          { label: "Bath Linen", href: "/collections/bedding-bath-linen" },
        ],
        collectionSlug: "bedding-bed-linen",
      },
    },
    {
      id: "b-showcase-curtains",
      type: "category_showcase",
      sortOrder: 4.6,
      data: {
        bannerImage: "/home/hero-3.jpg",
        heading: "Curtains & Blinds",
        ctaHref: "/collections/curtains-and-blinds",
        ctaLabel: "Shop Now",
        categoryTitle: "Curtains & Blinds",
        categoryNav: [
          { label: "Curtains by Fabric", href: "/collections/curtains-by-fabric" },
          { label: "Curtains by Design", href: "/collections/curtains-by-design" },
          { label: "Curtain Accessories", href: "/collections/curtain-accessories" },
          { label: "Blinds & Track Systems", href: "/collections/blinds-track-systems" },
          { label: "Special Collections", href: "/collections/curtains-special-collections" },
          { label: "Shop & Services", href: "/collections/curtains-shop-services" },
        ],
        collectionSlug: "curtains-by-fabric",
      },
    },
    {
      id: "b-categories",
      type: "banner",
      sortOrder: 2,
      data: { variant: "category_grid", tiles: categoryTiles },
    },
    {
      id: "b-video-showcase",
      type: "video_showcase",
      sortOrder: 6,
      data: {
        videoSrc: "/videos/showcase.mp4",
        posterSrc: "/home/video-poster.jpg",
        heading: "Give Your Walls a Story.",
        description:
          "Discover thoughtfully curated wall art that transforms ordinary spaces into extraordinary homes.",
        cta: { label: "Read More", href: "/pages/about" },
      },
    },
    {
      id: "b-tabs",
      type: "collection_tabs",
      sortOrder: 5,
      data: {
        tabs: [
          { label: "SALE", collectionSlug: "sale" },
          { label: "BEST SELLER", collectionSlug: "best-seller" },
          { label: "TOP RATED", collectionSlug: "top-rated" },
          { label: "NEW IN", collectionSlug: "new-in" },
        ],
      },
    },
    {
      id: "b-trust-badges",
      type: "trust_badges",
      sortOrder: 9,
      data: {
        items: [
          { icon: "truck", label: "Free Shipping" },
          { icon: "shield-check", label: "Secure Shopping" },
          { icon: "award", label: "100% Satisfaction" },
          { icon: "badge-check", label: "Product Guarantee" },
        ],
      },
    },
    {
      id: "b-reviews",
      type: "customer_reviews",
      sortOrder: 10,
      data: {
        eyebrow: "Customer Love",
        heading: "What Our Customers Say",
        subtitle:
          "Real stories from homes across Pakistan, styled with Dec Walls.",
        reviews: [
          {
            name: "Ayesha Khan",
            location: "Lahore",
            rating: 5,
            quote:
              "The bed in a bag set completely transformed our room. The embroidery detail is stunning in person and the fabric feels genuinely premium.",
          },
          {
            name: "Bilal Ahmed",
            location: "Karachi",
            rating: 5,
            quote:
              "Ordered the silk bed sheet set for our anniversary and it exceeded every expectation. Delivery was fast and packaging was beautiful.",
          },
          {
            name: "Sana Tariq",
            location: "Islamabad",
            rating: 5,
            quote:
              "The wall art pieces are the first thing every guest comments on. Great craftsmanship and the gold detailing hasn't faded a bit.",
          },
          {
            name: "Hamza Raza",
            location: "Faisalabad",
            rating: 4,
            quote:
              "Curtains fit perfectly and the fabric quality is far better than what we'd found elsewhere at this price point. Will order again.",
          },
          {
            name: "Mehwish Iqbal",
            location: "Rawalpindi",
            rating: 5,
            quote:
              "From browsing to delivery, the whole experience felt premium. The cushion covers tie the whole living room together.",
          },
          {
            name: "Usman Sheikh",
            location: "Multan",
            rating: 5,
            quote:
              "Customer support helped me pick the right size table runner and it arrived exactly as pictured. Highly recommend Dec Walls.",
          },
        ],
      },
    },
    {
      id: "b-newsletter",
      type: "newsletter",
      sortOrder: 11,
      data: {
        eyebrow: "Stay Connected",
        heading: "Join the Dec Walls family.",
        subtitle:
          "Subscribe for early access to new collections, styling edits, and offers delivered straight to your inbox.",
        placeholder: "Enter your email address",
        ctaLabel: "Subscribe",
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
  if (collectionSlug !== "new-in") {
    const tagged = homeProducts.filter((p) => p.collectionSlugs?.includes(collectionSlug));
    if (tagged.length > 0) return tagged;
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
