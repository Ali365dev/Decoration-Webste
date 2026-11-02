import type { OrderDto } from "@dec-walls/types";
import type { CheckoutInput } from "@dec-walls/validation";
import { getPaymentProvider, getEmailProvider } from "@dec-walls/integrations";
import { clearCart, getCart } from "../cart";

const orders: OrderDto[] = [];

export async function listOrders(): Promise<OrderDto[]> {
  return orders;
}

export async function getOrderById(id: string): Promise<OrderDto | null> {
  return orders.find((o) => o.id === id) ?? null;
}

export async function createCheckoutOrder(
  input: CheckoutInput,
): Promise<{ order: OrderDto; paymentId: string }> {
  const cart = await getCart(input.cartId);
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const order: OrderDto = {
    id: crypto.randomUUID(),
    number: `DW-${String(orders.length + 1001)}`,
    status: "pending",
    total: cart.subtotal,
    createdAt: new Date().toISOString(),
  };

  const payment = await getPaymentProvider().createIntent({
    orderId: order.id,
    amount: order.total,
  });

  if (payment.status === "succeeded") {
    order.status = "paid";
  }

  orders.unshift(order);
  await clearCart(input.cartId);

  await getEmailProvider().send({
    to: input.email,
    subject: `Order ${order.number} confirmed`,
    html: `<p>Thanks for your order ${order.number}.</p>`,
  });

  return { order, paymentId: payment.id };
}
