import { StoreFooter } from "@/components/layout/store-footer";
import { StoreHeader } from "@/components/layout/store-header";
import { AnnouncementTicker } from "@/components/layout/announcement-ticker";
import { ScrollToTop } from "@/components/motion/scroll-to-top";
import {
  getFooterLinks,
  getMainNavigation,
  getPublishedPageBySlug,
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
        <AnnouncementTicker messages={messages} />
      ) : null}
      <StoreHeader navigation={nav} />
      <main className="flex-1">{children}</main>
      <StoreFooter links={footer} />
      <ScrollToTop />
    </>
  );
}
