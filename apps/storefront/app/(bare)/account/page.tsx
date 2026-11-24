import { AccountExperience } from "@/components/account/account-experience";
import { StoreFooter } from "@/components/layout/store-footer";
import { StickyHeader } from "@/components/layout/sticky-header";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getFooterLinks, getMainNavigation } from "@dec-walls/domain/cms";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Account",
  description: "Sign in or create an account to track orders and save your favourite pieces.",
  path: "/account",
});

export default async function AccountPage() {
  const [nav, footer] = await Promise.all([getMainNavigation(), getFooterLinks()]);

  return (
    <>
      <StickyHeader navigation={nav} />
      <div className="container-page">
        <AccountExperience />
      </div>
      <StoreFooter links={footer} />
    </>
  );
}
