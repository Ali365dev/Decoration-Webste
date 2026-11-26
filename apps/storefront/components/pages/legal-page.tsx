import { PageHero } from "@/components/pages/page-hero";
import type { PolicyPage } from "@/lib/site-content";

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Policy / legal layout: the hero, then a quiet two-column body with a sticky
 * section index on the left and readable prose on a narrow measure to the
 * right. No accent beyond the hero — long-form legal copy stays calm.
 */
export function LegalPage({ page }: { page: PolicyPage }) {
  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        meta={page.updated}
        image={page.image}
        imageAlt=""
      />

      <section className="bg-paper pb-20 md:pb-28">
        <div className="container-page grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <nav className="sticky top-[180px]" aria-label="On this page">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-grey">
                On this page
              </p>
              <ul className="space-y-3">
                {page.sections.map((section) => (
                  <li key={section.heading}>
                    <a
                      href={`#${sectionId(section.heading)}`}
                      className="text-[13px] leading-snug text-body transition-colors hover:text-ink"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="max-w-[640px]">
            {page.sections.map((section) => (
              <section
                key={section.heading}
                id={sectionId(section.heading)}
                className="scroll-mt-[160px] border-t border-line-soft py-9 first:border-t-0 first:pt-0"
              >
                <h2 className="text-[20px] font-medium leading-snug text-ink">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-[15px] leading-[1.8] text-body"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
