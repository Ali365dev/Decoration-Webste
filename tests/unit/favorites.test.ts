import { describe, expect, it, beforeEach } from "vitest";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist,
  clearWishlist,
} from "../../packages/domain/src/wishlist";
import { listProducts } from "../../packages/domain/src/catalog";

// ── Favorites / Wishlist ─────────────────────────────────────────────────────

describe("favorites (wishlist)", () => {
  let slug: string;
  const userId = "test-user-fav-" + Math.random().toString(36).slice(2);

  beforeEach(async () => {
    await clearWishlist(userId);
    const products = await listProducts({ page: 1, pageSize: 1 });
    slug = products.items[0].slug;
  });

  it("wishlist is empty for a new user", async () => {
    const items = await getWishlist(userId);
    expect(items).toEqual([]);
  });

  it("isInWishlist returns false for item not added", async () => {
    expect(await isInWishlist(userId, slug)).toBe(false);
  });

  it("adds a product to wishlist", async () => {
    await addToWishlist(userId, slug);
    const items = await getWishlist(userId);
    expect(items.length).toBe(1);
    expect(items[0].slug).toBe(slug);
  });

  it("isInWishlist returns true after adding", async () => {
    await addToWishlist(userId, slug);
    expect(await isInWishlist(userId, slug)).toBe(true);
  });

  it("adding same product twice does not duplicate", async () => {
    await addToWishlist(userId, slug);
    await addToWishlist(userId, slug);
    const items = await getWishlist(userId);
    expect(items.length).toBe(1);
  });

  it("removes a product from wishlist", async () => {
    await addToWishlist(userId, slug);
    await removeFromWishlist(userId, slug);
    const items = await getWishlist(userId);
    expect(items).toEqual([]);
  });

  it("isInWishlist returns false after removal", async () => {
    await addToWishlist(userId, slug);
    await removeFromWishlist(userId, slug);
    expect(await isInWishlist(userId, slug)).toBe(false);
  });

  it("clears all items from wishlist", async () => {
    const products = await listProducts({ page: 1, pageSize: 3 });
    for (const p of products.items) {
      await addToWishlist(userId, p.slug);
    }
    await clearWishlist(userId);
    const items = await getWishlist(userId);
    expect(items).toEqual([]);
  });

  it("throws when adding a product with unknown slug", async () => {
    await expect(addToWishlist(userId, "no-such-product-xyz999")).rejects.toThrow("Product not found");
  });

  it("removing a product not in wishlist does not throw", async () => {
    await expect(removeFromWishlist(userId, slug)).resolves.toBeUndefined();
  });

  it("different users have independent wishlists", async () => {
    const userA = "user-a-" + Math.random().toString(36).slice(2);
    const userB = "user-b-" + Math.random().toString(36).slice(2);
    await addToWishlist(userA, slug);
    const aItems = await getWishlist(userA);
    const bItems = await getWishlist(userB);
    expect(aItems.length).toBe(1);
    expect(bItems.length).toBe(0);
  });
});
