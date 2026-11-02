import { Button, Input } from "@dec-walls/ui";

export default function CheckoutPage() {
  return (
    <section className="container-page grid gap-10 py-16 lg:grid-cols-2">
      <div>
        <h1
          className="mb-8 text-ink"
          style={{
            fontSize: "var(--page-title-size)",
            fontWeight: "var(--heading-font-weight)",
          }}
        >
          Checkout
        </h1>
        <form className="space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="fullName" placeholder="Full name" required />
          <Input name="line1" placeholder="Address" required />
          <Input name="city" placeholder="City" required />
          <Input name="phone" placeholder="Phone" />
          <Button variant="primary" type="submit">
            Place order
          </Button>
        </form>
      </div>
      <aside className="rounded-[var(--radius-media)] border border-line-soft bg-paper p-6">
        <h2 className="mb-4 text-base font-medium text-ink">Order summary</h2>
        <p className="text-sm text-body">
          Payment runs through the payments adapter (`noop` locally; Stripe later).
        </p>
      </aside>
    </section>
  );
}
