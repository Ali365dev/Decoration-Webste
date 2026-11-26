import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { POLICIES } from "@/lib/site-content";

const page = POLICIES.privacy;

export const metadata: Metadata = buildPageMetadata({
  title: page.title,
  description: page.intro,
  path: "/pages/privacy",
});

export default function PrivacyPage() {
  return <LegalPage page={page} />;
}
