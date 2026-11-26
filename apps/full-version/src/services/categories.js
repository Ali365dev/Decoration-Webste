// Category service — reads from the real storefront admin API (read-only).
// Create/update/delete remain on fake-db; they are disabled in the UI via the
// Categories page which shows real names but disables edit controls.

import axios from 'axios'

function mapCategory(c) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    parentId: c.parentId ?? c.parent_id ?? null,
    productCount: c.productCount ?? 0,
    image: null,
    status: 'published',
  }
}

export const getCategories = async (params = {}) => {
  const response = await axios.get('/api/admin/categories', { params })
  const rows = response.data?.data ?? []

  return {
    categories: rows.map(mapCategory),
    allData: rows.map(mapCategory),
    total: rows.length,
  }
}

// Write operations — keep fake endpoints; they are blocked in the UI
export const createCategory = async data => {
  const response = await axios.post('/apps/categories/add-category', { data })
  return response.data.category
}

export const updateCategory = async (id, data) => {
  const response = await axios.put(`/apps/categories/update-category/${id}`, { data })
  return response.data.category
}

export const deleteCategory = async id => {
  const response = await axios.delete('/apps/categories/delete', { data: id })
  return response.data
}
