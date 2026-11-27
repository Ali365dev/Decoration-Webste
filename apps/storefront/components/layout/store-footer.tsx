"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { ArrowUp } from "lucide-react";

type FooterColumn = { title: string; links: { label: string; href: string }[] };
type FooterLinks = { information: FooterColumn; customerService: FooterColumn };
type SocialNetwork = "facebook" | "instagram" | "youtube";
type SiteContact = { address: string; email: string; phone: string; social: { network: SocialNetwork; href: string }[] };

// Built-in icons; which networks show, and their links, come from the dashboard.
const SOCIAL_ICONS: { network: SocialNetwork; label: string; svg: React.ReactNode }[] = [
  {
    network: "facebook",
    label: "Facebook",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    network: "instagram",
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    network: "youtube",
    label: "YouTube",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function StoreFooter({ links, contact }: { links: FooterLinks; contact: SiteContact }) {
  const social = contact.social.flatMap((entry) => {
    const icon = SOCIAL_ICONS.find((i) => i.network === entry.network);
    return icon ? [{ ...icon, href: entry.href }] : [];
  });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <footer className="bg-white text-[#222]">
      {/* Main grid */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-8 pb-10 pt-14 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1.2fr_1.2fr] lg:gap-8 lg:px-16">

        {/* Col 1 — Contact Us */}
        <div>
          <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#333]">
            Contact Us
          </h3>
          <ul className="space-y-4">
            <li className="text-[14px] leading-relaxed text-[#666]">{contact.address}</li>
            <li>
              <a href={`mailto:${contact.email}`} className="text-[14px] text-[#666] transition-colors hover:text-[#222]">
                {contact.email}
              </a>
            </li>
            <li className="text-[14px] text-[#666]">{contact.phone}</li>
          </ul>
        </div>

        {/* Col 2 — Information */}
        <div>
          <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#333]">
            {links.information.title}
          </h3>
          <ul className="space-y-4">
            {links.information.links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[14px] text-[#666] transition-colors duration-200 hover:text-[#222]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Customer Services */}
        <div>
          <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#333]">
            {links.customerService.title}
          </h3>
          <ul className="space-y-4">
            {links.customerService.links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[14px] text-[#666] transition-colors duration-200 hover:text-[#222]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Newsletter */}
        <div>
          <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#333]">
            Newsletter
          </h3>
          <p className="mb-5 text-[14px] leading-relaxed text-[#666]">
            Sign up to our newsletter to receive exclusive offers.
          </p>
          {submitted ? (
            <p className="text-sm text-[#666]">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Email input with icon inside */}
              <div className="flex items-center border border-[#d0d0d0] bg-white">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  className="h-11 min-w-0 flex-1 bg-transparent pl-3 text-[13px] text-[#222] placeholder-[#aaa] outline-none"
                />
                <span className="flex h-11 w-11 shrink-0 items-center justify-center text-[#2a9d8f]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
              </div>
              {/* Subscribe button — same width as input, below */}
              <button
                type="submit"
                className="mt-3 w-full bg-[#1a1a1a] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#333]"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Social icons row — left-aligned, below columns */}
      <div className="mx-auto max-w-[1400px] px-8 pb-8 lg:px-16">
        <div className="flex items-center gap-5">
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-[#444] transition-colors duration-200 hover:text-[#000]"
            >
              {s.svg}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#e8e8e8]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between sm:px-8 sm:py-4 lg:px-16">
          {/* Scroll to top + copyright */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#bbb] text-[#555] transition-all duration-200 hover:border-[#888] hover:text-[#222]"
            >
              <ArrowUp size={13} strokeWidth={2} />
            </button>
            <p className="whitespace-nowrap text-[12px] text-[#888]">
              © {new Date().getFullYear()} – Dec Walls
            </p>
          </div>

          {/* Payment icons */}
          <div className="flex items-center gap-3">
            {/* Visa */}
            <svg viewBox="0 0 60 20" className="h-5 w-auto" aria-label="Visa">
              <text x="2" y="16" fill="#1a1f71" fontSize="17" fontWeight="700" fontFamily="Arial">VISA</text>
            </svg>
            {/* EasyPaisa */}
            <span className="flex h-6 w-10 items-center justify-center rounded bg-[#1d7d3a] px-1">
              <span className="text-[7px] font-bold leading-none text-white">Easy<br/>Paisa</span>
            </span>
            {/* Mastercard */}
            <svg viewBox="0 0 48 30" className="h-6 w-auto" aria-label="Mastercard">
              <circle cx="18" cy="15" r="12" fill="#EB001B" />
              <circle cx="30" cy="15" r="12" fill="#F79E1B" />
              <path d="M24 6.27a12 12 0 0 1 0 17.46A12 12 0 0 1 24 6.27z" fill="#FF5F00" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
