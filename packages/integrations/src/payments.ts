import type { Money } from "@dec-walls/types";
import { getEnv } from "@dec-walls/config";

export type PaymentIntent = {
  id: string;
  status: "requires_action" | "succeeded" | "failed";
  clientSecret?: string;
  amount: Money;
};

export interface PaymentProvider {
  createIntent(input: {
    orderId: string;
    amount: Money;
  }): Promise<PaymentIntent>;
  refund(input: {
    paymentId: string;
    amount: Money;
    reason?: string;
  }): Promise<{ id: string; status: string }>;
}

class NoopPaymentProvider implements PaymentProvider {
  async createIntent(input: {
    orderId: string;
    amount: Money;
  }): Promise<PaymentIntent> {
    return {
      id: `noop_${input.orderId}`,
      status: "succeeded",
      amount: input.amount,
    };
  }

  async refund(input: {
    paymentId: string;
    amount: Money;
  }): Promise<{ id: string; status: string }> {
    return { id: `refund_${input.paymentId}`, status: "succeeded" };
  }
}

export function getPaymentProvider(): PaymentProvider {
  const provider = getEnv().PAYMENT_PROVIDER;
  if (provider === "stripe") {
    // Stripe adapter plugs here without changing domain callers.
    return new NoopPaymentProvider();
  }
  return new NoopPaymentProvider();
}
