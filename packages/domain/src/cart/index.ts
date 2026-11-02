import type { CartDto, CartItemDto, Money } from "@dec-walls/types";
import type { AddToCartInput } from "@dec-walls/validation";
import { getProductBySlug, listProducts } from "../catalog";

const carts = new Map<string, CartDto>();

function money(amount: number, currency = "PKR"): Money {
  return { amount, currency };
}

function recompute(cart: CartDto): CartDto {
  const subtotalAmount = cart.items.reduce(
    (sum, item) => sum + item.unitPrice.amount * item.quantity,
    0,
  );
  return {
    ...cart,
    subtotal: money(subtotalAmount, cart.subtotal.currency),
  };
}

export async function getOrCreateCart(cartId?: string): Promise<CartDto> {
  if (cartId && carts.has(cartId)) {
    return carts.get(cartId)!;
  }
  const cart: CartDto = {
    id: cartId ?? crypto.randomUUID(),
    items: [],
    subtotal: money(0),
  };
  carts.set(cart.id, cart);
  return cart;
}

export async function getCart(cartId: string): Promise<CartDto | null> {
  return carts.get(cartId) ?? null;
}

export async function addToCart(
  cartId: string,
  input: AddToCartInput,
): Promise<CartDto> {
  const cart = await getOrCreateCart(cartId);
  const products = await listProducts({ page: 1, pageSize: 100 });
  const product =
    products.items.find((p) => p.id === input.variantId) ??
    products.items[0] ??
    (await getProductBySlug("quilt-bed-sheet"));

  if (!product) {
    throw new Error("Product not found for cart line");
  }

  const existing = cart.items.find((i) => i.variantId === input.variantId);
  let items: CartItemDto[];
  if (existing) {
    items = cart.items.map((i) =>
      i.variantId === input.variantId
        ? { ...i, quantity: i.quantity + input.quantity }
        : i,
    );
  } else {
    items = [
      ...cart.items,
      {
        id: crypto.randomUUID(),
        variantId: input.variantId,
        productId: product.id,
        title: product.name,
        quantity: input.quantity,
        unitPrice: product.price,
        imageUrl: product.primaryImageUrl,
      },
    ];
  }

  const next = recompute({ ...cart, items });
  carts.set(cart.id, next);
  return next;
}

export async function updateCartItemQuantity(
  cartId: string,
  itemId: string,
  quantity: number,
): Promise<CartDto> {
  const cart = await getOrCreateCart(cartId);
  const items =
    quantity <= 0
      ? cart.items.filter((i) => i.id !== itemId)
      : cart.items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
  const next = recompute({ ...cart, items });
  carts.set(cart.id, next);
  return next;
}

export async function clearCart(cartId: string): Promise<CartDto> {
  const next = recompute({
    id: cartId,
    items: [],
    subtotal: money(0),
  });
  carts.set(cartId, next);
  return next;
}
