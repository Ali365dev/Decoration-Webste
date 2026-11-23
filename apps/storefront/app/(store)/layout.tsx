import { StoreFooter } from "@/components/layout/store-footer";
import { StickyHeader } from "@/components/layout/sticky-header";
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
  const [nav, footer] = await Promise.all([
    getMainNavigation(),
    getFooterLinks(),
  ]);

  return (
    <>
      <StickyHeader navigation={nav} />
      <main className="flex-1">{children}</main>
      <StoreFooter links={footer} />
      <ScrollToTop />
    </>
  );
}
