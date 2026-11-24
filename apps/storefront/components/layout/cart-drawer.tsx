"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/app/cart-context";
import styles from "./cart-drawer.module.css";

function formatPrice(amount: number) {
  return `Rs.${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, totalItems, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Portal needs document to be available (SSR guard)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Drive the CSS animation states
  useEffect(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

    if (isOpen) {
      // Ensure the DOM is painted at translateX(100%) before we flip visible
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!mounted) return null;
  // Keep in DOM during exit animation; `visible` controls CSS
  if (!isOpen && !visible) return null;

  return createPortal(
    <div
      className={`${styles.backdrop} ${visible ? styles.visible : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Backdrop overlay */}
      <div
        className={styles.overlay}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside className={styles.drawer}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e8e8e8",
            padding: "20px 24px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 500,
                color: "#111",
                letterSpacing: 0,
              }}
            >
              Cart
            </h2>
            {totalItems > 0 && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#f05e2d",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 600,
                  lineHeight: 1,
                  padding: "0 5px",
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              color: "#888",
              cursor: "pointer",
              transition: "background 150ms ease, color 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f5";
              (e.currentTarget as HTMLButtonElement).style.color = "#111";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#888";
            }}
          >
            <IconClose />
          </button>
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: "0 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
              Your cart is empty
            </p>
            <Link
              href="/collections/new-in"
              onClick={onClose}
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#111",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <ul
            style={{
              flex: 1,
              overflowY: "auto",
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {items.map((item) => (
              <li
                key={item.id + (item.size ?? "")}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "20px 24px",
                  borderBottom: "1px solid #e8e8e8",
                }}
              >
                {/* Thumbnail */}
                <div className={styles.thumb}>
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} />
                  ) : null}
                </div>

                {/* Info */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#111",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.name}
                  </p>
                  {item.size && (
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 11,
                        color: "#888",
                      }}
                    >
                      {item.size}
                    </p>
                  )}
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 13,
                      color: "#111",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  {/* Qty + remove */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className={styles.stepper}>
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className={styles.stepperBtn}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className={styles.stepperVal}>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className={styles.stepperBtn}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      style={{
                        fontSize: 11,
                        color: "#888",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                        textUnderlineOffset: 2,
                        padding: 0,
                        transition: "color 150ms ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "#111";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "#888";
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #e8e8e8",
            padding: "20px 24px 24px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 13, color: "#888" }}>Subtotal</span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#111",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatPrice(subtotal)}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/cart" onClick={onClose} className={styles.btnOutline}>
              View cart
            </Link>
            <Link href="/checkout" onClick={onClose} className={styles.btnFill}>
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
