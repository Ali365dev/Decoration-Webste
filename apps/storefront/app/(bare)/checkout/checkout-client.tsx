"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy, Lock, Shield, Truck, Upload } from "lucide-react";
import { useCart } from "@/app/cart-context";
import s from "./checkout.module.css";

type PaymentMethod = "cod" | "bank" | "jazzcash" | "easypaisa";

interface ContactForm { email: string; phone: string; whatsapp: string; }
interface ShippingForm { fullName: string; phone: string; province: string; city: string; area: string; address: string; instructions: string; }

const PROVINCES = [
  { value: "punjab", label: "Punjab" },
  { value: "sindh", label: "Sindh" },
  { value: "kpk", label: "Khyber Pakhtunkhwa" },
  { value: "balochistan", label: "Balochistan" },
  { value: "ajk", label: "Azad Jammu & Kashmir" },
  { value: "gb", label: "Gilgit-Baltistan" },
  { value: "ict", label: "Islamabad Capital Territory" },
];

const CITIES: Record<string, string[]> = {
  punjab: ["Lahore", "Rawalpindi", "Faisalabad", "Multan", "Sialkot", "Gujranwala", "Gujrat", "Bahawalpur", "Sargodha", "Sheikhupura", "Rahim Yar Khan", "Sahiwal"],
  sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpurkhas", "Khairpur"],
  kpk: ["Peshawar", "Abbottabad", "Mardan", "Swat", "Nowshera", "Kohat", "Mansehra", "Haripur"],
  balochistan: ["Quetta", "Turbat", "Khuzdar", "Hub", "Gwadar", "Chaman"],
  ajk: ["Muzaffarabad", "Mirpur", "Rawalakot", "Bhimber"],
  gb: ["Gilgit", "Skardu", "Hunza", "Ghanche"],
  ict: ["Islamabad"],
};

const PAYMENT_CONFIG = {
  bank: {
    label: "Bank Transfer",
    bankName: "Meezan Bank",
    accountTitle: "Dec Walls Pvt Ltd",
    accountNumber: "02601-0101010-7",
    iban: "PK36MEZN0001260101010107",
    instructions: "Transfer the exact order amount and upload the receipt below.",
  },
  jazzcash: {
    label: "JazzCash",
    accountTitle: "Dec Walls",
    mobileNumber: "0300-1234567",
    instructions: "Send the exact amount to this number and upload the payment screenshot.",
  },
  easypaisa: {
    label: "Easypaisa",
    accountTitle: "Dec Walls",
    mobileNumber: "0345-7654321",
    instructions: "Send the exact amount to this number and upload the payment screenshot.",
  },
};

function fmt(n: number) {
  return `Rs.${n.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function generateOrderId() {
  return `DW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

// ── Sub-components ─────────────────────────────────────────────

function RadioDot({ active }: { active: boolean }) {
  return (
    <div className={`${s.deliveryRadio} ${active ? s.active : ""}`}>
      {active && <span className={s.radioInner} />}
    </div>
  );
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className={s.fieldGroup}>
      <label className={s.label}>
        {label}{required && <span className={s.required}> *</span>}
      </label>
      {children}
      {error && <span className={s.errorText}>{error}</span>}
    </div>
  );
}

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" className={s.copyBtn} onClick={() => {
      navigator.clipboard.writeText(value).catch(() => null);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function BankInstructions({ method }: { method: "bank" | "jazzcash" | "easypaisa" }) {
  const cfg = PAYMENT_CONFIG[method];
  return (
    <div className={s.paymentInstructions}>
      <p className={s.instructionsTitle}>Payment details</p>
      {"bankName" in cfg && (
        <div className={s.accountRow}>
          <span className={s.accountRowLabel}>Bank</span>
          <span className={s.accountRowValue}>{cfg.bankName}</span>
        </div>
      )}
      <div className={s.accountRow}>
        <span className={s.accountRowLabel}>Account title</span>
        <span className={s.accountRowValue}>{cfg.accountTitle}</span>
      </div>
      {"accountNumber" in cfg && (
        <div className={s.accountRow}>
          <span className={s.accountRowLabel}>Account no.</span>
          <span className={s.accountRowValue}>{cfg.accountNumber}</span>
          <CopyBtn value={cfg.accountNumber} />
        </div>
      )}
      {"iban" in cfg && (
        <div className={s.accountRow}>
          <span className={s.accountRowLabel}>IBAN</span>
          <span className={s.accountRowValue} style={{ fontSize: 11 }}>{cfg.iban}</span>
          <CopyBtn value={cfg.iban ?? ""} />
        </div>
      )}
      {"mobileNumber" in cfg && (
        <div className={s.accountRow}>
          <span className={s.accountRowLabel}>Mobile no.</span>
          <span className={s.accountRowValue}>{cfg.mobileNumber}</span>
          <CopyBtn value={cfg.mobileNumber ?? ""} />
        </div>
      )}
      <p style={{ fontSize: 12, color: "#777", marginTop: 10, lineHeight: 1.5 }}>{cfg.instructions}</p>
    </div>
  );
}

