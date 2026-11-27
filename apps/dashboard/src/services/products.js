// Product service — calls the real storefront admin API via the local proxy.
// The proxy route at /api/admin/[...path] adds the ADMIN_API_KEY and forwards
// to http://127.0.0.1:3000/api/admin/*.

import axios from 'axios'

import { fromApiProduct } from './productMapping'

/** The API's error text when there is one, else the error's own message. */
export const apiError = err => err?.response?.data?.error || err?.message || 'Something went wrong'

const mapProduct = fromApiProduct

export const getProducts = async ({ q = '', status = '', categoryId = '' } = {}) => {
  const response = await axios.get('/api/admin/products')
  const all = (response.data?.data ?? []).map(mapProduct)
  const text = q.trim().toLowerCase()

  const products = all.filter(p =>
    (!text || p.name.toLowerCase().includes(text) || p.sku.toLowerCase().includes(text)) &&
    (!status || p.status === status) &&
    (!categoryId || p.categoryId === categoryId)
  )

  return {
    products,
    allData: all,
    total: products.length,
  }
}

export const getProductById = async id => {
  const response = await axios.get(`/api/admin/products/${id}`)
  const p = response.data?.data
  if (!p) return null

  return mapProduct(p)
}

export const createProduct = async data => {
  const response = await axios.post('/api/admin/products', data)
  
return response.data?.data
}

export const updateProduct = async (id, data) => {
  const response = await axios.put(`/api/admin/products/${id}`, data)
  
return response.data?.data
}

export const deleteProduct = async id => {
  const response = await axios.delete(`/api/admin/products/${id}`)
  
return response.data
}
