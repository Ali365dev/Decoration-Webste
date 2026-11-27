import { AccountExperience } from "@/components/account/account-experience";
import { ACCOUNT_TABS, AccountDashboard, type AccountTab } from "@/components/account/account-dashboard";
import { StoreFooter } from "@/components/layout/store-footer";
import { StickyHeader } from "@/components/layout/sticky-header";
import { loadAccount } from "@/lib/account-data";
import { getSignedInUser } from "@/lib/customer-session";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getFooterLinks, getMainNavigation, getSiteContact } from "@dec-walls/domain/cms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Account",
    description: "Sign in or create an account to track orders and save your favourite pieces.",
    path: "/account",
  }),
  robots: { index: false, follow: false },
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const [nav, footer, contact, user, params] = await Promise.all([
    getMainNavigation(),
    getFooterLinks(),
    getSiteContact(),
    getSignedInUser().catch(() => null),
    searchParams,
  ]);
  const data = user ? await loadAccount(user) : null;
  const requested = typeof params.tab === "string" ? params.tab : "orders";
  const tab: AccountTab = (ACCOUNT_TABS as string[]).includes(requested) ? (requested as AccountTab) : "orders";

  return (
    <>
      <StickyHeader navigation={nav} />
      <div className="container-page">
        {data ? <AccountDashboard data={data} tab={tab} /> : <AccountExperience />}
      </div>
      <StoreFooter links={footer} contact={contact} />
    </>
  );
}
