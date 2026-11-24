"use client";

import type { ProductDto } from "@dec-walls/types";
import { ArrowUpRight, Heart, HelpCircle, Layers, Minus, Plus, RefreshCw, Share2, Star, Truck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { Reveal } from "@/components/motion/reveal";
import productStyles from "@/components/product/product-detail.module.css";
import { useCart } from "@/app/cart-context";

function formatPrice(amount: number, currency: string) {
  return `${currency === "PKR" ? "Rs." : `${currency} `}${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const bedInBagBundle = [
  {
    id: "bed-in-a-bag-current",
    name: "BED IN A BAG",
    amount: 44500,
    image:
      "https://bareezehome.com.pk/cdn/shop/files/CAPP-169-QF-RP.jpg?v=1793964554&width=493",
  },
  {
    id: "bed-in-a-bag-artboard",
    name: "BED IN A BAG",
    amount: 44000,
    image:
      "https://bareezehome.com.pk/cdn/shop/files/Artboard_1_copy_3.jpg?v=1790154063&width=493",
  },
  {
    id: "bed-in-a-bag-capp-180",
    name: "BED IN A BAG",
    amount: 47000,
    image:
      "https://bareezehome.com.pk/cdn/shop/files/CAPP-180.jpg?v=1793964544&width=493",
  },
];

export function ProductExperience({
  product,
  collectionSlug = "new-in",
  recommendedProducts = [],
}: {
  product: ProductDto;
  collectionSlug?: string;
  recommendedProducts?: ProductDto[];
}) {
  const photos = [product.primaryImageUrl, product.hoverImageUrl].filter(
    (photo): photo is string => Boolean(photo),
  );
  const galleryPhotos = Array.from(new Set([
    ...photos,
    ...(product.galleryImageUrls ?? []),
  ]));
  const isSilkSheet = product.slug === "silk-plain-bed-sheet-set";
  const isKhaise = product.slug === "khaise";
  const isBedInBag = product.slug === "capp-169-qf-rp";
  const optionName = isBedInBag ? "Bed In a Bag" : product.name;
  const sizeOptions = isBedInBag
    ? ["King"]
    : isSilkSheet
    ? ["KING (100X100 IN.)"]
    : isKhaise
      ? ["SINGLE (60X90 IN.)", "DOUBLE (90X95 IN.)"]
      : [];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] ?? "");
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>(
    bedInBagBundle.map((item) => item.id),
  );
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const [zoomed, setZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping" | "returns">("description");
  const [mobilePanel, setMobilePanel] = useState<string | null>("description");
  const [recentlyViewed, setRecentlyViewed] = useState<ProductDto[]>([]);
  const [showDesktopSticky, setShowDesktopSticky] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const currentPrice = isKhaise && selectedSize.startsWith("DOUBLE") ? 18000 : product.price.amount;
  // Only show a strike-through price when it is really higher than the price being sold
  // (Khaise "Double" overrides the price, so the catalog compare-at price no longer applies).
  const compareAmount = product.compareAtPrice && !(isKhaise && selectedSize.startsWith("DOUBLE")) && product.compareAtPrice.amount > currentPrice
    ? product.compareAtPrice.amount
    : null;
  const discountPercent = compareAmount ? Math.round((1 - currentPrice / compareAmount) * 100) : 0;
  const bundleTotal = bedInBagBundle
    .filter((item) => selectedBundleIds.includes(item.id))
    .reduce((total, item) => total + item.amount, 0);

  const addTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Single add-to-bag handler shared by the main, sticky and bundle buttons
  // (the sticky buttons previously only flipped the "Added" label without adding anything).
  const handleAdd = useCallback(() => {
    addItem({
      id: selectedSize ? `${product.slug}-${selectedSize}` : product.slug,
      slug: product.slug,
      name: product.name,
      price: currentPrice,
      currency: product.price.currency,
      quantity,
      size: selectedSize || undefined,
      imageUrl: galleryPhotos[0],
    });
    setAdded(true);
    if (addTimer.current) clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setAdded(false), 2000);
  }, [addItem, currentPrice, galleryPhotos, product.name, product.price.currency, product.slug, quantity, selectedSize]);

  useEffect(() => () => { if (addTimer.current) clearTimeout(addTimer.current); }, []);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setZoomed(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  useEffect(() => {
    const storageKey = "dec-walls-recently-viewed";
    let viewedSlugs: string[] = [];
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(parsed)) viewedSlugs = parsed.filter((slug): slug is string => typeof slug === "string");
    } catch {}
    const recent = viewedSlugs
      .filter((slug) => slug !== product.slug)
      .map((slug) => recommendedProducts.find((item) => item.slug === slug))
      .filter((item): item is ProductDto => Boolean(item));
    setRecentlyViewed(recent);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify([product.slug, ...viewedSlugs.filter((slug) => slug !== product.slug)].slice(0, 8)));
    } catch {}
  }, [product.slug, recommendedProducts]);

  useEffect(() => {
    const update = () => setShowDesktopSticky(window.scrollY > 620);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span><Link href={`/collections/${isBedInBag ? "new-in" : collectionSlug}`}>{isBedInBag ? "BEDDING" : collectionSlug.replaceAll("-", " ")}</Link><span>/</span><span>{product.name}</span>
      </nav>
      <div className={`product-detail-layout ${isBedInBag ? "bed-in-a-bag-page" : ""}`}>
        <ProductGallery
          productName={product.name}
          photos={galleryPhotos}
          index={photoIndex}
          onIndexChange={setPhotoIndex}
          onZoom={() => setZoomed(true)}
          galleryRef={galleryRef}
        />

        <div className="product-information">
          {discountPercent > 0 ? <span className="product-sale-label">-{discountPercent}%</span> : null}
          <div className="product-title-row">
            <h1>{product.name}</h1>
          </div>
          <p className="product-price">
            <span className={compareAmount ? "price-sale" : undefined}>{formatPrice(currentPrice, product.price.currency)}</span>
            {compareAmount && product.compareAtPrice ? <s className="product-compare-price">{formatPrice(compareAmount, product.compareAtPrice.currency)}</s> : null}
          </p>

          <div className="product-options">
            <div className="variant-option">
              <div className="product-option-heading"><span>Option:</span><span>{optionName}</span></div>
              <button className="variant-chip selected" type="button" aria-pressed="true">{isBedInBag ? "Bed In a Bag" : isKhaise ? "Khaise" : product.name}</button>
            </div>
            {sizeOptions.length ? (
              <div className="variant-option">
                <div className="product-option-heading"><span>Size:</span><span>{selectedSize}</span></div>
                <div className="variant-choices">
                  {sizeOptions.map((size) => <button key={size} className={`variant-chip ${selectedSize === size ? "selected" : ""}`} type="button" aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)}>{size}</button>)}
                </div>
              </div>
            ) : null}
          </div>

          <div className="product-addons">
            {!isBedInBag ? <a href="#size-guide"><ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /> Size guide</a> : null}
            <a href="mailto:hello@decwalls.pk?subject=Product%20question"><HelpCircle size={16} strokeWidth={1.5} aria-hidden="true" /> Ask a Question</a>
            <button
              type="button"
              onClick={() => {
                const url = window.location.href;
                if (navigator.share) navigator.share({ title: product.name, url }).catch(() => {});
                else navigator.clipboard?.writeText(url).catch(() => {});
              }}
            ><Share2 size={16} strokeWidth={1.5} aria-hidden="true" /> Share</button>
          </div>

          <div className="product-purchase-row">
            <div className="quantity-stepper" aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={14} /></button>
              <span aria-live="polite">{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}><Plus size={14} /></button>
            </div>
            <button type="button" className="product-add-button" onClick={handleAdd}>{added ? "Added to bag" : "Add to bag"}</button>
            <Link href="/wishlist" className="product-action-button" aria-label="Wishlist"><Heart size={16} strokeWidth={1.5} /></Link>
            <button type="button" className="product-action-button" aria-label="Compare product"><Layers size={16} strokeWidth={1.5} /></button>
          </div>
          {isBedInBag ? (
            <section className={productStyles.bundle} aria-label="Frequently bought together">
              <h2 className={productStyles.bundleTitle}>Frequently bought together</h2>
              <div className={productStyles.bundleItems}>
                {bedInBagBundle.map((item) => {
                  const checked = selectedBundleIds.includes(item.id);
                  return (
                    <label key={item.id} className={productStyles.bundleItem}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setSelectedBundleIds((current) => checked
                          ? current.filter((id) => id !== item.id)
                          : [...current, item.id])}
                      />
                      <Image src={item.image} alt={item.name} width={80} height={80} />
                      <span className={productStyles.bundleProductText}>
                        <span>{item.name}</span>
                        <strong>{formatPrice(item.amount, product.price.currency)}</strong>
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className={productStyles.bundleFooter}>
                <span>Total: <strong>{formatPrice(bundleTotal, product.price.currency)}</strong></span>
                <button type="button" onClick={handleAdd}>
                  {added ? "Added to bag" : "Add selected to bag"}
                </button>
              </div>
            </section>
          ) : null}
          <div className="product-meta-row"><span>Sku:</span><span>{isBedInBag ? `CAPP-169-QF-RP-Bed In a Bag-${selectedSize}` : isSilkSheet ? "FPBS-199-SILK PLAIN BED SHEET SET-KING (100X100 IN.)" : isKhaise ? `FKH-137-KHAISE-${selectedSize}` : product.slug.toUpperCase()}</span></div>
          {(isSilkSheet || isKhaise || isBedInBag) ? <div className="product-meta-row"><span>Color:</span><span>{isSilkSheet ? "PEACH" : isKhaise ? "O-WHITE" : "GREY"}</span></div> : null}
          <div className="product-meta-row"><span>Available:</span><span>In stock</span></div>
          <div className="product-delivery-note">
            <p><Truck size={18} strokeWidth={1.4} /><span><strong>Estimate delivery times:</strong> 3-4 days</span></p>
            <p><RefreshCw size={18} strokeWidth={1.4} /><span><strong>Disclaimer:</strong> Actual colors may vary due to variations on screen</span></p>
          </div>

        </div>
      </div>

      <Reveal as="section" className={productStyles.infoTabsSection}>
        <ul className={productStyles.infoTabsList} role="tablist" aria-label="Product information">
          {(["description", "reviews", "shipping", "returns"] as const).map((tab) => (
            <li key={tab} className={productStyles.infoTabItem}>
              <button
                id={`product-tab-${tab}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls="product-tab-panel"
                className={`${productStyles.infoTabButton} ${activeTab === tab ? productStyles.infoTabActive : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "shipping" ? "Shipping & Returns" : tab === "returns" ? "Return Policies" : tab === "reviews" ? "Review" : "Description"}
              </button>
            </li>
          ))}
        </ul>
        <div key={activeTab} id="product-tab-panel" className={productStyles.infoTabPanel} role="tabpanel" aria-labelledby={`product-tab-${activeTab}`}>
          <ProductTabContent tab={activeTab} product={product} />
        </div>
      </Reveal>

      <div className={`product-mobile-accordions ${productStyles.mobileInfoTabs}`} aria-label="Product information">
        {([
          ["description", "Description"],
          ["reviews", "Review"],
          ["shipping", "Shipping & Returns"],
          ["returns", "Return Policies"],
        ] as const).map(([tab, label]) => (
          <section key={tab} className="product-mobile-accordion">
            <button type="button" aria-expanded={mobilePanel === tab} onClick={() => setMobilePanel((current) => current === tab ? null : tab)}>
              {label}<span aria-hidden="true">{mobilePanel === tab ? "−" : "+"}</span>
            </button>
            {mobilePanel === tab ? <div className="product-mobile-accordion-content"><ProductTabContent tab={tab} product={product} /></div> : null}
          </section>
        ))}
      </div>

      <ProductShelf title="Recently Viewed" products={recentlyViewed.length ? recentlyViewed : recommendedProducts.filter((item) => item.id !== product.id).slice(0, 4)} />
      <ProductShelf title="People Also Bought" products={recommendedProducts.filter((item) => item.id !== product.id).slice(0, 4)} />

      <div className="mobile-sticky-buy" aria-label="Quick add to bag">
        <div className="quantity-stepper" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={14} /></button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}><Plus size={14} /></button>
        </div>
        <button type="button" onClick={handleAdd}>{added ? "Added to bag" : "Add to bag"}</button>
      </div>

      <motion.div
        className="desktop-sticky-buy"
        initial={false}
        animate={showDesktopSticky ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.65, 0.3, 1] }}
        style={{ pointerEvents: showDesktopSticky ? "auto" : "none" }}
        aria-label="Sticky add to bag"
      >
        <div className="desktop-sticky-product">
          {product.primaryImageUrl ? <Image src={product.primaryImageUrl} alt="" width={60} height={60} className="object-cover" /> : null}
          <div><strong>{product.name}</strong><span>{formatPrice(currentPrice, product.price.currency)}</span></div>
        </div>
        <div className="desktop-sticky-actions">
          <select aria-label="Product size" value={selectedSize || product.name} onChange={(event) => setSelectedSize(event.target.value === product.name ? "" : event.target.value)}>
            {sizeOptions.length ? sizeOptions.map((size) => <option key={size} value={size}>{product.name.toUpperCase()} / {size} - Rs.{(isKhaise && size.startsWith("DOUBLE") ? 18000 : product.price.amount).toLocaleString("en-PK")}</option>) : <option value={product.name}>{product.name}</option>}
          </select>
          <div className="quantity-stepper" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={14} /></button>
            <span>{quantity}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}><Plus size={14} /></button>
          </div>
          <button type="button" className="product-add-button" onClick={handleAdd}>{added ? "Added to bag" : "Add to bag"}</button>
        </div>
      </motion.div>

      {zoomed && galleryPhotos[photoIndex] ? (
        <div className="product-zoom-overlay" role="dialog" aria-modal="true" aria-label="Product image zoom" onClick={() => setZoomed(false)}>
          <button type="button" aria-label="Close zoom" onClick={() => setZoomed(false)}>×</button>
          <Image src={galleryPhotos[photoIndex]} alt={product.name} fill sizes="100vw" className="object-contain" />
        </div>
      ) : null}
    </>
  );
}

function ProductShelf({ title, products }: { title: string; products: ProductDto[] }) {
  return (
    <Reveal as="section" className="product-shelf">
      <div className="product-shelf-heading"><h2>{title}</h2><p>Discover more pieces from the collection.</p></div>
      {products.length ? <div className="product-shelf-grid">{products.map((item) => <ProductCard key={item.id} product={item} />)}</div> : <p className="product-shelf-empty">More products will appear here as the collection grows.</p>}
    </Reveal>
  );
}

function ProductTabContent({ tab, product }: { tab: "description" | "reviews" | "shipping" | "returns"; product: ProductDto }) {
  if (tab === "description") return <p>{product.description ?? `${product.name} from our carefully selected home collection. Actual colours may vary slightly due to screen settings.`}</p>;
  if (tab === "reviews") return <div className="product-review-empty"><div className="product-review-stars" aria-label="No ratings yet">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} strokeWidth={1.5} />)}</div><h2>Customer reviews</h2><p>There are no reviews yet for this product.</p></div>;
  if (tab === "shipping") return <p>Shipping rates depend on the destination and order weight. In-stock items are sent after payment and order checks are complete. Delivery times can vary with processing, customs, and transit. Customs duties and clearance charges are payable by the customer.</p>;
  return <p>Returns are accepted within 10 days for eligible unworn items. Contact customer care before returning an item. Products must be returned safely packed in their original packaging.</p>;
}
