"use client";

import { useState } from "react";

type Status = "idle" | "sent";

const fieldClass =
  "w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-placeholder focus:border-ink";

const labelClass = "mb-2 block text-[13px] font-medium text-ink";

/**
 * Contact form. There is no mail backend wired up yet, so submit confirms
 * optimistically and resets — the fields and validation are real, the send is
 * a placeholder until an endpoint exists.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sent");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input id="contact-name" name="name" required className={fieldClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            className={fieldClass}
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject
        </label>
        <input id="contact-subject" name="subject" className={fieldClass} placeholder="Order, product or something else" />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder="How can we help?"
          onChange={() => status === "sent" && setStatus("idle")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          className="rounded-pill bg-ink px-8 py-3 text-[12px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#f05e2d]"
        >
          Send message
        </button>
        {status === "sent" ? (
          <p role="status" className="text-[13px] text-body">
            Thanks — we have your message and will reply within one working day.
          </p>
        ) : null}
      </div>
    </form>
  );
}
