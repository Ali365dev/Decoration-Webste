"use client";

import type { ProductDto } from "@dec-walls/types";
import Link from "next/link";
import { ArrowRight, ChevronRight, Lock, Minus, Plus, Shield, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/app/cart-context";
import { ProductCard } from "@/components/product/product-card";
import s from "./cart.module.css";

const FREE_THRESHOLD = 5000;
const SHIP_FEE = 200;

function fmt(n: number) {
  return `Rs.${n.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CartClient({ recommendations }: { recommendations: ProductDto[] }) {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const shippingFee = subtotal >= FREE_THRESHOLD ? 0 : SHIP_FEE;
  const total = subtotal + shippingFee - discount;
  const remaining = Math.max(0, FREE_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_THRESHOLD) * 100);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "DECWALLS10") {
      const d = Math.round(subtotal * 0.1);
      setDiscount(d);
      setCouponMsg({ ok: true, text: `10% off applied — ${fmt(d)} saved` });
    } else if (code === "WELCOME") {
      setDiscount(500);
      setCouponMsg({ ok: true, text: "Rs.500 off applied" });
    } else {
      setDiscount(0);
      setCouponMsg({ ok: false, text: "Invalid coupon code" });
    }
  };

  return (
    <div className={s.page}>
      {/* Top bar */}
      <div className={s.topBar}>
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/logo.svg" alt="Dec Walls" style={{ height: 28, width: "auto" }} />
        </Link>
        <Link href="/" className={s.backLink}>
          <ArrowRight size={11} style={{ transform: "rotate(180deg)" }} />
          Continue shopping
        </Link>
      </div>

      <div className={s.main}>
        {/* Breadcrumb */}
        <nav className={s.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <span style={{ color: "#111" }}>Cart</span>
        </nav>

        <h1 className={s.pageTitle}>Your Cart</h1>

        {items.length === 0 ? (
          <div className={s.cols}>
            <div className={s.empty}>
              <div className={s.emptyIcon}>
                <ShoppingBag size={26} />
              </div>
              <p className={s.emptyTitle}>Your bag is empty</p>
              <p className={s.emptyText}>
                Looks like you haven&apos;t added anything yet. Explore our collection to find something you love.
              </p>
              <Link href="/" className={s.emptyBtn}>
                Shop the collection <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ) : (
          <div className={s.cols}>
            {/* ── LEFT: items ─────────────────────────────────── */}
            <div>
              <div className={s.itemsCard}>
                <div className={s.itemsHead}>
                  <span className={s.itemsHeadLabel}>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
                  <button type="button" className={s.clearBtn} onClick={clearCart}>
                    Clear all
                  </button>
                </div>

                {items.map((item) => (
                  <div key={item.id + (item.size ?? "")} className={s.item}>
                    {/* Thumb */}
                    <div className={s.thumb}>
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.name} className={s.thumbImg} />
                      ) : (
                        <div className={s.thumbPlaceholder}>
                          <ShoppingBag size={18} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className={s.itemInfo}>
                      <Link href={`/products/${item.slug}`} className={s.itemName}>
                        {item.name}
                      </Link>
                      <div className={s.itemAttrs}>
                        {item.size && <span className={s.itemAttr}>Size: {item.size}</span>}
                        <span className={s.itemAttr}>{item.currency ?? "PKR"}</span>
                      </div>

                      <div className={s.itemBottom}>
                        <div>
                          <div className={s.itemPrice}>{fmt(item.price)}</div>
                          {item.quantity > 1 && (
                            <div className={s.itemLineTotal}>
                              {item.quantity} × {fmt(item.price)} = {fmt(item.price * item.quantity)}
                            </div>
                          )}
                        </div>

                        <div className={s.stepper}>
                          <button
                            type="button"
                            className={s.stepBtn}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease"
                          >
                            <Minus size={11} />
                          </button>
                          <span className={s.stepVal}>{item.quantity}</span>
                          <button
                            type="button"
                            className={s.stepBtn}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      className={s.deleteBtn}
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Shipping bar */}
              <div className={s.shippingProgress}>
                <div className={s.shippingProgressText}>
                  {shippingFee === 0 ? (
                    <>
                      <span>🎉 You&apos;ve unlocked <strong>free delivery!</strong></span>
                      <span className={s.shippingFreeLabel}>Free</span>
                    </>
                  ) : (
                    <span>
                      Add <strong>{fmt(remaining)}</strong> more to unlock free delivery
                    </span>
                  )}
                </div>
                <div className={s.progressTrack}>
                  <div className={s.progressFill} style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            {/* ── RIGHT: summary ───────────────────────────────── */}
            <div className={s.summary}>
              <div className={s.summaryTitle}>Order Summary</div>

              <div className={s.summaryRows}>
                <div className={s.summaryRow}>
                  <span className={s.rowLabel}>Subtotal</span>
                  <span className={s.rowVal}>{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className={s.summaryRow}>
                    <span className={s.rowLabel}>Discount</span>
                    <span className={s.rowSave}>−{fmt(discount)}</span>
                  </div>
                )}
                <div className={s.summaryRow}>
                  <span className={s.rowLabel}>Delivery</span>
                  <span className={shippingFee === 0 ? s.rowFree : s.rowVal}>
                    {shippingFee === 0 ? "Free" : fmt(shippingFee)}
                  </span>
                </div>
              </div>

              <div className={s.summaryDivider} />

              <div className={s.summaryTotal}>
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>

              {/* Promo code */}
              <div className={s.promoRow}>
                <input
                  type="text"
                  className={s.promoInput}
                  placeholder="Promo code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                />
                <button type="button" className={s.promoBtn} onClick={applyCoupon}>
                  Apply
                </button>
              </div>

              {couponMsg && (
                <p
                  style={{
                    padding: "0 20px 12px",
                    fontSize: 11,
                    color: couponMsg.ok ? "#2a7a2a" : "#c0392b",
                  }}
                >
                  {couponMsg.text}
                </p>
              )}

              <div className={s.summaryFooter}>
                <Link href="/checkout" className={s.checkoutBtn}>
                  Go to Checkout <ArrowRight size={14} />
                </Link>
                <div className={s.trustLine}>
                  <Shield size={11} />
                  Secure 256-bit SSL encryption
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── You may also like ───────────────────────────────── */}
        {recommendations.length > 0 && (
          <section className={s.recs}>
            <div className={s.recsHead}>
              <h2 className={s.recsTitle}>You May Also Like</h2>
              <Link href="/" className={s.recsViewAll}>
                View all <ArrowRight size={11} style={{ display: "inline", verticalAlign: "middle" }} />
              </Link>
            </div>
            <div className={s.recsGrid}>
              {recommendations.slice(0, 4).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
