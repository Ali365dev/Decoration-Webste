"use client";

import type { ProductDto } from "@dec-walls/types";
import { Eye, Heart, Layers, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "@/components/product/product-card.module.css";

function formatPrice(amount: number, currency: string) {
  const formatted = amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency === "PKR" ? `Rs.${formatted}` : `${currency} ${formatted}`;
}

export function ProductCard({
  product,
  href = `/products/${product.slug}`,
  listView = false,
}: {
  product: ProductDto;
  href?: string;
  listView?: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  return (
    <article className={`product-card ${styles.card} ${listView ? `list-view ${styles.listView}` : ""}`}>
      <div className={styles.media}>
        <Link href={href} className={styles.imageLink} aria-label={`View ${product.name}`}>
          <div className={`product-card-image ${styles.image}`}>
            {product.primaryImageUrl ? (
              <Image
                src={product.primaryImageUrl}
                alt={product.name}
                fill
                sizes="(min-width:1260px) 282px, (min-width:750px) 33vw, 50vw"
                className={`${styles.photo} ${styles.primaryPhoto}`}
              />
            ) : null}
            {product.hoverImageUrl ? (
              <Image
                src={product.hoverImageUrl}
                alt=""
                fill
                sizes="(min-width:1260px) 282px, (min-width:750px) 33vw, 50vw"
                className={`${styles.photo} ${styles.hoverPhoto}`}
              />
            ) : null}
          </div>
        </Link>

        {product.label ? (
          <span className={`${styles.badge} ${product.label.startsWith("-") ? styles.saleBadge : ""}`}>
            {product.label}
          </span>
        ) : null}

        <div className={styles.actions} aria-label={`${product.name} actions`}>
          <button
            className={styles.actionButton}
            type="button"
            aria-label={isAdded ? "Added to bag" : "Add to bag"}
            data-tooltip={isAdded ? "Added to bag" : "Add to bag"}
            aria-pressed={isAdded}
            onClick={() => setIsAdded((value) => !value)}
          >
            <ShoppingCart size={17} strokeWidth={1.7} />
          </button>
          <button
            className={`${styles.actionButton} ${isFavorite ? styles.selectedAction : ""}`}
            type="button"
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            data-tooltip={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isFavorite}
            onClick={() => setIsFavorite((value) => !value)}
          >
            <Heart size={18} strokeWidth={1.65} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            className={`${styles.actionButton} ${isCompared ? styles.selectedAction : ""}`}
            type="button"
            aria-label={isCompared ? "Remove from compare" : "Compare product"}
            data-tooltip={isCompared ? "Remove from compare" : "Compare"}
            aria-pressed={isCompared}
            onClick={() => setIsCompared((value) => !value)}
          >
            <Layers size={18} strokeWidth={1.7} />
          </button>
          <Link className={styles.actionButton} href={href} aria-label={`Quick view ${product.name}`} data-tooltip="Quick view">
            <Eye size={18} strokeWidth={1.65} />
          </Link>
        </div>
      </div>

      <Link href={href} className={styles.details}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceRow}>
          <span>{formatPrice(product.price.amount, product.price.currency)}</span>
          {product.compareAtPrice ? (
            <span className={styles.comparePrice}>
              {formatPrice(product.compareAtPrice.amount, product.compareAtPrice.currency)}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
