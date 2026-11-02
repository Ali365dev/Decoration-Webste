import { StoreFooter } from "@/components/layout/store-footer";
import { StoreHeader } from "@/components/layout/store-header";
import {
  getFooterLinks,
  getMainNavigation,
  getPublishedPageBySlug,
  homeProducts,
} from "@dec-walls/domain/cms";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nav, footer, home] = await Promise.all([
    getMainNavigation(),
    getFooterLinks(),
    getPublishedPageBySlug("home"),
  ]);

  const announcement = home?.blocks.find((b) => b.type === "announcement");
  const messages =
    (announcement?.data.messages as string[] | undefined) ??
    (announcement?.data.text
      ? [String(announcement.data.text)]
      : []);

  return (
    <>
      {messages.length > 0 ? (
        <div className="overflow-hidden bg-[var(--announcement-bar-bg)] text-[var(--announcement-bar-color)]">
          <div className="announcement-ticker flex whitespace-nowrap py-2 text-[length:var(--announcement-bar-font-size)] font-medium uppercase tracking-[0.08em]">
            {[...messages, ...messages].map((msg, i) => (
              <span key={i} className="mx-8 inline-block">
                {msg}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <StoreHeader navigation={nav} products={homeProducts} />
      <main className="flex-1">{children}</main>
      <StoreFooter links={footer} />
    </>
  );
}
