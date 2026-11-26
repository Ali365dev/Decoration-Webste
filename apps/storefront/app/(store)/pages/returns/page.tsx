import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal-page";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { POLICIES } from "@/lib/site-content";

const page = POLICIES.returns;

export const metadata: Metadata = buildPageMetadata({
  title: page.title,
  description: page.intro,
  path: "/pages/returns",
});

export default function ReturnsPage() {
  return <LegalPage page={page} />;
}
