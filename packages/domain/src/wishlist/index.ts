import type { ProductDto } from "@dec-walls/types";
import { getProductBySlug } from "../catalog";

const wishlists = new Map<string, Set<string>>();

function getSet(userId: string): Set<string> {
  if (!wishlists.has(userId)) wishlists.set(userId, new Set());
  return wishlists.get(userId)!;
}

export async function addToWishlist(userId: string, slug: string): Promise<void> {
  const product = await getProductBySlug(slug);
  if (!product) throw new Error(`Product not found: ${slug}`);
  getSet(userId).add(slug);
}

export async function removeFromWishlist(userId: string, slug: string): Promise<void> {
  getSet(userId).delete(slug);
}

export async function getWishlist(userId: string): Promise<ProductDto[]> {
  const slugs = [...getSet(userId)];
  const results = await Promise.all(slugs.map(getProductBySlug));
  return results.filter((p): p is ProductDto => p !== null);
}

export async function isInWishlist(userId: string, slug: string): Promise<boolean> {
  return getSet(userId).has(slug);
}

export async function clearWishlist(userId: string): Promise<void> {
  wishlists.delete(userId);
}
