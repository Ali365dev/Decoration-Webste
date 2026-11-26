"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const STEPS = [
  { label: "Order placed", note: "We have your order and payment" },
  { label: "Packed", note: "Folded, wrapped and labelled in the workshop" },
  { label: "Shipped", note: "Handed to the courier" },
  { label: "Out for delivery", note: "On the van for your address" },
  { label: "Delivered", note: "Signed for at the door" },
];

const fieldClass =
  "w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-placeholder focus:border-ink";

/**
 * Order tracking. No order service is wired up yet, so a valid-looking lookup
 * returns an illustrative timeline (currently "Shipped") rather than a real
 * status. The form and validation are real; the result is a placeholder.
 */
export function TrackOrderForm() {
  const [tracked, setTracked] = useState<string | null>(null);
  const currentStep = 2; // "Shipped"

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setTracked(String(data.get("order") || "").trim() || "DW-00000");
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <form onSubmit={onSubmit} className="max-w-md space-y-5">
        <div>
          <label htmlFor="track-order" className="mb-2 block text-[13px] font-medium text-ink">
            Order number
          </label>
          <input id="track-order" name="order" required className={fieldClass} placeholder="DW-10482" />
        </div>
        <div>
          <label htmlFor="track-email" className="mb-2 block text-[13px] font-medium text-ink">
            Email
          </label>
          <input
            id="track-email"
            name="email"
            type="email"
            required
            className={fieldClass}
            placeholder="you@email.com"
          />
        </div>
        <button
          type="submit"
          className="rounded-pill bg-ink px-8 py-3 text-[12px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#f05e2d]"
        >
          Track order
        </button>
        <p className="text-[12px] leading-relaxed text-grey">
          Your order number is in the confirmation email and SMS we sent when you ordered.
        </p>
      </form>

      <div className="rounded-[18px] border border-line-soft bg-canvas p-7 md:p-9">
        {tracked ? (
          <>
            <div className="mb-7 flex items-baseline justify-between gap-4">
              <p className="text-[13px] uppercase tracking-[0.12em] text-grey">Order</p>
              <p className="font-mono text-[14px] text-ink">{tracked}</p>
            </div>
            <ol className="relative">
              {STEPS.map((step, index) => {
                const done = index < currentStep;
                const active = index === currentStep;
                return (
                  <li key={step.label} className="flex gap-4 pb-7 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <span
                        className={`flex size-6 items-center justify-center rounded-full border ${
                          done || active
                            ? "border-[#f05e2d] bg-[#f05e2d] text-white"
                            : "border-line bg-paper text-transparent"
                        }`}
                      >
                        {done ? <Check size={13} strokeWidth={2.5} /> : null}
                      </span>
                      {index < STEPS.length - 1 ? (
                        <span
                          className={`mt-1 w-px flex-1 ${done ? "bg-[#f05e2d]" : "bg-line"}`}
                          aria-hidden
                        />
                      ) : null}
                    </div>
                    <div className="pb-1">
                      <p className={`text-[15px] ${done || active ? "text-ink" : "text-grey"}`}>
                        {step.label}
                        {active ? (
                          <span className="ml-2 text-[12px] font-medium uppercase tracking-wide text-[#f05e2d]">
                            Now
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-body">{step.note}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        ) : (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
            <p className="max-w-[240px] text-[14px] leading-relaxed text-body">
              Enter your order number to see where your parcel is on its way to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
