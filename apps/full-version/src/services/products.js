// Product service — calls the real storefront admin API via the local proxy.
// The proxy route at /api/admin/[...path] adds the ADMIN_API_KEY and forwards
// to http://127.0.0.1:3000/api/admin/*.

import axios from 'axios'

/** Map a DB product row to the shape the dashboard UI expects. */
function mapProduct(p) {
  const primaryImage = p.images?.find(i => i.isPrimary)?.url
    ?? p.images?.[0]?.url
    ?? null
  const firstVariant = p.variants?.[0]

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    status: p.status,
    price: parseFloat(p.priceAmount ?? p.price_amount ?? 0),
    comparePrice: p.compareAtAmount ? parseFloat(p.compareAtAmount) : 0,
    sku: firstVariant?.sku ?? '',
    stock: firstVariant?.inventoryQuantity ?? 0,
    material: p.material ?? '',
    label: p.label ?? null,
    images: primaryImage ? [primaryImage] : [],
    rating: 0,
    reviewCount: 0,
    categoryId: null,
    collectionIds: [],
    createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
    updatedAt: p.updatedAt ?? p.updated_at ?? new Date().toISOString(),
  }
}

export const getProducts = async (params = {}) => {
  const response = await axios.get('/api/admin/products', { params })
  const rows = response.data?.data ?? []

  return {
    products: rows.map(mapProduct),
    allData: rows.map(mapProduct),
    total: rows.length,
  }
}

export const getProductById = async id => {
  const response = await axios.get(`/api/admin/products/${id}`)
  const p = response.data?.data
  if (!p) return null

  return {
    ...mapProduct(p),
    images: p.images?.map(i => i.url) ?? [],
    variants: p.variants ?? [],
  }
}

export const createProduct = async data => {
  const response = await axios.post('/api/admin/products', data)
  return mapProduct(response.data?.data ?? {})
}

export const updateProduct = async (id, data) => {
  const response = await axios.put(`/api/admin/products/${id}`, data)
  return mapProduct(response.data?.data ?? {})
}

export const deleteProduct = async id => {
  const response = await axios.delete(`/api/admin/products/${id}`)
  return response.data
}
