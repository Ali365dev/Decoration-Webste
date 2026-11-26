// ** Thin service layer over the Inventory mock endpoints. Inventory reads/writes
// ** the same Product.stock field (see src/@fake-db/apps/inventory.js), so these
// ** functions are what keep Products and Inventory screens in sync.
import axios from 'axios'

export const getInventoryOverview = async () => {
  const response = await axios.get('/apps/inventory/overview')

  return response.data
}

export const getStock = async (params = {}) => {
  const response = await axios.get('/apps/inventory/stock', { params })

  return response.data
}

export const getLowStock = async () => {
  const response = await axios.get('/apps/inventory/low-stock')

  return response.data
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
export const adjustStock = async (productId, quantity, type = 'adjustment', reason = 'Manual adjustment') => {
  const response = await axios.post('/apps/inventory/adjust-stock', { data: { productId, quantity, type, reason } })

  return response.data
}

export const setLowStockThreshold = async (productId, threshold) => {
  const response = await axios.put(`/apps/inventory/threshold/${productId}`, { data: { threshold } })

  return response.data
}
