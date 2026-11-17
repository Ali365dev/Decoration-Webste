"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { ArrowUp, Mail, Send } from "lucide-react";

type FooterLinks = {
  customerCare: { label: string; href: string }[];
  information: { label: string; href: string }[];
  policies: { label: string; href: string }[];
};

const MENU_LINKS = [
  { label: "Track Your Order", href: "/pages/track-order" },
  { label: "Search", href: "/search" },
  { label: "About Us", href: "/pages/about" },
  { label: "Contact", href: "/pages/contact" },
  { label: "Return Policy", href: "/pages/returns" },
  { label: "Privacy Policy", href: "/pages/privacy" },
  { label: "Terms of Services", href: "/pages/terms" },
];

const SEARCH_LINKS = [
  { label: "Canvas & Wall Art", href: "/collections/canvas-and-wall-art" },
  { label: "Cushions & Throws", href: "/collections/new-in" },
  { label: "Bedding", href: "/collections/bedding" },
  { label: "Curtains & Blinds", href: "/collections/curtains-and-blinds" },
  { label: "Prayer Mats", href: "/collections/new-in" },
  { label: "Table Linen", href: "/collections/new-in" },
  { label: "Home Decor", href: "/collections/home-decor" },
  { label: "Gift Items", href: "/collections/new-in" },
];

const ABOUT_TEXT =
  "Dec Walls is a one stop shop for home decor. We're on a mission to enhance every space with our top-notch Islamic and decorative items. Explore simplicity, style, and perfection with us!";

const SOCIAL: { label: string; href: string; svg: React.ReactNode }[] = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.53V6.77a4.84 4.84 0 0 1-1.02-.08z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
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

export function StoreFooter({ links: _links }: { links: FooterLinks }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <footer className="bg-[#111] text-white">
      {/* Main grid */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-8 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-12">

        {/* Col 1 — Menu */}
        <div>
          <h3 className="mb-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#c9942a]">
            Menu
          </h3>
          <ul className="space-y-3">
            {MENU_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13.5px] font-normal text-white/75 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2 — Search Product */}
        <div>
          <h3 className="mb-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#c9942a]">
            Search Product
          </h3>
          <ul className="space-y-3">
            {SEARCH_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13.5px] font-normal text-white/75 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — About us */}
        <div>
          <h3 className="mb-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#c9942a]">
            About us
          </h3>
          <p className="mb-6 text-[13.5px] leading-[1.75] text-white/75">{ABOUT_TEXT}</p>
          <div className="flex items-center gap-4">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-white/70 transition-colors duration-200 hover:text-white"
              >
                {s.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Col 4 — Newsletter */}
        <div>
          <h3 className="mb-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#c9942a]">
            Newsletter
          </h3>
          {submitted ? (
            <p className="text-sm text-white/70">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center border border-white/20 bg-white/5">
              <span className="flex h-12 w-10 shrink-0 items-center justify-center text-white/40">
                <Mail size={15} strokeWidth={1.8} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 flex-1 bg-transparent text-[13px] text-white placeholder-white/40 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-12 w-11 shrink-0 items-center justify-center bg-[#c9942a] text-white transition-opacity hover:opacity-90"
              >
                <Send size={14} strokeWidth={2} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5 lg:px-12">
          <p className="text-[12px] text-white/50">
            © {new Date().getFullYear()} , Dec Walls
          </p>

          {/* Payment icons */}
          <div className="flex items-center gap-2">
            {/* Mastercard */}
            <span className="flex h-7 w-11 items-center justify-center rounded bg-[#1a1a1a] px-1">
              <svg viewBox="0 0 48 30" className="h-5 w-auto" aria-label="Mastercard">
                <circle cx="18" cy="15" r="12" fill="#EB001B" />
                <circle cx="30" cy="15" r="12" fill="#F79E1B" />
                <path d="M24 6.27a12 12 0 0 1 0 17.46A12 12 0 0 1 24 6.27z" fill="#FF5F00" />
              </svg>
            </span>
            {/* EasyPaisa */}
            <span className="flex h-7 w-11 items-center justify-center rounded bg-[#1d7d3a] px-1">
              <span className="text-[8px] font-bold leading-none text-white">Easy<br/>Paisa</span>
            </span>
            {/* Visa */}
            <span className="flex h-7 w-11 items-center justify-center rounded bg-[#1a1f71] px-1">
              <svg viewBox="0 0 48 16" className="h-4 w-auto" aria-label="Visa">
                <text x="2" y="13" fill="#fff" fontSize="14" fontWeight="700" fontFamily="Arial">VISA</text>
              </svg>
            </span>
            {/* Mastercard 2 */}
            <span className="flex h-7 w-11 items-center justify-center rounded bg-[#1a1a1a] px-1">
              <svg viewBox="0 0 48 30" className="h-5 w-auto" aria-label="Mastercard">
                <circle cx="18" cy="15" r="12" fill="#EB001B" />
                <circle cx="30" cy="15" r="12" fill="#F79E1B" />
                <path d="M24 6.27a12 12 0 0 1 0 17.46A12 12 0 0 1 24 6.27z" fill="#FF5F00" />
              </svg>
            </span>
          </div>

          {/* Scroll to top */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-8 w-8 items-center justify-center border border-white/20 text-white/60 transition-all duration-200 hover:border-white/60 hover:text-white"
          >
            <ArrowUp size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </footer>
  );
}
