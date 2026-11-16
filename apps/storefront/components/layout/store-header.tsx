"use client";

import type { NavItemDto } from "@dec-walls/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

function formatPrice(amount: number) {
  return `Rs.${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M11.9 11.731C11.8 11.731 11.8 11.731 11.9 11.731C11.8 11.8304 11.8 11.8304 11.8 11.8304C11.3 12.3275 10.7 12.7251 9.9 13.0234C9.2 13.3216 8.4 13.4211 7.6 13.4211C6.8 13.4211 6 13.2222 5.3 12.924C4.6 12.6257 4 12.2281 3.4 11.6316C2.9 11.1345 2.4 10.4386 2.1 9.74269C1.8 9.1462 1.7 8.45029 1.7 7.65497C1.7 6.85965 1.9 6.06433 2.2 5.36842C2.5 4.5731 2.9 3.97661 3.4 3.38012C4 2.88304 4.6 2.48538 5.3 2.18713C6 1.88889 6.8 1.69006 7.6 1.69006C8.4 1.69006 9.2 1.88889 9.9 2.18713C10.6 2.48538 11.3 2.88304 11.8 3.47953C12.3 3.97661 12.7 4.67251 13.1 5.36842C13.4 6.06433 13.6 6.76023 13.6 7.65497C13.6 8.45029 13.4 9.24561 13.1 9.94152C12.8 10.538 12.4 11.1345 11.9 11.731ZM16.7 15.4094L13.6 12.3275C14.1 11.6316 14.5 10.9357 14.8 10.1404C15.1 9.34503 15.2 8.45029 15.2 7.55556C15.2 6.46199 15 5.46784 14.6 4.5731C14.2 3.67836 13.7 2.88304 13 2.18713C12.3 1.49123 11.5 0.994152 10.6 0.596491C9.7 0.19883 8.7 0 7.6 0C6.6 0 5.6 0.19883 4.6 0.596491C3.7 0.994152 2.9 1.49123 2.2 2.18713C1.5 2.88304 1 3.67836 0.6 4.67251C0.2 5.56725 0 6.5614 0 7.65497C0 8.64912 0.2 9.64327 0.6 10.6374C1 11.5322 1.6 12.3275 2.3 13.0234C3 13.7193 3.8 14.2164 4.7 14.7134C5.6 15.0117 6.6 15.2105 7.6 15.2105C8.5 15.2105 9.4 15.1111 10.2 14.8129C11 14.5146 11.8 14.117 12.4 13.6199L15.5 16.7018C15.7 16.9006 15.9 17 16.1 17C16.3 17 16.5 16.9006 16.7 16.7018C16.9 16.5029 17 16.3041 17 16.1053C17 15.807 16.9 15.6082 16.7 15.4094Z" />
    </svg>
  );
}

function IconAccount({ className }: { className?: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M16.8927 15.7682C16.0329 14.3137 14.8061 13.1078 13.3338 12.27C11.8614 11.4322 10.1946 10.9914 8.49845 10.9914C6.80225 10.9914 5.13546 11.4322 3.66314 12.27C2.19082 13.1078 0.964024 14.3137 0.104236 15.7682C-0.00102398 15.9568 -0.027822 16.179 0.0295835 16.387C0.0566587 16.493 0.106188 16.592 0.174854 16.6774C0.243521 16.7627 0.329737 16.8325 0.427728 16.8821C0.554141 16.9534 0.697158 16.9903 0.842462 16.9894C0.986554 16.9954 1.12952 16.9616 1.25545 16.8917C1.38138 16.8218 1.48536 16.7185 1.5558 16.5933C2.26752 15.3886 3.2833 14.3898 4.50251 13.6958C5.72172 13.0018 7.10204 12.6367 8.50674 12.6367C9.91144 12.6367 11.2918 13.0018 12.511 13.6958C13.7302 14.3898 14.746 15.3886 15.4577 16.5933C15.5685 16.7806 15.7491 16.9169 15.9603 16.9725C16.1715 17.0281 16.3963 16.9986 16.5858 16.8903C16.6801 16.8403 16.7628 16.7711 16.8285 16.6872C16.8943 16.6034 16.9415 16.5067 16.9673 16.4035C16.998 16.298 17.0072 16.1874 16.9944 16.0783C16.9816 15.9692 16.947 15.8638 16.8927 15.7682Z" />
      <path d="M8.49966 10.2C9.83622 10.2002 11.1195 9.67091 12.0732 8.72594C13.027 7.78097 13.5752 6.49588 13.5997 5.14718C13.5997 3.78206 13.0623 2.47286 12.1059 1.50757C11.1495 0.542291 9.85226 0 8.49966 0C7.14705 0 5.84985 0.542291 4.89341 1.50757C3.93698 2.47286 3.39966 3.78206 3.39966 5.14718C3.42416 6.49588 3.97228 7.78097 4.92607 8.72594C5.87987 9.67091 7.1631 10.2002 8.49966 10.2ZM5.09966 5.14718C5.09966 4.2371 5.45787 3.3643 6.09549 2.72078C6.73312 2.07725 7.59792 1.71573 8.49966 1.71573C9.40139 1.71573 10.2662 2.07725 10.9038 2.72078C11.5414 3.3643 11.8997 4.2371 11.8997 5.14718C11.8997 6.05726 11.5414 6.93006 10.9038 7.57359C10.2662 8.21711 9.40139 8.57864 8.49966 8.57864C7.59792 8.57864 6.73312 8.21711 6.09549 7.57359C5.45787 6.93006 5.09966 6.05726 5.09966 5.14718Z" />
    </svg>
  );
}

function IconWishlist({ className }: { className?: string }) {
  return (
    <svg
      width="21"
      height="17"
      viewBox="0 0 14 13"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M11.7441 2.26562C11.9993 2.52083 12.1908 2.8125 12.3184 3.14062C12.446 3.45964 12.5098 3.78776 12.5098 4.125C12.5098 4.46224 12.446 4.79492 12.3184 5.12305C12.1908 5.44206 11.9993 5.72917 11.7441 5.98438L7 10.7285L2.25586 5.98438C2.00065 5.72917 1.80924 5.44206 1.68164 5.12305C1.55404 4.79492 1.49023 4.46224 1.49023 4.125C1.49023 3.78776 1.55404 3.45964 1.68164 3.14062C1.80924 2.8125 2.00065 2.52083 2.25586 2.26562C2.51107 2.01042 2.79818 1.81901 3.11719 1.69141C3.44531 1.5638 3.77799 1.5 4.11523 1.5C4.45247 1.5 4.7806 1.5638 5.09961 1.69141C5.41862 1.81901 5.71029 2.01042 5.97461 2.26562L6.58984 2.88086C6.69922 2.99935 6.83594 3.05859 7 3.05859C7.16406 3.05859 7.30078 2.99935 7.41016 2.88086L8.02539 2.26562C8.28971 2.01042 8.58138 1.81901 8.90039 1.69141C9.2194 1.5638 9.54753 1.5 9.88477 1.5C10.222 1.5 10.5501 1.5638 10.8691 1.69141C11.1973 1.81901 11.4889 2.01042 11.7441 2.26562ZM12.5645 1.44531C12.1999 1.07161 11.7806 0.79362 11.3066 0.611328C10.8418 0.429036 10.3678 0.337891 9.88477 0.337891C9.40169 0.337891 8.92773 0.429036 8.46289 0.611328C7.99805 0.79362 7.57878 1.07161 7.20508 1.44531L7 1.65039L6.79492 1.44531C6.42122 1.07161 6.00195 0.79362 5.53711 0.611328C5.07227 0.429036 4.59831 0.337891 4.11523 0.337891C3.63216 0.337891 3.15365 0.429036 2.67969 0.611328C2.21484 0.79362 1.80013 1.07161 1.43555 1.44531C1.06185 1.8099 0.779297 2.22917 0.587891 2.70312C0.405599 3.16797 0.314453 3.64193 0.314453 4.125C0.314453 4.60807 0.405599 5.08659 0.587891 5.56055C0.779297 6.02539 1.06185 6.4401 1.43555 6.80469L6.58984 11.959C6.69922 12.0775 6.83594 12.1367 7 12.1367C7.16406 12.1367 7.30078 12.0775 7.41016 11.959L12.5645 6.80469C12.9382 6.4401 13.2161 6.02539 13.3984 5.56055C13.5898 5.08659 13.6855 4.60807 13.6855 4.125C13.6855 3.64193 13.5898 3.16797 13.3984 2.70312C13.2161 2.23828 12.9382 1.81901 12.5645 1.44531Z" />
    </svg>
  );
}

function IconCart({ className }: { className?: string }) {
  return (
    <svg
      width="21"
      height="17"
      viewBox="0 0 21 17"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M14.3699 15.3407C14.1509 15.3407 13.941 15.2535 13.7862 15.0982C13.6314 14.943 13.5444 14.7324 13.5444 14.5128H11.8936C11.8936 15.1715 12.1545 15.8032 12.6189 16.269C13.0832 16.7347 13.7131 16.9964 14.3699 16.9964C15.0266 16.9964 15.6565 16.7347 16.1209 16.269C16.5853 15.8032 16.8462 15.1715 16.8462 14.5128H15.1953C15.1953 14.7324 15.1083 14.943 14.9535 15.0982C14.7987 15.2535 14.5888 15.3407 14.3699 15.3407Z" />
      <path d="M8.5612 15.3407C8.34228 15.3407 8.13233 15.2535 7.97753 15.0982C7.82273 14.943 7.73576 14.7324 7.73576 14.5128H6.07715C6.07715 14.8395 6.14129 15.1629 6.26592 15.4646C6.39055 15.7664 6.57322 16.0406 6.8035 16.2715C7.03378 16.5025 7.30717 16.6857 7.60805 16.8107C7.90893 16.9357 8.23141 17 8.55707 17C8.88274 17 9.20522 16.9357 9.5061 16.8107C9.80698 16.6857 10.0804 16.5025 10.3106 16.2715C10.5409 16.0406 10.7236 15.7664 10.8482 15.4646C10.9729 15.1629 11.037 14.8395 11.037 14.5128H9.38612C9.38612 14.7323 9.29923 14.9428 9.14454 15.098C8.98985 15.2533 8.78003 15.3406 8.5612 15.3407Z" />
      <path d="M19.3299 1.64401C19.2849 1.63633 19.2393 1.63252 19.1937 1.63263H5.9867C5.76778 1.63263 5.55782 1.71985 5.40302 1.8751C5.24823 2.03035 5.16126 2.24092 5.16126 2.46047C5.16126 2.68003 5.24823 2.8906 5.40302 3.04585C5.55782 3.2011 5.76778 3.28832 5.9867 3.28832H18.2192L18.001 4.60149L16.8438 11.5668H6.07595L3.26946 4.60149L1.59537 0.482961C1.50684 0.289212 1.34721 0.13717 1.14972 0.0584856C0.952225 -0.020199 0.732083 -0.0194636 0.535118 0.0605389C0.338153 0.140541 0.179541 0.293646 0.0922992 0.487983C0.00505767 0.682319 -0.00409102 0.902913 0.0667575 1.10384L2.73963 7.68158L4.56385 12.5307C4.6985 12.9389 4.97657 13.2224 5.37794 13.2224H17.5428C17.7383 13.2225 17.9275 13.1531 18.0766 13.0264C18.2258 12.8997 18.3253 12.724 18.3574 12.5307L19.675 4.60149L20.0083 2.59655C20.0443 2.38002 19.993 2.15803 19.8658 1.9794C19.7386 1.80077 19.5458 1.68013 19.3299 1.64401Z" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="14"
      viewBox="0 0 22 14"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M2 8H20C20.2812 8 20.5156 7.90625 20.7031 7.71875C20.9062 7.51562 21.0078 7.27344 21.0078 6.99219C21.0078 6.72656 20.9062 6.5 20.7031 6.3125C20.5156 6.10938 20.2812 6.00781 20 6.00781H2C1.71875 6.00781 1.47656 6.10938 1.27344 6.3125C1.08594 6.5 0.992188 6.72656 0.992188 6.99219C0.992188 7.27344 1.08594 7.51562 1.27344 7.71875C1.47656 7.90625 1.71875 8 2 8ZM2 2H20C20.2812 2 20.5156 1.90625 20.7031 1.71875C20.9062 1.51563 21.0078 1.27344 21.0078 0.992188C21.0078 0.726562 20.9062 0.5 20.7031 0.3125C20.5156 0.109375 20.2812 0.0078125 20 0.0078125H2C1.71875 0.0078125 1.47656 0.109375 1.27344 0.3125C1.08594 0.5 0.992188 0.726562 0.992188 0.992188C0.992188 1.27344 1.08594 1.51563 1.27344 1.71875C1.47656 1.90625 1.71875 2 2 2ZM2 14H20C20.2812 14 20.5156 13.9062 20.7031 13.7188C20.9062 13.5156 21.0078 13.2734 21.0078 12.9922C21.0078 12.7266 20.9062 12.5 20.7031 12.3125C20.5156 12.1094 20.2812 12.0078 20 12.0078H2C1.71875 12.0078 1.47656 12.1094 1.27344 12.3125C1.08594 12.5 0.992188 12.7266 0.992188 12.9922C0.992188 13.2734 1.08594 13.5156 1.27344 13.7188C1.47656 13.9062 1.71875 14 2 14Z" />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M1.5 1.2L6.2 6L1.5 10.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M1 1L13 13M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M0.8 0.8L4 4L7.2 0.8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CountBadge({ count }: { count?: number }) {
  if (count === undefined) return null;
  return (
    <span className="absolute -right-1.5 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#f05e2d] px-[3px] text-[9px] font-medium leading-none text-white">
      {count}
    </span>
  );
}

type MenuImageMap = Record<string, string>;

function buildMenuImageMap(navigation: NavItemDto[]) {
  const imageNumbers = Array.from({ length: 176 }, (_, index) =>
    index < 120 ? index + 2 : index + 3,
  );
  let imageIndex = 0;
  const maps: Record<string, MenuImageMap> = {};

  for (const root of navigation) {
    const rootMap: MenuImageMap = {};
    const addItem = (item: NavItemDto) => {
      const imageNumber = imageNumbers[imageIndex++ % imageNumbers.length];
      rootMap[item.id] = `/bareeze/image-${imageNumber}.jpg`;
      item.children.forEach(addItem);
    };
    root.children.forEach(addItem);
    maps[root.id] = rootMap;
  }

  return maps;
}

function MenuImageCard({
  item,
  imageUrl,
  onNavigate,
}: {
  item: NavItemDto;
  imageUrl: string;
  onNavigate: () => void;
}) {
  return (
    <article className="group/card min-w-0">
      <Link href={item.href} onClick={onNavigate} className="block">
        <div className="relative aspect-square overflow-hidden bg-canvas">
          <Image
            src={imageUrl}
            alt={item.label}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-[0.4s] ease-[ease] group-hover/card:scale-[1.03]"
          />
        </div>
        <div className="pt-3">
          <h3 className="text-[13px] font-semibold uppercase leading-snug tracking-[0.04em] text-ink transition-colors duration-[0.3s] group-hover/card:text-[#f05e2d]">
            {item.label}
          </h3>
          <p className="mt-1 text-[12px] font-normal text-body">
            Explore collection
          </p>
        </div>
      </Link>
    </article>
  );
}

function MegaPanel({
  item,
  imageMap,
  onNavigate,
}: {
  item: NavItemDto;
  imageMap: MenuImageMap;
  onNavigate: () => void;
}) {
  const [activeId, setActiveId] = useState(item.children[0]?.id ?? "");
  const [previewId, setPreviewId] = useState(item.children[0]?.id ?? "");
  const active =
    item.children.find((child) => child.id === activeId) ?? item.children[0];
  const columns = active?.children ?? [];
  const hasNested = columns.some((col) => col.children.length > 0);
  const previewItems: NavItemDto[] = [];
  const addPreviewItem = (entry: NavItemDto) => {
    previewItems.push(entry);
    entry.children.forEach(addPreviewItem);
  };
  item.children.forEach(addPreviewItem);
  const previewStart = Math.max(
    0,
    previewItems.findIndex((entry) => entry.id === previewId),
  );
  const visiblePreviews = previewItems.slice(previewStart, previewStart + 2);

  return (
    <div className="submenu-enter flex gap-12 bg-paper px-12 pb-10 pt-8 shadow-[0_5px_30px_rgba(0,0,0,0.05)]">
      <ul className="w-[200px] shrink-0">
        {item.children.map((child) => {
          const selected = child.id === active?.id;
          return (
            <li key={child.id}>
              <Link
                href={child.href}
                onMouseEnter={() => {
                  setActiveId(child.id);
                  setPreviewId(child.id);
                }}
                onFocus={() => {
                  setActiveId(child.id);
                  setPreviewId(child.id);
                }}
                onClick={onNavigate}
                className={`mega-link py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#111111] transition-colors duration-[0.35s] ease-[ease] hover:text-[#f05e2d] ${
                  selected ? "mega-link-active text-[#f05e2d]" : ""
                }`}
              >
                {child.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="min-w-0 flex-1">
        {columns.length > 0 ? (
          <div
            className="grid grid-cols-1 gap-y-5"
          >
            {columns.map((col) => (
              <div key={col.id} className="min-w-0">
                <Link
                  href={col.href}
                  onMouseEnter={() => setPreviewId(col.id)}
                  onFocus={() => setPreviewId(col.id)}
                  onClick={onNavigate}
                  className="mega-col-title whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.06em] text-[#111111] transition-colors duration-[0.35s] hover:text-[#f05e2d]"
                >
                  {col.label}
                </Link>
                {hasNested && col.children.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {col.children.map((link) => (
                      <li key={link.id}>
                        <Link
                          href={link.href}
                          onMouseEnter={() => setPreviewId(link.id)}
                          onFocus={() => setPreviewId(link.id)}
                          onClick={onNavigate}
                          className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.025em] text-body transition-colors duration-[0.35s] hover:text-[#f05e2d]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid w-[440px] shrink-0 grid-cols-2 gap-6">
        {visiblePreviews.map((previewItem) => (
          <MenuImageCard
            key={previewItem.id}
            item={previewItem}
            imageUrl={imageMap[previewItem.id] ?? "/bareeze/image-2.jpg"}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

function MobileBranch({
  item,
  onNavigate,
}: {
  item: NavItemDto;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children.length > 0;

  return (
    <li className="border-b border-line-soft">
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          className={`flex-1 py-3.5 text-base font-medium uppercase tracking-[0.02em] ${
            item.label === "SALE" ? "text-[#ff0000]" : "text-ink"
          }`}
        >
          {item.label}
        </Link>
        {hasChildren ? (
          <button
            type="button"
            aria-label={`${open ? "Collapse" : "Expand"} ${item.label}`}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center text-ink"
          >
            <IconChevron
              className={`transition-transform duration-[0.4s] ${open ? "rotate-90" : ""}`}
            />
          </button>
        ) : null}
      </div>
      {open ? (
        <ul className="pb-3 pl-3">
          {item.children.map((child) => (
            <li key={child.id}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className="block py-2 text-sm font-medium uppercase text-body"
              >
                {child.label}
              </Link>
              {child.children.length > 0 ? (
                <ul className="pb-2 pl-3">
                  {child.children.map((grand) => (
                    <li key={grand.id}>
                      <Link
                        href={grand.href}
                        onClick={onNavigate}
                        className="block py-1.5 text-[13px] uppercase text-body"
                      >
                        {grand.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function StoreHeader({
  navigation,
}: {
  navigation: NavItemDto[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  const menuImageMaps = useMemo(() => buildMenuImageMap(navigation), [navigation]);
  const openItem = navigation.find((item) => item.id === openId) ?? null;

  function showMenu(id: string | null) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenId(id);
  }

  function hideMenu() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenId(null), 160);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenId(null);
      setSearchOpen(false);
      setCartOpen(false);
      setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      setCompact(window.scrollY > 48);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closeOverlays() {
    setOpenId(null);
    setSearchOpen(false);
    setCartOpen(false);
    setMenuOpen(false);
  }

  const utility = (
    <div className="flex shrink-0 items-center gap-3 xl:gap-[12px]">
      <button
        type="button"
        aria-label="Search"
        aria-expanded={searchOpen}
        onClick={() => {
          setSearchOpen((value) => !value);
          setOpenId(null);
          setCartOpen(false);
          setMenuOpen(false);
        }}
        className="nav-icon inline-flex size-[22px] items-center justify-center text-[#111111]"
      >
        <IconSearch />
      </button>
      <Link
        href="/account"
        aria-label="Log in"
        className="nav-icon inline-flex size-[22px] items-center justify-center text-[#111111]"
      >
        <IconAccount />
      </Link>
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="nav-icon relative inline-flex size-[22px] items-center justify-center text-[#111111]"
      >
        <IconWishlist />
        <CountBadge count={0} />
      </Link>
      <button
        type="button"
        aria-label="Cart"
        aria-expanded={cartOpen}
        onClick={() => {
          setCartOpen((value) => !value);
          setSearchOpen(false);
          setOpenId(null);
          setMenuOpen(false);
        }}
        className="nav-icon relative inline-flex size-[22px] items-center justify-center text-[#111111]"
      >
        <IconCart />
        <CountBadge count={0} />
      </button>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 bg-paper transition-[box-shadow,padding] duration-[0.35s] ease-[ease] ${
        compact ? "header-compact" : ""
      }`}
    >
      <div className="relative">
        <div
          className={`flex items-center px-4 transition-[height] duration-[0.35s] ease-[ease] xl:hidden ${
            compact ? "h-[60px]" : "h-[72px]"
          }`}
        >
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((value) => !value);
              setSearchOpen(false);
              setCartOpen(false);
            }}
            className="nav-icon inline-flex size-10 items-center justify-center text-ink"
          >
            <IconMenu />
          </button>
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2"
            aria-label="Dec Walls home"
          >
            <Image
              src="/home/logo.svg"
              alt="Dec Walls"
              width={140}
              height={38}
              className={`h-auto transition-[width] duration-[0.35s] ease-[ease] ${
                compact ? "w-[120px]" : "w-[140px]"
              }`}
              priority
            />
          </Link>
          <div className="ml-auto">{utility}</div>
        </div>

        <div
          className={`header-desktop relative hidden transition-[padding] duration-[0.35s] ease-[ease] xl:block ${
            compact ? "py-[6px]" : "py-[11px]"
          }`}
        >
          <div
            className={`header-utility absolute right-[25px] z-10 transition-[top] duration-[0.35s] ease-[ease] ${
              compact ? "top-[18px]" : "top-[35px]"
            }`}
          >
            {utility}
          </div>
          <div
            className={`header-logo-wrap flex justify-center transition-[padding] duration-[0.35s] ease-[ease] ${
              compact ? "pb-[4px]" : "pb-[10px]"
            }`}
          >
            <Link href="/" className="inline-flex" aria-label="Dec Walls home">
              <Image
                src="/home/logo.svg"
                alt="Dec Walls"
                width={200}
                height={54}
                className={`header-logo h-auto transition-[width] duration-[0.35s] ease-[ease] ${
                  compact ? "w-[140px]" : "w-[200px]"
                }`}
                priority
              />
            </Link>
          </div>
          <nav className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-center gap-x-1 px-3" aria-label="Primary">
            {navigation.map((item) => {
              const hasMenu = item.children.length > 0;
              const sale = item.label === "SALE";
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    if (hasMenu) showMenu(item.id);
                    else showMenu(null);
                  }}
                  onMouseLeave={hideMenu}
                >
                  <Link
                    href={item.href}
                    aria-expanded={hasMenu ? isOpen : undefined}
                    aria-haspopup={hasMenu ? "true" : undefined}
                    className={`nav-link inline-flex items-center whitespace-nowrap px-[clamp(7px,0.72vw,15px)] py-[10px] font-sans text-[clamp(11px,0.85vw,14px)] leading-[17px] tracking-normal uppercase text-[#111111] transition-colors duration-[0.4s] ease-[ease] hover:text-[#f05e2d] ${
                      item.id === "home" ? "font-semibold" : "font-medium"
                    } ${sale ? "text-[#f05e2d]" : ""} ${
                      isOpen ? "text-[#f05e2d]" : ""
                    }`}
                    onClick={() => showMenu(null)}
                  >
                    {item.label}
                    {hasMenu ? (
                      <IconChevronDown className="ml-px opacity-50" />
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {openItem && openItem.children.length > 0 ? (
          <div
            className="absolute left-1/2 top-[calc(100%-var(--header-padding))] z-50 hidden w-[1200px] max-w-[calc(100vw-3rem)] -translate-x-1/2 before:absolute before:inset-x-0 before:-top-3 before:h-3 xl:block"
            onMouseEnter={() => showMenu(openItem.id)}
            onMouseLeave={hideMenu}
          >
            <MegaPanel
              key={openItem.id}
              item={openItem}
              imageMap={menuImageMaps[openItem.id] ?? {}}
              onNavigate={() => setOpenId(null)}
            />
          </div>
        ) : null}
      </div>

      {searchOpen ? (
        <div className="border-t border-line-soft bg-paper">
          <form
            action="/search"
            className="mx-auto flex max-w-[1260px] items-center gap-3 px-[15px] py-5 xl:px-12"
          >
            <input
              name="q"
              autoFocus
              aria-label="I'm looking for…"
              placeholder="I'm looking for…"
              className="h-[50px] w-full rounded-pill border border-line-soft bg-paper px-5 text-sm text-body outline-none placeholder:text-placeholder"
            />
            <button
              type="submit"
              aria-label="Search"
              className="inline-flex size-[50px] shrink-0 items-center justify-center rounded-full bg-ink text-white"
            >
              <IconSearch />
            </button>
          </form>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="max-h-[calc(100vh-88px)] overflow-y-auto border-t border-line-soft bg-paper xl:hidden">
          <p className="border-b border-line-soft px-[15px] py-4 text-base font-semibold">
            Menu
          </p>
          <ul className="px-[15px]">
            {navigation.map((item) => (
              <MobileBranch
                key={item.id}
                item={item}
                onNavigate={() => setMenuOpen(false)}
              />
            ))}
          </ul>
        </div>
      ) : null}

      {cartOpen ? (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 bg-black/50"
            onClick={() => setCartOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-paper shadow-[0_5px_30px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-line-soft px-6 py-5">
              <h2 className="text-base font-medium uppercase tracking-[0.04em]">
                Cart
              </h2>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
                className="inline-flex size-10 items-center justify-center text-ink"
              >
                <IconClose />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-body">
              Your cart is empty
            </div>
            <div className="border-t border-line-soft px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="font-medium uppercase text-ink">Subtotal</span>
                <span className="text-body">{formatPrice(0)}</span>
              </div>
              <Link
                href="/cart"
                onClick={closeOverlays}
                className="mb-3 flex h-12 items-center justify-center rounded-pill border border-line text-[12px] font-medium uppercase tracking-[0.04em] text-ink"
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeOverlays}
                className="flex h-12 items-center justify-center rounded-pill bg-ink text-[12px] font-medium uppercase tracking-[0.04em] text-white"
              >
                Checkout
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
