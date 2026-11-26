// ** Thin service layer over the Order mock endpoints.
// ** The UI must always go through these functions instead of calling axios or
// ** src/@fake-db directly - this is what lets a real backend swap in later
// ** without touching any page/view code (see BACKEND_READINESS.md).

// ** Axios Import
import axios from 'axios'

/**
 * @param {Object} [params]
 * @param {string} [params.q]
 * @param {string} [params.status]
 * @param {number|string} [params.customerId]
 * @param {string} [params.sortBy]
 * @param {string} [params.sortDir]
 * @returns {Promise<{orders: import('./types').Order[], allData: import('./types').Order[], total: number}>}
 */
export const getOrders = async (params = {}) => {
  const response = await axios.get('/apps/orders/list', { params })

  return response.data
}

/**
 * @param {number|string} id
 * @returns {Promise<import('./types').Order>}
 */
export const getOrderById = async id => {
  const response = await axios.get('/apps/orders/single-order', { params: { id } })

  return response.data.order
}

/**
 * @param {number|string} customerId
 * @returns {Promise<import('./types').Order[]>}
 */
export const getOrdersByCustomer = async customerId => {
  const response = await axios.get('/apps/orders/by-customer', { params: { customerId } })

  return response.data.orders
}

/**
 * @param {Partial<import('./types').Order>} data
 */
export const createOrder = async data => {
  const response = await axios.post('/apps/orders/add-order', { data })

  return response.data.order
}

/**
 * @param {number|string} id
 * @param {Partial<import('./types').Order>} data
 */
export const updateOrder = async (id, data) => {
  const response = await axios.put(`/apps/orders/update-order/${id}`, { data })

  return response.data.order
}

/**
 * @param {number|string} id
 * @param {'pending'|'processing'|'shipped'|'delivered'|'cancelled'|'returned'} status
 */
export const updateOrderStatus = async (id, status) => {
  return updateOrder(id, { status })
}

/**
 * @param {number|string} id
 */
export const deleteOrder = async id => {
  const response = await axios.delete('/apps/orders/delete', { data: id })

  return response.data
}
