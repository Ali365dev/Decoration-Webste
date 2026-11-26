import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { POLICIES } from "@/lib/site-content";

const page = POLICIES.terms;

export const metadata: Metadata = buildPageMetadata({
  title: page.title,
  description: page.intro,
  path: "/pages/terms",
});

export default function TermsPage() {
  return <LegalPage page={page} />;
}
