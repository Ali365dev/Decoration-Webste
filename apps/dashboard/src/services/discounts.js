// ** Thin service layer over the Discount mock endpoints.

// ** Axios Import
import axios from 'axios'

/**
 * @returns {Promise<{discounts: import('./types').Discount[], allData: import('./types').Discount[], total: number}>}
 */
export const getDiscounts = async () => {
  const response = await axios.get('/apps/discounts/list')

  return response.data
}

/**
 * @param {Partial<import('./types').Discount>} data
 */
export const createDiscount = async data => {
  const response = await axios.post('/apps/discounts/add-discount', { data })

  return response.data.discount
}

/**
 * @param {number|string} id
 * @param {Partial<import('./types').Discount>} data
 */
export const updateDiscount = async (id, data) => {
  const response = await axios.put(`/apps/discounts/update-discount/${id}`, { data })

  return response.data.discount
}

/**
 * @param {number|string} id
 */
export const deleteDiscount = async id => {
  const response = await axios.delete('/apps/discounts/delete', { data: id })

  return response.data
}
