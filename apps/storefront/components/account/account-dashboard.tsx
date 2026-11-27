import { ChevronDown, Heart, MapPin, Package, UserRound } from "lucide-react";
import Link from "next/link";
import type { AccountData, AccountOrder } from "@/lib/account-data";
import { PasswordForm, ProfileForm, SignOutButton } from "./account-dashboard-client";
import styles from "./dashboard.module.css";

export type AccountTab = "orders" | "wishlist" | "addresses" | "profile";
export const ACCOUNT_TABS: AccountTab[] = ["orders", "wishlist", "addresses", "profile"];

const money = (amount: number, currency = "PKR") => {
  const formatted = amount.toLocaleString("en-PK", { maximumFractionDigits: 0 });
  return currency === "PKR" ? `Rs.${formatted}` : `${currency} ${formatted}`;
};

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Karachi" });

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Asia/Karachi" });

const RAIL = ["Placed", "Confirmed", "Shipped", "Delivered"] as const;

/** Where an order sits on the four-step delivery rail; null when it left the rail. */
const STATUS: Record<string, { label: string; step: number | null }> = {
  pending: { label: "Order placed", step: 0 },
  paid: { label: "Payment received", step: 1 },
  processing: { label: "Being prepared", step: 1 },
  shipped: { label: "On its way", step: 2 },
  fulfilled: { label: "On its way", step: 2 },
  delivered: { label: "Delivered", step: 3 },
  cancelled: { label: "Cancelled", step: null },
  refunded: { label: "Refunded", step: null },
  returned: { label: "Returned", step: null },
};

const NAV: { tab: AccountTab; label: string; Icon: typeof Package }[] = [
  { tab: "orders", label: "Orders", Icon: Package },
  { tab: "wishlist", label: "Wishlist", Icon: Heart },
  { tab: "addresses", label: "Addresses", Icon: MapPin },
  { tab: "profile", label: "Profile", Icon: UserRound },
];

export function AccountDashboard({ data, tab }: { data: AccountData; tab: AccountTab }) {
  const { profile } = data;
  const counts: Partial<Record<AccountTab, number>> = {
    orders: data.orders.length,
    wishlist: data.wishlist.length,
    addresses: data.addresses.length,
  };

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Account</span>
      </nav>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{profile.fullName || "My account"}</h1>
          <p className={styles.meta}>
            <span>{profile.email}</span>
            <span>Customer since {monthYear(profile.memberSince)}</span>
          </p>
        </div>
        <SignOutButton className={styles.signOut} />
      </header>

      <div className={styles.layout}>
        <nav className={styles.nav} aria-label="Account sections">
          {NAV.map(({ tab: t, label, Icon }) => (
            <Link
              key={t}
              href={t === "orders" ? "/account" : `/account?tab=${t}`}
              className={styles.navLink}
              aria-current={tab === t ? "page" : undefined}
              scroll={false}
            >
              <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
              {label}
              {counts[t] !== undefined ? <span className={styles.navCount}>{counts[t]}</span> : null}
            </Link>
          ))}
        </nav>

        <section className={styles.panel} key={tab} aria-labelledby="account-panel-title">
          {tab === "orders" ? <OrdersPanel orders={data.orders} /> : null}
          {tab === "wishlist" ? <WishlistPanel data={data} /> : null}
          {tab === "addresses" ? <AddressesPanel data={data} /> : null}
          {tab === "profile" ? <ProfilePanel data={data} /> : null}
        </section>
      </div>
    </div>
  );
}

function PanelHead({ title, note }: { title: string; note?: string }) {
  return (
    <div className={styles.panelHead}>
      <h2 id="account-panel-title" className={styles.panelTitle}>{title}</h2>
      {note ? <p className={styles.panelNote}>{note}</p> : null}
    </div>
  );
}

function Empty({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <div className={styles.empty}>
      <h3>{title}</h3>
      <p>{body}</p>
      <Link href={href} className={styles.emptyLink}>{cta}</Link>
    </div>
  );
}

function OrdersPanel({ orders }: { orders: AccountOrder[] }) {
  if (!orders.length) {
    return (
      <>
        <PanelHead title="Orders" />
        <Empty
          title="No orders yet"
          body="When you place an order while signed in, it appears here with its delivery progress."
          href="/collections/new-in"
          cta="Shop new in"
        />
      </>
    );
  }
  return (
    <>
      <PanelHead title="Orders" note={`${orders.length} ${orders.length === 1 ? "order" : "orders"}`} />
      <ol className={styles.orders}>
        {orders.map((order) => <OrderCard key={order.id} order={order} />)}
      </ol>
    </>
  );
}

