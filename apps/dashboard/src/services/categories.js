// Category service — the real storefront admin API, through the dashboard proxy.

import axios from 'axios'

function mapCategory(c) {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    parentId: c.parentId ?? c.parent_id ?? null,
    productCount: c.productCount ?? 0,
    image: c.imageUrl ?? null,
    imagePublicId: c.imageStoragePath ?? null,
    status: c.status ?? 'published',
  }
}

// The API returns every category; search and status filters apply here.
export const getCategories = async ({ q = '', status = '' } = {}) => {
  const response = await axios.get('/api/admin/categories')
  const all = (response.data?.data ?? []).map(mapCategory)
  const text = q.trim().toLowerCase()

  const categories = all.filter(
    c => (!text || c.name.toLowerCase().includes(text) || c.slug.toLowerCase().includes(text)) && (!status || c.status === status)
  )

  return {
    categories,
    allData: all,
    total: categories.length,
  }
}

const rethrow = err => {
  throw new Error(err?.response?.data?.error || err?.message || 'Something went wrong')
}

export const createCategory = async data => {
  const response = await axios.post('/api/admin/categories', data).catch(rethrow)
  
return response.data?.data
}

export const updateCategory = async (id, data) => {
  const response = await axios.put(`/api/admin/categories/${id}`, data).catch(rethrow)
  
return response.data?.data
}

export const deleteCategory = async id => {
  const response = await axios.delete(`/api/admin/categories/${id}`).catch(rethrow)
  
return response.data?.data
}
