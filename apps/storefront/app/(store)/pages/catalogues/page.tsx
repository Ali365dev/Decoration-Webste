import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CATALOGUES } from "@/lib/site-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Catalogues",
  description: "Browse the Dec Walls seasonal catalogues for bedding, bath, living, dining and wall art.",
  path: "/pages/catalogues",
});

export default function CataloguesPage() {
  return (
    <>
      <PageHero
        eyebrow="Lookbooks"
        title="Seasonal catalogues"
        intro="Our collections, room by room. Flip through a catalogue to see how the pieces sit together before you shop."
        image="/home/cat-1.jpg"
        imageAlt="Dec Walls bedding catalogue cover"
      />

      <section className="bg-paper pb-20 md:pb-28">
        <div className="container-page">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {CATALOGUES.map((catalogue, index) => (
              <Reveal key={catalogue.title} as="article" delayMs={(index % 4) * 70} className="group">
                <a href="#" className="block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-canvas">
                    <Image
                      src={catalogue.image}
                      alt={`${catalogue.title} catalogue`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[0.5s] ease-[ease] group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[16px] font-medium leading-snug text-ink">
                        {catalogue.title}
                      </h2>
                      <p className="mt-1 text-[13px] text-body">{catalogue.season}</p>
                    </div>
                    <ArrowRight
                      size={18}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0 text-body transition-colors group-hover:text-[#f05e2d]"
                    />
                  </div>
                  <p className="mt-2 font-mono text-[12px] text-grey">{catalogue.pages} pages</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