function UploadProof({ file, onFile, txnId, onTxnId }: { file: File | null; onFile: (f: File | null) => void; txnId: string; onTxnId: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const handleFiles = (files: FileList | null) => {
    if (files?.[0] && files[0].size < 10 * 1024 * 1024) onFile(files[0]);
  };
  return (
    <div style={{ marginTop: 14 }}>
      <div
        className={`${s.uploadZone} ${drag ? s.dragOver : ""}`}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
      >
        <div className={s.uploadIcon}><Upload size={20} /></div>
        <p className={s.uploadText}>Upload payment receipt</p>
        <p className={s.uploadHint}>JPG, PNG or PDF — max 10 MB</p>
        <input ref={ref} type="file" accept="image/jpeg,image/png,application/pdf" style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {file && (
        <div className={s.uploadedFile}><Check size={13} />{file.name}</div>
      )}
      <div className={s.fieldGroup} style={{ marginTop: 10 }}>
        <label className={s.label}>Transaction ID (optional)</label>
        <input type="text" className={s.input} placeholder="e.g. TXN123456789" value={txnId} onChange={(e) => onTxnId(e.target.value)} />
      </div>
      <div className={s.pendingNote}>
        <Shield size={13} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Your order will be confirmed after payment verification (1–2 business hours).</span>
      </div>
    </div>
  );
}

// ── Confirmation ───────────────────────────────────────────────

function Confirmation({ orderId, method, total }: { orderId: string; method: PaymentMethod; total: number }) {
  return (
    <div className={s.confirmPage}>
      <div className={s.confirmIcon}><Check size={28} color="#fff" strokeWidth={2.5} /></div>
      <h1 className={s.confirmTitle}>{method === "cod" ? "Order placed!" : "Order received"}</h1>
      <p className={s.confirmSub}>
        {method === "cod"
          ? "Your order is confirmed. Pay cash on delivery."
          : "Pending payment verification — we'll confirm within 1–2 hours."}
      </p>
      <div className={s.confirmCard}>
        <div className={s.confirmDetailRow}><span className={s.confirmDetailLabel}>Order number</span><span className={s.confirmDetailValue}>{orderId}</span></div>
        <div className={s.confirmDetailRow}><span className={s.confirmDetailLabel}>Payment</span><span className={s.confirmDetailValue}>{method === "cod" ? "Cash on delivery" : PAYMENT_CONFIG[method as "bank" | "jazzcash" | "easypaisa"].label}</span></div>
        <div className={s.confirmDetailRow}><span className={s.confirmDetailLabel}>Total</span><span className={s.confirmDetailValue}>{fmt(total)}</span></div>
        <div className={s.confirmDetailRow}><span className={s.confirmDetailLabel}>Delivery</span><span className={s.confirmDetailValue}>3–5 business days</span></div>
      </div>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 48, padding: "0 32px", background: "#111", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textDecoration: "none", textTransform: "uppercase" as const }}>
        Continue shopping
      </Link>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────

export function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();

  const [contact, setContact] = useState<ContactForm>({ email: "", phone: "", whatsapp: "" });
  const [shipping, setShipping] = useState<ShippingForm>({ fullName: "", phone: "", province: "", city: "", area: "", address: "", instructions: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const shippingFee = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + shippingFee - discount;

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!contact.email.includes("@")) e.email = "Enter a valid email";
    if (!contact.phone.trim()) e.phone = "Phone is required";
    if (!shipping.fullName.trim()) e.fullName = "Full name is required";
    if (!shipping.province) e.province = "Select a province";
    if (!shipping.city.trim()) e.city = "City is required";
    if (!shipping.address.trim()) e.address = "Address is required";
    if (paymentMethod !== "cod" && !uploadedFile) e.upload = "Upload payment receipt";
    return e;
  }, [contact, shipping, paymentMethod, uploadedFile]);

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          shipping,
          paymentMethod,
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, imageUrl: i.imageUrl ?? null, size: i.size })),
          couponCode: couponApplied ? coupon.trim().toUpperCase() : "",
          discount,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors((p) => ({ ...p, _api: data?.error ?? "Failed to place order" })); return; }
      clearCart();
      setConfirmed(data.orderNumber);
    } catch {
      setErrors((p) => ({ ...p, _api: "Network error — please try again" }));
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "DECWALLS10") { setDiscount(Math.round(subtotal * 0.1)); setCouponApplied(true); }
    else if (code === "WELCOME") { setDiscount(500); setCouponApplied(true); }
    else { setErrors((p) => ({ ...p, coupon: "Invalid code" })); setCouponApplied(false); setDiscount(0); }
  };

  const cities = shipping.province ? (CITIES[shipping.province] ?? []) : [];

  if (confirmed) return <Confirmation orderId={confirmed} method={paymentMethod} total={total} />;

  return (
    <div className={s.page}>

      {/* ══════════════════════════════════════════════════════
          LEFT — white form side
          ══════════════════════════════════════════════════════ */}
      <div className={s.left}>
        <div className={s.leftInner}>

          {/* Logo */}
          <Link href="/" className={s.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/logo.svg" alt="Dec Walls" style={{ height: 32, width: "auto" }} />
          </Link>

          {/* Breadcrumb steps */}
          <nav className={s.steps} aria-label="Checkout steps">
            <Link href="/cart" style={{ color: "#bbb", textDecoration: "none" }}>Cart</Link>
            <ChevronRight size={12} className={s.stepSep} />
            <span className={s.stepActive}>Information</span>
            <ChevronRight size={12} className={s.stepSep} />
            <span>Shipping</span>
            <ChevronRight size={12} className={s.stepSep} />
            <span>Payment</span>
          </nav>

          {/* Contact */}
          <div className={s.section}>
            <p className={s.sectionTitle}>Contact</p>
            <Field label="Email address" required error={errors.email}>
              <input type="email" className={`${s.input} ${errors.email ? s.inputError : ""}`} placeholder="you@example.com" value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))} />
            </Field>
            <div className={s.fieldRow}>
              <Field label="Mobile number" required error={errors.phone}>
                <input type="tel" className={`${s.input} ${errors.phone ? s.inputError : ""}`} placeholder="03XX-XXXXXXX" value={contact.phone} onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))} />
              </Field>
              <Field label="WhatsApp (optional)">
                <input type="tel" className={s.input} placeholder="Same as mobile?" value={contact.whatsapp} onChange={(e) => setContact((p) => ({ ...p, whatsapp: e.target.value }))} />
              </Field>
            </div>
          </div>

          {/* Delivery address */}
          <div className={s.section}>
            <p className={s.sectionTitle}>Delivery address</p>
            <div className={s.fieldRow}>
              <Field label="Full name" required error={errors.fullName}>
                <input type="text" className={`${s.input} ${errors.fullName ? s.inputError : ""}`} placeholder="As on CNIC" value={shipping.fullName} onChange={(e) => setShipping((p) => ({ ...p, fullName: e.target.value }))} />
              </Field>
              <Field label="Phone">
                <input type="tel" className={s.input} placeholder="03XX-XXXXXXX" value={shipping.phone} onChange={(e) => setShipping((p) => ({ ...p, phone: e.target.value }))} />
              </Field>
            </div>
            <div className={s.fieldRow}>
              <Field label="Province" required error={errors.province}>
                <div className={s.selectWrap}>
                  <select className={`${s.select} ${errors.province ? s.inputError : ""}`} value={shipping.province} onChange={(e) => setShipping((p) => ({ ...p, province: e.target.value, city: "" }))}>
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <ChevronDown size={14} />
                </div>
              </Field>
              <Field label="City" required error={errors.city}>
                {cities.length > 0 ? (
                  <div className={s.selectWrap}>
                    <select className={`${s.select} ${errors.city ? s.inputError : ""}`} value={shipping.city} onChange={(e) => setShipping((p) => ({ ...p, city: e.target.value }))}>
                      <option value="">Select city</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} />
                  </div>
                ) : (
                  <input type="text" className={`${s.input} ${errors.city ? s.inputError : ""}`} placeholder="Your city" value={shipping.city} onChange={(e) => setShipping((p) => ({ ...p, city: e.target.value }))} />
                )}
              </Field>
            </div>
            <Field label="Area / Town">
              <input type="text" className={s.input} placeholder="Gulberg, DHA, Bahria Town…" value={shipping.area} onChange={(e) => setShipping((p) => ({ ...p, area: e.target.value }))} />
            </Field>
            <Field label="Complete address" required error={errors.address}>
              <input type="text" className={`${s.input} ${errors.address ? s.inputError : ""}`} placeholder="House #, Street #, Block…" value={shipping.address} onChange={(e) => setShipping((p) => ({ ...p, address: e.target.value }))} />
            </Field>
            <Field label="Delivery instructions (optional)">
              <textarea className={s.textarea} placeholder="Landmark, gate code…" value={shipping.instructions} onChange={(e) => setShipping((p) => ({ ...p, instructions: e.target.value }))} />
            </Field>
          </div>

          {/* Delivery method */}
          <div className={s.section}>
            <p className={s.sectionTitle}>Delivery method</p>
            <div className={`${s.deliveryOption} ${s.active}`} style={{ cursor: "default" }}>
              <RadioDot active />
              <Truck size={16} style={{ color: "#888", flexShrink: 0 }} />
              <div className={s.deliveryLabel}>
                <div className={s.deliveryName}>Standard delivery</div>
                <div className={s.deliveryMeta}>3–5 business days</div>
              </div>
              <div className={s.deliveryPrice}>
                {shippingFee === 0 ? <span className={s.totalFree}>Free</span> : fmt(shippingFee)}
              </div>
            </div>
            {subtotal < 5000 && (
              <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
                Free delivery on orders over Rs.5,000. Add <strong style={{ color: "#111" }}>{fmt(5000 - subtotal)}</strong> more.
              </p>
            )}
          </div>

          {/* Payment */}
          <div className={s.section}>
            <p className={s.sectionTitle}>Payment method</p>
            <div className={s.paymentGrid}>
              {(["cod", "bank", "jazzcash", "easypaisa"] as PaymentMethod[]).map((m) => (
                <div key={m} className={`${s.paymentCard} ${paymentMethod === m ? s.active : ""}`} onClick={() => setPaymentMethod(m)}>
                  <RadioDot active={paymentMethod === m} />
                  <div className={s.paymentCardBody}>
                    <div className={s.paymentCardName}>{m === "cod" ? "Cash on delivery" : PAYMENT_CONFIG[m as "bank" | "jazzcash" | "easypaisa"].label}</div>
                    <div className={s.paymentCardDesc}>{m === "cod" ? "Pay on arrival" : "Manual transfer"}</div>
                  </div>
                </div>
              ))}
            </div>

            {paymentMethod === "cod" && (
              <div style={{ marginTop: 14, padding: "12px 14px", background: "#f9f8f6", border: "1px solid #e8e8e8", borderRadius: 8, fontSize: 13, color: "#666", lineHeight: 1.5 }}>
                Pay the exact amount in cash when our courier arrives. Please have exact change ready.
              </div>
            )}

            {paymentMethod !== "cod" && (
              <>
                <BankInstructions method={paymentMethod} />
                <UploadProof file={uploadedFile} onFile={setUploadedFile} txnId={txnId} onTxnId={setTxnId} />
                {errors.upload && <span className={s.errorText} style={{ display: "block", marginTop: 8 }}>{errors.upload}</span>}
              </>
            )}
          </div>

          {/* CTA */}
          {(errors as Record<string, string>)._api && (
            <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 12, padding: "10px 14px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>
              {(errors as Record<string, string>)._api}
            </p>
          )}
          <button type="button" className={s.placeOrderBtn} onClick={handleSubmit} disabled={loading || items.length === 0}>
            {loading ? <span className={s.spinner} /> : <><Lock size={13} />Place order — {fmt(total)}</>}
          </button>

          <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Shield size={11} /> Secure 256-bit SSL encryption
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          RIGHT — warm grey order summary
          ══════════════════════════════════════════════════════ */}
      <div className={s.right}>
        {/* Mobile toggle */}
        <div className={s.mobileSummaryToggle} onClick={() => setSummaryOpen((v) => !v)}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#f05e2d", fontWeight: 600 }}>{items.length}</span> item{items.length !== 1 ? "s" : ""}
            <ChevronDown size={14} style={{ transform: summaryOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
          </span>
          <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(total)}</span>
        </div>

        <div className={s.rightInner}>
          {/* Items */}
          <div className={s.orderItems}>
            {items.map((item) => (
              <div key={item.id + (item.size ?? "")} className={s.orderItem}>
                <div className={s.orderThumb}>
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} />
                  )}
                  <span className={s.orderQtyBadge}>{item.quantity}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className={s.orderItemName}>{item.name}</p>
                  {item.size && <p className={s.orderItemMeta}>{item.size}</p>}
                </div>
                <span className={s.orderItemPrice}>{fmt(item.price * item.quantity)}</span>
              </div>
            ))}
            {items.length === 0 && (
              <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "16px 0" }}>No items in cart</p>
            )}
          </div>

          {/* Coupon */}
          <div className={s.couponRow}>
            <input type="text" className={s.couponInput} placeholder="Discount code" value={coupon} onChange={(e) => setCoupon(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyCoupon()} />
            <button type="button" className={s.couponBtn} onClick={applyCoupon}>Apply</button>
          </div>
          {errors.coupon && <p style={{ fontSize: 11, color: "#c0392b", marginBottom: 8 }}>{errors.coupon}</p>}
          {couponApplied && <p style={{ fontSize: 11, color: "#2a7a2a", marginBottom: 8 }}>Coupon applied — {fmt(discount)} off</p>}

          {/* Totals */}
          <div className={s.totalsBlock}>
            <div className={s.totalRow}>
              <span className={s.totalLabel}>Subtotal</span>
              <span className={s.totalValue}>{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className={s.totalRow}>
                <span className={s.totalLabel}>Discount</span>
                <span className={s.totalSave}>−{fmt(discount)}</span>
              </div>
            )}
            <div className={s.totalRow}>
              <span className={s.totalLabel}>Shipping</span>
              <span className={shippingFee === 0 ? s.totalFree : s.totalValue}>
                {shippingFee === 0 ? "Free" : fmt(shippingFee)}
              </span>
            </div>
          </div>

          <div className={s.grandTotalRow}>
            <span>Total</span>
            <span>
              <span className={s.grandTotalCurrency}>PKR</span>
              {fmt(total)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
