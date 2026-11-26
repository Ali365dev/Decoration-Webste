import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/pages/page-hero";
import { FaqAccordion } from "@/components/pages/faq-accordion";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQs",
  description: "Answers to common questions about Dec Walls orders, delivery, product care and returns.",
  path: "/pages/faqs",
});

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="Help"
        title="Questions, answered"
        intro="The things people ask us most, about ordering, delivery, caring for your textiles and returns."
      />

      <section className="bg-paper pb-20 md:pb-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          <div className="max-w-[720px]">
            <FaqAccordion />
          </div>

          <aside className="lg:pt-2">
            <div className="rounded-[18px] border border-line-soft bg-canvas p-7">
              <h2 className="text-[17px] font-medium text-ink">Still stuck?</h2>
              <p className="mt-3 text-[14px] leading-[1.75] text-body">
                If your question is not here, our team is happy to help directly.
              </p>
              <Link
                href="/pages/contact"
                className="mt-5 inline-block rounded-pill bg-ink px-7 py-3 text-[12px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#f05e2d]"
              >
                Contact us
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
