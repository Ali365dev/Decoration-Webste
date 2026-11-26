import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { STORES } from "@/lib/site-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Store locator",
  description: "Find a Dec Walls store near you in Lahore, Karachi and Islamabad.",
  path: "/pages/store-locator",
});

export default function StoreLocatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Visit us"
        title="Find a store"
        intro="Come feel the cloth in person. Our showrooms carry the full range across bedding, bath, living and dining."
        image="/home/banner-a6.jpg"
        imageAlt="A Dec Walls showroom"
      />

      <section className="bg-paper pb-20 md:pb-28">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2">
            {STORES.map((store, index) => (
              <Reveal
                key={store.name}
                as="article"
                delayMs={(index % 2) * 80}
                className="rounded-[16px] border border-line-soft bg-paper p-7 transition-colors hover:border-line"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[18px] font-medium text-ink">{store.name}</h2>
                  <span className="text-[12px] uppercase tracking-[0.1em] text-grey">{store.city}</span>
                </div>

                <ul className="mt-5 space-y-3 text-[14px] text-body">
                  <li className="flex gap-3">
                    <MapPin size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-grey" />
                    <span className="leading-relaxed">{store.address}</span>
                  </li>
                  <li className="flex gap-3">
                    <Phone size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-grey" />
                    <a
                      href={`tel:${store.phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-[#f05e2d]"
                    >
                      {store.phone}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Clock size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-grey" />
                    <span>{store.hours}</span>
                  </li>
                </ul>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${store.name}, ${store.address}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block border-b border-ink pb-px text-[12px] font-medium uppercase tracking-wide text-ink transition-colors hover:border-[#f05e2d] hover:text-[#f05e2d]"
                >
                  Get directions
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
