import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/pages/page-hero";
import { ContactForm } from "@/components/pages/contact-form";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { COMPANY } from "@/lib/site-content";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact us",
  description: "Get in touch with the Dec Walls team about orders, products or anything else.",
  path: "/pages/contact",
});

const DETAILS = [
  { icon: Mail, label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { icon: Phone, label: "Phone", value: COMPANY.phone, href: `tel:${COMPANY.phoneHref}` },
  { icon: MapPin, label: "Workshop", value: COMPANY.city, href: null },
  { icon: Clock, label: "Hours", value: COMPANY.hours, href: null },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to us"
        intro="Questions about an order, a product or a bulk enquiry — send a note and we will reply within one working day."
      />

      <section className="bg-paper pb-20 md:pb-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_320px] lg:gap-20">
          <div className="max-w-[640px]">
            <ContactForm />
          </div>

          <aside>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-grey">
              Reach us directly
            </h2>
            <ul className="mt-6 space-y-6">
              {DETAILS.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-body" />
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.1em] text-grey">{label}</p>
                    {href ? (
                      <a href={href} className="text-[15px] text-ink transition-colors hover:text-[#f05e2d]">
                        {value}
                      </a>
                    ) : (
                      <p className="text-[15px] text-ink">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
