"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "@/lib/site-content";

/**
 * Grouped FAQ accordion. One item open per group; the toggle icon rotates
 * rather than swapping glyphs, and the answer height is left to the browser
 * (no animated height) so it never janks on a long answer.
 */
export function FaqAccordion() {
  const [open, setOpen] = useState<string | null>("0-0");

  return (
    <div className="space-y-14">
      {FAQS.map((group, groupIndex) => (
        <section key={group.category}>
          <h2 className="mb-6 text-[13px] font-semibold uppercase tracking-[0.16em] text-grey">
            {group.category}
          </h2>
          <div className="divide-y divide-line-soft border-y border-line-soft">
            {group.items.map((item, itemIndex) => {
              const id = `${groupIndex}-${itemIndex}`;
              const isOpen = open === id;
              return (
                <div key={id}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : id)}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[#f05e2d]"
                    >
                      <span className="text-[16px] font-medium leading-snug text-ink">
                        {item.q}
                      </span>
                      <Plus
                        size={18}
                        strokeWidth={1.5}
                        className={`shrink-0 text-body transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  {isOpen ? (
                    <p className="max-w-[620px] pb-6 text-[15px] leading-[1.8] text-body">
                      {item.a}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
