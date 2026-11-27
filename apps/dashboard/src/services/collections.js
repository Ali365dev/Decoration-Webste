// Collection service — reads from the real storefront admin API (read-only).

import axios from 'axios'

function mapCollection(c) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description ?? '',
    productCount: c.productCount ?? 0,
    productIds: c.productIds ?? [],
    thumbnailUrl: c.thumbnailUrl ?? null,
    status: c.status ?? 'published',
  }
}

export const getCollections = async ({ q = '' } = {}) => {
  const response = await axios.get('/api/admin/collections')
  const all = (response.data?.data ?? []).map(mapCollection)
  const text = q.trim().toLowerCase()

  const collections = text ? all.filter(c => c.name.toLowerCase().includes(text) || c.slug.toLowerCase().includes(text)) : all

  return {
    collections,
    allData: all,
    total: collections.length,
  }
}

// Write operations — keep fake endpoints; create/edit blocked in UI
export const createCollection = async data => {
  const response = await axios.post('/apps/collections/add-collection', { data })
  return response.data.collection
}

export const updateCollection = async (id, data) => {
  const response = await axios.put(`/apps/collections/update-collection/${id}`, { data })
  return response.data.collection
}

export const deleteCollection = async id => {
  const response = await axios.delete(`/api/admin/collections/${id}`)
  return response.data
}