function OrderCard({ order }: { order: AccountOrder }) {
  const status = STATUS[order.status] ?? { label: order.status, step: 0 };
  const shown = order.items.slice(0, 4);
  const extra = order.items.length - shown.length;

  return (
    <li className={styles.order}>
      <div className={styles.orderTop}>
        <div>
          <p className={styles.orderNumber}>{order.number}</p>
          <p className={styles.orderDate}>{longDate(order.createdAt)}</p>
        </div>
        <div>
          <p className={styles.orderTotal}>{money(order.total, order.currency)}</p>
          <p className={styles.orderCount}>{order.itemCount} {order.itemCount === 1 ? "item" : "items"}</p>
        </div>
      </div>

      <p className={`${styles.status} ${status.step === null ? styles.statusClosed : ""}`}>{status.label}</p>
      {status.step !== null ? (
        <ol className={styles.rail} aria-label={`Delivery progress: ${RAIL[status.step]}`}>
          {RAIL.map((label, i) => (
            <li
              key={label}
              className={`${styles.railStep} ${i < status.step! ? styles.railDone : ""} ${i === status.step ? styles.railCurrent : ""}`}
              aria-current={i === status.step ? "step" : undefined}
            >
              {label}
            </li>
          ))}
        </ol>
      ) : null}

      {shown.length ? (
        <div className={styles.thumbs}>
          {shown.map((item, i) => (
            <div key={`${item.title}-${i}`} className={styles.thumb}>
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- order snapshots can come from any image host
                <img src={item.imageUrl} alt={item.title} loading="lazy" />
              ) : null}
            </div>
          ))}
          {extra > 0 ? <div className={styles.thumbMore}>+{extra}</div> : null}
        </div>
      ) : null}

      {order.items.length ? (
        <details className={styles.details}>
          <summary>
            Order details
            <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" />
          </summary>
          <ul className={styles.lines}>
            {order.items.map((item, i) => (
              <li key={`${item.title}-${i}`} className={styles.line}>
                <span>
                  {item.title}
                  {item.variant && item.variant !== item.title ? <span className={styles.lineVariant}> · {item.variant}</span> : null}
                  {" "}× {item.quantity}
                </span>
                <span>{money(item.unitPrice * item.quantity, order.currency)}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </li>
  );
}

function WishlistPanel({ data }: { data: AccountData }) {
  if (!data.wishlist.length) {
    return (
      <>
        <PanelHead title="Wishlist" />
        <Empty
          title="Nothing saved yet"
          body="Pieces you save to your wishlist will be kept here, ready for when you come back."
          href="/collections/new-in"
          cta="Browse new in"
        />
      </>
    );
  }
  return (
    <>
      <PanelHead title="Wishlist" note={`${data.wishlist.length} saved`} />
      <ul className={styles.wishGrid}>
        {data.wishlist.map((w) => (
          <li key={w.slug}>
            <Link href={`/products/${w.slug}`} className={styles.wish}>
              <div className={styles.wishImage}>
                {w.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- catalogue images come from several hosts
                  <img src={w.imageUrl} alt={w.name} loading="lazy" />
                ) : null}
              </div>
              <p className={styles.wishName}>{w.name}</p>
              <p className={styles.wishPrice}>{money(w.price, w.currency)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function AddressesPanel({ data }: { data: AccountData }) {
  if (!data.addresses.length) {
    return (
      <>
        <PanelHead title="Addresses" />
        <Empty
          title="No addresses yet"
          body="The delivery address from your first order is kept here so you can see where things were sent."
          href="/collections/new-in"
          cta="Start shopping"
        />
      </>
    );
  }
  return (
    <>
      <PanelHead title="Addresses" />
      <ul className={styles.addressGrid}>
        {data.addresses.map((a) => (
          <li key={a.key} className={styles.address}>
            <p className={styles.addressName}>
              {a.fullName}
              {a.isDefault ? <span className={styles.addressTag}>Default</span> : a.fromOrder ? <span className={styles.addressTag}>Used on an order</span> : null}
            </p>
            {a.lines.map((line) => <p key={line}>{line}</p>)}
            {a.phone ? <p className={styles.addressPhone}>{a.phone}</p> : null}
          </li>
        ))}
      </ul>
    </>
  );
}

function ProfilePanel({ data }: { data: AccountData }) {
  return (
    <>
      <PanelHead title="Profile" />
      <div className={styles.profile}>
        <ProfileForm profile={data.profile} />
        <PasswordForm />
      </div>
    </>
  );
}
