// ** Thin service layer over the Transaction (Payment) mock endpoints.
// ** The UI must always go through these functions instead of calling axios or
// ** src/@fake-db directly - see BACKEND_READINESS.md.
import axios from 'axios'

/**
 * @param {Object} [params]
 */
export const getTransactions = async (params = {}) => {
  const response = await axios.get('/apps/transactions/list', { params })

  return response.data
}

/** Transactions pending Payment Verification (non-COD only) */
export const getVerificationQueue = async () => {
  const response = await axios.get('/apps/transactions/verification-queue')

  return response.data
}

/** COD transactions for the COD Reconciliation screen (separate from verification) */
export const getCodQueue = async () => {
  const response = await axios.get('/apps/transactions/cod-queue')

  return response.data
}

/**
 * @param {number|string} id
 */
export const getTransactionById = async id => {
  const response = await axios.get('/apps/transactions/single', { params: { id } })

  return response.data.transaction
}

/**
 * @param {number|string} orderId
 */
export const getTransactionByOrderId = async orderId => {
  const response = await axios.get('/apps/transactions/single', { params: { orderId } })

  return response.data.transaction
}

/**
 * @param {number|string} id
 * @param {'verified'|'rejected'} status
 * @param {string} [verifiedBy]
 */
export const verifyTransaction = async (id, status, verifiedBy = 'Finance Admin') => {
  const response = await axios.put(`/apps/transactions/verify/${id}`, { data: { status, verifiedBy } })

  return response.data.transaction
}

/**
 * @param {number[]} ids
 * @param {string} [reconciledBy]
 */
export const reconcileCodTransactions = async (ids, reconciledBy = 'Warehouse Staff') => {
  const response = await axios.put('/apps/transactions/reconcile-cod', { data: { ids, reconciledBy } })

  return response.data.transactions
}

/**
 * @param {Object} data
 */
export const createTransaction = async data => {
  const response = await axios.post('/apps/transactions/add', { data })

  return response.data.transaction
}
