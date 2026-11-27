// Converts between the storefront admin API's product shape and the dashboard form's shape.

const toNumber = v => {
  const n = parseFloat(v)
  
return Number.isFinite(n) ? n : 0
}

/** API product (list row or detail) → the shape the dashboard UI uses. */
export function fromApiProduct(p) {
  const apiImages = [...(p.images ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  const primary = apiImages.filter(i => i.isPrimary)
  const ordered = [...primary, ...apiImages.filter(i => !i.isPrimary)]
  const apiVariants = p.variants ?? []
  const first = apiVariants.find(v => v.isDefault) ?? apiVariants[0]
  const onlyDefault = apiVariants.length === 1 && apiVariants[0].title === 'Default'

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    status: p.status,
    price: toNumber(p.priceAmount ?? p.price_amount),
    comparePrice: p.compareAtAmount ? toNumber(p.compareAtAmount) : 0,
    sku: first?.sku ?? '',
    stock: first?.inventoryQuantity ?? 0,
    material: p.material ?? '',
    label: p.label ?? null,
    images: ordered.length
      ? ordered.map(i => ({ url: i.url, publicId: i.storagePath ?? null }))
      : p.primaryImageUrl
        ? [{ url: p.primaryImageUrl, publicId: null }]
        : [],
    variants: onlyDefault
      ? []
      : apiVariants.map(v => ({ id: v.id, sku: v.sku, size: v.title, price: toNumber(v.priceAmount), stock: v.inventoryQuantity ?? 0 })),
    rating: 0,
    reviewCount: 0,
    categoryId: p.categoryId ?? null,
    collectionIds: p.collectionIds ?? [],
    createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
    updatedAt: p.updatedAt ?? p.updated_at ?? new Date().toISOString()
  }
}

/**
 * Form values + extra state → the API body.
 * `images` are already-uploaded `{ url, publicId }` in display order; the first is primary.
 */
export function toApiPayload(form, { collectionIds, variants, images }) {
  return {
    name: form.name,
    description: form.description || null,
    status: form.status,
    priceAmount: toNumber(form.price),
    compareAtAmount: toNumber(form.comparePrice),
    material: form.material || null,
    sku: form.sku,
    stock: Math.trunc(toNumber(form.stock)),
    categoryId: form.categoryId || null,
    collectionIds,
    variants: variants
      .filter(v => v.size)
      .map(v => ({
        title: v.size,
        priceAmount: toNumber(v.price),
        inventoryQuantity: Math.trunc(toNumber(v.stock)),
        ...(v.sku ? { sku: v.sku } : {})
      })),
    images: images.map((img, i) => ({ url: img.url, publicId: img.publicId ?? null, isPrimary: i === 0 }))
  }
}
