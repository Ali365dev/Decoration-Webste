import Link from "next/link";

export default function CartPage() {
  return (
    <section className="container-page py-16">
      <h1
        className="mb-4 text-ink"
        style={{
          fontSize: "var(--page-title-size)",
          fontWeight: "var(--heading-font-weight)",
        }}
      >
        Your bag
      </h1>
      <p className="mb-8 text-body">Your cart is ready for checkout.</p>
      <Link
        href="/checkout"
        className="inline-block rounded-pill border border-ink bg-ink px-[55px] py-[13.6px] text-xs font-medium uppercase leading-[21px] text-white"
      >
        Checkout
      </Link>
    </section>
  );
}
