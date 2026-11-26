// Collection service — reads from the real storefront admin API (read-only).

import axios from 'axios'

function mapCollection(c) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description ?? '',
    productCount: c.productCount ?? 0,
    status: c.status ?? 'published',
  }
}

export const getCollections = async (params = {}) => {
  const response = await axios.get('/api/admin/collections', { params })
  const rows = response.data?.data ?? []

  return {
    collections: rows.map(mapCollection),
    allData: rows.map(mapCollection),
    total: rows.length,
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
  const response = await axios.delete('/apps/collections/delete', { data: id })
  return response.data
}
