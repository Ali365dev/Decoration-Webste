import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Dec Walls Ops",
    template: "%s | Dec Walls Ops",
  },
  description: "Admin and CMS for Dec Walls",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas font-sans text-ink">
        <div className="flex min-h-full">
          <aside className="hidden w-64 shrink-0 border-r border-line-soft bg-paper p-6 md:block">
            <Link href="/dashboard" className="mb-8 block text-base font-medium">
              Dec Walls Ops
            </Link>
            <nav className="space-y-6 text-sm">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-body">
                  Admin
                </p>
                <ul className="space-y-2">
                  <li><Link href="/dashboard">Dashboard</Link></li>
                  <li><Link href="/products">Products</Link></li>
                  <li><Link href="/orders">Orders</Link></li>
                  <li><Link href="/customers">Customers</Link></li>
                  <li><Link href="/inventory">Inventory</Link></li>
                  <li><Link href="/media">Media</Link></li>
                  <li><Link href="/users">Users</Link></li>
                  <li><Link href="/settings">Settings</Link></li>
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-body">
                  CMS
                </p>
                <ul className="space-y-2">
                  <li><Link href="/cms/pages">Pages</Link></li>
                  <li><Link href="/cms/navigation">Navigation</Link></li>
                  <li><Link href="/cms/banners">Banners</Link></li>
                  <li><Link href="/cms/seo">SEO</Link></li>
                </ul>
              </div>
            </nav>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="border-b border-line-soft bg-paper px-6 py-4 md:px-10">
              <p className="text-sm text-body">Internal operations</p>
            </header>
            <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
