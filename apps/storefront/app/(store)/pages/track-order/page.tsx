import type { Metadata } from "next";
import { PageHero } from "@/components/pages/page-hero";
import { TrackOrderForm } from "@/components/pages/track-order-form";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Order tracking",
  description: "Track your Dec Walls order with your order number and email.",
  path: "/pages/track-order",
});

export default function TrackOrderPage() {
  return (
    <>
      <PageHero
        eyebrow="Order tracking"
        title="Where is my order?"
        intro="Enter your order number and email to follow your parcel from the workshop to your door."
      />

      <section className="bg-paper pb-20 md:pb-28">
        <div className="container-page">
          <TrackOrderForm />
        </div>
      </section>
    </>
  );
}
