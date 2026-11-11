"use client";

import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product/product-card";
import type { ProductDto } from "@dec-walls/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter, X } from "lucide-react";
import { useMemo, useState } from "react";

type CollectionViewProps = {
  products: ProductDto[];
  collectionSlug: string;
};

type SortMode = "featured" | "relevant" | "best-selling" | "name-asc" | "name-desc" | "price-asc" | "price-desc" | "date-asc" | "date-desc";

function GridModeIcon({ columns }: { columns: 2 | 3 | 4 }) {
  const columnCount = columns === 4 ? 4 : columns;
  const rowCount = columns === 2 ? 2 : 3;
  const spacing = columns === 4 ? 4.5 : columns === 3 ? 5.5 : 7;
  const width = 22;
  const height = 17;
  const startX = (width - (columnCount - 1) * spacing) / 2;
  const startY = (height - (rowCount - 1) * spacing) / 2;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="currentColor" aria-hidden="true">
      {Array.from({ length: rowCount }, (_, row) =>
        Array.from({ length: columnCount }, (_, column) => (
          <circle key={`${row}-${column}`} cx={startX + column * spacing} cy={startY + row * spacing} r="1.65" />
        )),
      )}
    </svg>
  );
}

function ListModeIcon() {
  return (
    <svg width="22" height="17" viewBox="0 0 22 17" fill="none" aria-hidden="true">
      {[3, 8.5, 14].map((y) => <circle key={y} cx="2.5" cy={y} r="1.5" fill="currentColor" />)}
      {[3, 8.5, 14].map((y) => <path key={y} d={`M8 ${y}H21`} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />)}
    </svg>
  );
}

function categoryFor(product: ProductDto) {
  if (product.categorySlug) {
    return product.categorySlug
      .split("-")
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(" ");
  }
  const name = product.name.toLowerCase();
  if (name.includes("towel")) return "Bath";
  if (name.includes("linen")) return "Dining";
  if (name.includes("bed") || name.includes("quilt")) return "Bedding";
  return "Living";
}

