import type { ProductDto } from "@dec-walls/types";
import Image from "next/image";
import Link from "next/link";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ product }: { product: ProductDto }) {
  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-canvas">
          {product.primaryImageUrl ? (
            <Image
              src={product.primaryImageUrl}
              alt={product.name}
              fill
              sizes="(min-width:1260px) 282px, (min-width:750px) 33vw, 50vw"
              className="object-cover transition-transform duration-[0.4s] ease-[ease] group-hover:scale-[1.05]"
            />
          ) : null}
          {product.hoverImageUrl ? (
            <Image
              src={product.hoverImageUrl}
              alt=""
              fill
              sizes="(min-width:1260px) 282px, (min-width:750px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-[0.4s] group-hover:opacity-100"
            />
          ) : null}
          {product.label ? (
            <span
              className={`absolute left-[var(--space-10)] top-[var(--space-10)] text-[length:var(--btn-font-size)] font-medium uppercase leading-[21px] ${
                product.label.startsWith("-")
                  ? "flex size-10 items-center justify-center rounded-full bg-[var(--primary-color)] text-white"
                  : "text-ink"
              }`}
            >
              {product.label}
            </span>
          ) : null}
        </div>
        <div className="pt-[var(--space-15)] text-center">
          <h3 className="text-[length:var(--bls__product-name-size)] font-normal capitalize leading-[28px] text-ink">
            {product.name}
          </h3>
          <div className="mt-[var(--space-6)] flex flex-wrap items-center justify-center gap-2 text-[14px] font-medium text-body">
            <span>
              {formatPrice(product.price.amount, product.price.currency)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-sale line-through">
                {formatPrice(
                  product.compareAtPrice.amount,
                  product.compareAtPrice.currency,
                )}
              </span>
            ) : null}
          </div>
          <span className="mt-[var(--space-15)] inline-block translate-y-1 rounded-pill border border-line bg-paper px-[var(--space-30)] py-[var(--space-10)] text-[length:var(--btn-font-size)] font-medium uppercase leading-[21px] text-ink opacity-90 transition-all duration-[0.4s] ease-[ease] group-hover:translate-y-0 group-hover:border-ink group-hover:bg-ink group-hover:text-white group-hover:opacity-100">
            Shop now
          </span>
        </div>
      </Link>
    </article>
  );
}
