"use client";

import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export function NewsletterSignup({
  eyebrow,
  heading,
  subtitle,
  placeholder,
  ctaLabel,
}: {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  placeholder?: string;
  ctaLabel?: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-ink px-4 py-16 text-white sm:px-6 md:px-8 md:py-20 lg:px-12">
      <div className="mx-auto max-w-[720px] text-center">
        {eyebrow ? (
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.2]">
          {heading}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[26px] text-white/70">
            {subtitle}
          </p>
        ) : null}

        {submitted ? (
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.1em] text-[#f05e2d]">
            Thanks for subscribing!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail
                size={16}
                strokeWidth={1.8}
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={placeholder ?? "Enter your email address"}
                className="h-12 w-full rounded-pill border border-white/20 bg-white/5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-pill bg-white px-7 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:bg-[#f05e2d] hover:text-white"
            >
              {ctaLabel ?? "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
