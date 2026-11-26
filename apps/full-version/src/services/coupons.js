// ** Thin service layer over the Coupon mock endpoints.
// ** The UI must always go through these functions instead of calling axios or
// ** src/@fake-db directly - this is what lets a real backend swap in later
// ** without touching any page/view code (see BACKEND_READINESS.md).

// ** Axios Import
import axios from 'axios'

/**
 * @param {Object} [params]
 * @param {string} [params.q]
 * @returns {Promise<{coupons: import('./types').Coupon[], allData: import('./types').Coupon[], total: number}>}
 */
export const getCoupons = async (params = {}) => {
  const response = await axios.get('/apps/coupons/list', { params })

  return response.data
}

/**
 * @param {Partial<import('./types').Coupon>} data
 */
export const createCoupon = async data => {
  const response = await axios.post('/apps/coupons/add-coupon', { data })

  return response.data.coupon
}

/**
 * @param {number|string} id
 * @param {Partial<import('./types').Coupon>} data
 */
export const updateCoupon = async (id, data) => {
  const response = await axios.put(`/apps/coupons/update-coupon/${id}`, { data })

  return response.data.coupon
}

/**
 * @param {number|string} id
 */
export const deleteCoupon = async id => {
  const response = await axios.delete('/apps/coupons/delete', { data: id })

  return response.data
}
