// ** Thin service layer over the Inventory mock endpoints. Inventory reads/writes
// ** the same Product.stock field (see src/@fake-db/apps/inventory.js), so these
// ** functions are what keep Products and Inventory screens in sync.
import axios from 'axios'

export const getInventoryOverview = async () => {
  const response = await axios.get('/api/admin/inventory')
  return response.data?.summary ?? {}
}

export const getStock = async (params = {}) => {
  const response = await axios.get('/api/admin/inventory', { params })
  const rows = response.data?.data ?? []

  return { stock: rows, allData: rows, total: response.data?.total ?? rows.length }
}

export const getLowStock = async () => {
  const response = await axios.get('/api/admin/inventory', { params: { lowStock: true } })
  return { stock: response.data?.data ?? [], total: response.data?.total ?? 0 }
}

export const getStockHistory = async (params = {}) => {
  const response = await axios.get('/apps/inventory/history', { params })

  return response.data
}

/**
 * @param {number|string} productId
 * @param {number} quantity - Positive to add stock, negative to remove
 * @param {'restock'|'sale'|'adjustment'|'return'} [type]
 * @param {string} [reason]
 */
// variantId is the UUID from product_variants; quantity is the NEW absolute value
export const adjustStock = async (variantId, quantity, type = 'adjustment', reason = 'Manual adjustment') => {
  const response = await axios.put('/api/admin/inventory', { variantId, quantity })

  return response.data
}

export const setLowStockThreshold = async (productId, threshold) => {
  const response = await axios.put(`/apps/inventory/threshold/${productId}`, { data: { threshold } })

  return response.data
}
