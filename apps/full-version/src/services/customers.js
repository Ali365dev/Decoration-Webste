// ** Thin service layer over the Customer mock endpoints.
// ** The UI must always go through these functions instead of calling axios or
// ** src/@fake-db directly - this is what lets a real backend swap in later
// ** without touching any page/view code (see BACKEND_READINESS.md).

// ** Axios Import
import axios from 'axios'

/**
 * @param {Object} [params]
 * @param {string} [params.q]
 * @param {string} [params.city]
 * @param {string} [params.sortBy]
 * @param {string} [params.sortDir]
 * @returns {Promise<{customers: import('./types').Customer[], allData: import('./types').Customer[], total: number}>}
 */
export const getCustomers = async (params = {}) => {
  const response = await axios.get('/api/admin/customers', { params })
  const rows = response.data?.data ?? []

  return { customers: rows, allData: rows, total: response.data?.total ?? rows.length }
}

/**
 * @param {number|string} id
 * @returns {Promise<import('./types').Customer>}
 */
export const getCustomerById = async id => {
  const response = await axios.get('/apps/customers/single-customer', { params: { id } })

  return response.data.customer
}

/**
 * @param {Partial<import('./types').Customer>} data
 */
export const createCustomer = async data => {
  const response = await axios.post('/apps/customers/add-customer', { data })

  return response.data.customer
}

/**
 * @param {number|string} id
 * @param {Partial<import('./types').Customer>} data
 */
export const updateCustomer = async (id, data) => {
  const response = await axios.put(`/apps/customers/update-customer/${id}`, { data })

  return response.data.customer
}

/**
 * @param {number|string} id
 */
export const deleteCustomer = async id => {
  const response = await axios.delete('/apps/customers/delete', { data: id })

  return response.data
}
