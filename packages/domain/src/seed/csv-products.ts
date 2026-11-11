import type { ProductDto } from "@dec-walls/types";
import csvRows from "./catalog-additions.json";
import { wallArtProducts } from "./wall-art-products";

type CsvProductRow = { id: number; name: string; category: string; price: number };

const rows = csvRows as CsvProductRow[];
const tablePhotoUrls = [
  "/bareeze/image-103.jpg",
  "/bareeze/image-105.jpg",
  "/bareeze/image-107.jpg",
  "/bareeze/image-109.jpg",
  "/bareeze/image-111.jpg",
];
const islamicArt = wallArtProducts.filter((product) =>
  ["islamic-wall-art", "premium-islamic-decor", "islamic-canvas-art"].includes(
    product.categorySlug ?? "",
  ),
);
const clocks = wallArtProducts.filter((product) =>
  ["wall-clocks", "acrylic-wall-clocks"].includes(product.categorySlug ?? ""),
);
const mirrors = wallArtProducts.filter(
  (product) => product.categorySlug === "mirror-wall-art",
);

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function categoryInfo(row: CsvProductRow, index: number) {
  if (row.category === "Furniture") {
    const isTrolley = row.name.toLowerCase().includes("trolley");
    return {
      slug: isTrolley ? "serving-trolleys" : "tables-consoles",
      root: "home-decor",
      parent: "home-decor-furniture",
      image: tablePhotoUrls[index % tablePhotoUrls.length],
    };
  }
  if (row.category === "LED Lamps") {
    return {
      slug: "led-lamps",
      root: "home-decor",
      parent: "home-decor-luxury",
      image: "/home/p3.jpg",
    };
  }
  if (row.category === "Islamic Art") {
    return {
      slug: "islamic-wall-art",
      root: "canvas-and-wall-art",
      parent: "wooden-wall-art",
      image: islamicArt[index % islamicArt.length]?.primaryImageUrl ?? null,
    };
  }
  if (row.category === "Wall Clocks") {
    return {
      slug: "wall-clocks",
      root: "canvas-and-wall-art",
      parent: "wooden-wall-art",
      image: clocks[index % clocks.length]?.primaryImageUrl ?? null,
    };
  }
  if (row.category === "Mirrors") {
    return {
      slug: "mirror-wall-art",
      root: "canvas-and-wall-art",
      parent: "acrylic-wall-art",
      image: mirrors[index % mirrors.length]?.primaryImageUrl ?? null,
    };
  }
  if (row.category === "Home Décor") {
    return {
      slug: "decorative-showpieces",
      root: "home-decor",
      parent: "home-decor-luxury",
      image: "/home/banner-a1.jpg",
    };
  }
  return {
    slug: "kids-learning-tools",
    root: "baby-and-nursery",
    parent: "baby-nursery-essentials",
    image: "/home/banner-a3.jpg",
  };
}

export const csvProducts: ProductDto[] = rows.map((row, index) => {
  const category = categoryInfo(row, index);
  const suppliedImage =
    row.id <= 30
      ? `/products/csv/csv-product-${String(row.id).padStart(2, "0")}.jpg`
      : category.image;
  return {
    id: `p-csv-${String(row.id).padStart(2, "0")}`,
    slug: `${slugify(row.name)}-${row.id}`,
    name: row.name,
    description: null,
    status: "published",
    price: { amount: row.price, currency: "PKR" },
    compareAtPrice: null,
    primaryImageUrl: suppliedImage,
    hoverImageUrl: null,
    label: null,
    categorySlug: category.slug,
    collectionSlugs: [category.root, category.parent, category.slug],
  };
});