export function CollectionView({ products, collectionSlug }: CollectionViewProps) {
  const [sort, setSort] = useState<SortMode>("date-desc");
  const [columns, setColumns] = useState<2 | 3 | 4 | "list">(3);
  const [filterOpen, setFilterOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const priceLimit = 69900;
  const [maxPrice, setMaxPrice] = useState(priceLimit);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(products.map(categoryFor))).sort(),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesPrice = product.price.amount >= minPrice && product.price.amount <= maxPrice;
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(categoryFor(product));
      return matchesPrice && matchesCategory && (!inStockOnly || product.status === "published");
    });
    if (sort === "price-asc") result.sort((a, b) => a.price.amount - b.price.amount);
    if (sort === "price-desc") result.sort((a, b) => b.price.amount - a.price.amount);
    if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") result.sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [inStockOnly, maxPrice, minPrice, products, selectedCategories, sort]);

  const filters = (
    <>
      <div className="collection-filter-heading">
        <h2>Filter</h2>
        <button className="collection-filter-close" type="button" aria-label="Close filters" onClick={() => setMobileFilterOpen(false)}><X size={18} /></button>
      </div>
      <fieldset className="collection-filter-group">
        <legend>Category</legend>
        {categories.map((category) => (
          <label key={category} className="collection-filter-option">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={(event) => setSelectedCategories((current) => event.target.checked ? [...current, category] : current.filter((item) => item !== category))}
            />
            <span>{category}</span>
            <small>{products.filter((product) => categoryFor(product) === category).length}</small>
          </label>
        ))}
      </fieldset>
      <fieldset className="collection-filter-group">
        <legend>Availability</legend>
        <label className="collection-filter-option">
          <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />
          <span>In stock</span><small>{products.length}</small>
        </label>
        <label className="collection-filter-option filter-disabled">
          <input type="checkbox" disabled /><span>Out of stock</span><small>0</small>
        </label>
      </fieldset>
      <fieldset className="collection-filter-group">
        <legend>Price</legend>
        <div className="filter-price-inputs">
          <label>Rs.<input type="number" min="0" max={maxPrice} value={minPrice} onChange={(event) => setMinPrice(Math.min(maxPrice, Math.max(0, Number(event.target.value))))} aria-label="Minimum price" /></label>
          <span>to</span>
          <label>Rs.<input type="number" min={minPrice} max={priceLimit} value={maxPrice} onChange={(event) => setMaxPrice(Math.max(minPrice, Math.min(priceLimit, Number(event.target.value))))} aria-label="Maximum price" /></label>
        </div>
        <div className="collection-price-range" aria-label="Price range slider">
          <input type="range" min="0" max={priceLimit} value={minPrice} aria-label="Minimum price slider" onChange={(event) => setMinPrice(Math.min(Number(event.target.value), maxPrice))} />
          <input type="range" min="0" max={priceLimit} value={maxPrice} aria-label="Maximum price slider" onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), minPrice))} />
        </div>
        <p className="filter-price-note">Rs.{minPrice.toLocaleString("en-PK")} – Rs.{maxPrice.toLocaleString("en-PK")}</p>
      </fieldset>
      <button type="button" className="collection-clear-filters" onClick={() => { setSelectedCategories([]); setInStockOnly(false); setMinPrice(0); setMaxPrice(priceLimit); }}>Clear all filters</button>
    </>
  );

  return (
    <>
      <div className="collection-toolbar">
        <button
          type="button"
          className="collection-filter-button"
          aria-expanded={mobileFilterOpen || filterOpen}
          onClick={() => {
            if (window.matchMedia("(max-width: 767px)").matches) setMobileFilterOpen(true);
            else setFilterOpen((open) => !open);
          }}
        >
          <Filter size={14} strokeWidth={2} /> Filter
          {(selectedCategories.length || inStockOnly || minPrice > 0 || maxPrice < priceLimit) ? <span className="filter-count">{selectedCategories.length + Number(inStockOnly) + Number(minPrice > 0 || maxPrice < priceLimit)}</span> : null}
        </button>

        <p className="collection-result-count">There are {visibleProducts.length} results in total</p>

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <div className="collection-view-modes" aria-label="Product layout">
            {([2, 3, 4] as const).map((count) => {
              return <button key={count} type="button" aria-label={`${count} columns`} aria-pressed={columns === count} className={`collection-column-button ${columns === count ? "is-selected" : ""}`} onClick={() => setColumns(count)}><GridModeIcon columns={count} /></button>;
            })}
            <button type="button" aria-label="List view" aria-pressed={columns === "list"} className={`collection-column-button collection-list-button ${columns === "list" ? "is-selected" : ""}`} onClick={() => setColumns("list")}><ListModeIcon /></button>
          </div>
          <label className="collection-sort-control">
            <span>Sort by:</span>
            <span className="relative">
              <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
                <option value="featured">Featured</option><option value="relevant">Most relevant</option><option value="best-selling">Best selling</option><option value="name-asc">Alphabetically, A-Z</option><option value="name-desc">Alphabetically, Z-A</option><option value="price-asc">Price, low to high</option><option value="price-desc">Price, high to low</option><option value="date-asc">Date, old to new</option><option value="date-desc">Date, new to old</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
            </span>
          </label>
        </div>
      </div>

      <div className={`collection-layout ${filterOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {filterOpen ? <aside className="collection-sidebar">{filters}</aside> : null}
        <div className="collection-results">
          <p className="mb-4 text-[11px] text-[#777] md:hidden">There are {visibleProducts.length} results in total</p>
          {visibleProducts.length ? (
            <motion.div layout className={`collection-grid ${columns === "list" ? "list-mode" : `cols-${columns}`}`}>
              <AnimatePresence initial={false} mode="popLayout">
                {visibleProducts.map((product, index) => (
                  <motion.div key={product.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 }, y: { duration: 0.4 } }} className="min-w-0">
                    <Reveal as="article" className="collection-product-reveal" delayMs={Math.min(index % 8, 7) * 45}>
                      <ProductCard product={product} listView={columns === "list"} href={`/collections/${collectionSlug}/products/${product.slug}`} />
                    </Reveal>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <p className="py-20 text-center text-sm text-[#777]">No products match your selected filters.</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFilterOpen ? (
          <>
            <motion.button className="filter-drawer-backdrop" aria-label="Close filters" onClick={() => setMobileFilterOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="filter-drawer" aria-label="Product filters" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>{filters}</motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
