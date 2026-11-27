import { StoreFooter } from "@/components/layout/store-footer";
import { StickyHeader } from "@/components/layout/sticky-header";
import { ScrollToTop } from "@/components/motion/scroll-to-top";
import {
  getFooterLinks,
  getMainNavigation,
  getSiteContact,
} from "@dec-walls/domain/cms";

// Header and footer content comes from the dashboard; saves refresh it at once, this is the safety net.
export const revalidate = 300;

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nav, footer, contact] = await Promise.all([
    getMainNavigation(),
    getFooterLinks(),
    getSiteContact(),
  ]);

  return (
    <>
      <StickyHeader navigation={nav} />
      <main className="flex-1">{children}</main>
      <StoreFooter links={footer} contact={contact} />
      <ScrollToTop />
    </>
  );
}
