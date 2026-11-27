// ** Thin service layer over the Refund mock endpoints.
import axios from 'axios'

export const getRefunds = async (params = {}) => {
  const response = await axios.get('/apps/refunds/list', { params })

  return response.data
}

export const createRefund = async data => {
  const response = await axios.post('/apps/refunds/add', { data })

  return response.data.refund
}

/**
 * @param {number|string} id
 * @param {'pending'|'approved'|'rejected'} status
 */
export const updateRefundStatus = async (id, status) => {
  const response = await axios.put(`/apps/refunds/update/${id}`, { data: { status } })

  return response.data.refund
}
