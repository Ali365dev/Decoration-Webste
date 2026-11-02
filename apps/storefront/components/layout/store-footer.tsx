import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "@dec-walls/ui";

type FooterLinks = {
  customerCare: { label: string; href: string }[];
  information: { label: string; href: string }[];
  policies: { label: string; href: string }[];
};

export function StoreFooter({ links }: { links: FooterLinks }) {
  return (
    <footer className="mt-auto border-t border-line-soft bg-paper">
      <div className="flex justify-center px-[var(--space-15)] py-[60px]">
        <Link href="/" aria-label="Dec Walls home">
          <Image
            src="/home/logo.svg"
            alt="Dec Walls"
            width={280}
            height={75}
            className="h-auto w-[220px] md:w-[280px]"
          />
        </Link>
      </div>
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div>
          <h3 className="mb-5 text-[15px] font-medium text-ink">Customer Care</h3>
          <ul className="space-y-2.5">
            {links.customerCare.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-body hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-5 text-[15px] font-medium text-ink">Information</h3>
          <ul className="space-y-2.5">
            {links.information.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-body hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-5 text-[15px] font-medium text-ink">Policies</h3>
          <ul className="space-y-2.5">
            {links.policies.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-body hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-5 text-[15px] font-medium text-ink">
            Sign Up to Newsletter
          </h3>
          <form className="flex flex-col gap-3">
            <Input type="email" name="email" placeholder="Enter your email" />
            <Button variant="primary" type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t border-line-soft py-5 text-center text-xs text-body">
        © {new Date().getFullYear()} Dec Walls. All Rights Reserved
      </div>
    </footer>
  );
}
