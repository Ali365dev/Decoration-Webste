// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Reference data - Transactions always reference a REAL Phase 5 order, never an invented one.
import { data as ordersData } from 'src/@fake-db/apps/orders'

/**
 * @typedef {Object} Transaction
 * @property {number} id
 * @property {number} orderId - References Order.id
 * @property {number} customerId - References Customer.id
 * @property {number} amount - PKR
 * @property {'COD'|'Bank Transfer'|'Easypaisa'|'JazzCash'|'SadaPay'} method
 * @property {'pending'|'verified'|'rejected'|'refunded'} status
 * @property {string} reference - Stub receipt/reference number (no real file upload)
 * @property {boolean} [codReconciled] - Only meaningful for COD transactions; set via the
 *   separate COD Reconciliation workflow, NOT the Payment Verification workflow.
 * @property {string} [codReconciledAt]
 * @property {string} [codReconciledBy]
 * @property {string|null} verifiedBy
 * @property {string|null} verifiedAt
 * @property {string} createdAt - ISO date string
 */

// ** Per-order seed config: status is the realistic end-state for each Phase 5 order.
const SEED_CONFIG = {
  9001: { status: 'verified', reference: 'COD-COLLECTED-9001', codReconciled: true },
  9002: { status: 'verified', reference: 'EP-REF-884213' },
  9003: { status: 'pending', reference: 'BT-SLIP-556210' },
  9004: { status: 'verified', reference: 'JC-REF-221098' },
  9005: { status: 'pending', reference: 'COD-PENDING-9005', codReconciled: false },
  9006: { status: 'rejected', reference: 'SP-REF-330221' },
  9007: { status: 'verified', reference: 'COD-COLLECTED-9007', codReconciled: true },
  9008: { status: 'refunded', reference: 'BT-SLIP-778810' },
  9009: { status: 'pending', reference: 'EP-REF-114477' },
  9010: { status: 'verified', reference: 'JC-REF-990011' },
  9011: { status: 'pending', reference: 'COD-PENDING-9011', codReconciled: false },
  9012: { status: 'verified', reference: 'SP-REF-556677' },
  9013: { status: 'pending', reference: 'COD-PENDING-9013', codReconciled: false },
  9014: { status: 'pending', reference: 'BT-SLIP-112233' },
  9015: { status: 'verified', reference: 'EP-REF-667788' },
  9016: { status: 'pending', reference: 'COD-PENDING-9016', codReconciled: false }
}

const buildTransactions = () =>
  ordersData.orders.map((order, index) => {
    const seed = SEED_CONFIG[order.id] ?? { status: 'pending', reference: `REF-${order.id}` }
    const isVerifiedLike = seed.status === 'verified' || seed.status === 'refunded'

    return {
      id: 11001 + index,
      orderId: order.id,
      customerId: order.customerId,
      amount: order.total,
      method: order.paymentMethod,
      status: seed.status,
      reference: seed.reference,
      ...(order.paymentMethod === 'COD' ? { codReconciled: !!seed.codReconciled } : {}),
      ...(order.paymentMethod === 'COD' && seed.codReconciled
        ? { codReconciledAt: order.createdAt, codReconciledBy: 'Warehouse Staff' }
        : {}),
      verifiedBy: isVerifiedLike ? 'Finance Admin' : seed.status === 'rejected' ? 'Finance Admin' : null,
      verifiedAt: isVerifiedLike || seed.status === 'rejected' ? order.createdAt : null,
      createdAt: order.createdAt
    }
  })

export const data = {
  /** @type {Transaction[]} */
  transactions: buildTransactions()
}

// ** Keep Order.paymentStatus in sync with the related Transaction (Payment workflow step 5)
const syncOrderPaymentStatus = transaction => {
  const order = ordersData.orders.find(o => o.id === transaction.orderId)
  if (order) {
    order.paymentStatus = transaction.status
  }
}
data.transactions.forEach(syncOrderPaymentStatus)

const NON_COD_METHODS = ['Bank Transfer', 'Easypaisa', 'JazzCash', 'SadaPay']

// ------------------------------------------------
// GET: Return Transaction List
// ------------------------------------------------
mock.onGet('/apps/transactions/list').reply(config => {
  const { q = '', status = '', method = '', orderId = '', codOnly = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  let filtered = data.transactions.filter(t => {
    const matchesQuery = t.reference.toLowerCase().includes(queryLowered) || String(t.orderId).includes(queryLowered)
    const matchesStatus = !status || t.status === status
    const matchesMethod = !method || t.method === method
    const matchesOrder = !orderId || t.orderId === parseInt(orderId, 10)
    const matchesCod = !codOnly || (codOnly === 'true' ? t.method === 'COD' : t.method !== 'COD')

    return matchesQuery && matchesStatus && matchesMethod && matchesOrder && matchesCod
  })

  filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const withOrder = filtered.map(t => {
    const order = ordersData.orders.find(o => o.id === t.orderId)

    return { ...t, orderNumber: order ? order.orderNumber : `#${t.orderId}` }
  })

  return [200, { transactions: withOrder, total: withOrder.length }]
})

// ------------------------------------------------
// GET: Return Transactions pending Payment Verification (non-COD only - COD is reconciled separately)
// ------------------------------------------------
mock.onGet('/apps/transactions/verification-queue').reply(() => {
  const pending = data.transactions.filter(t => NON_COD_METHODS.includes(t.method) && t.status === 'pending')

  const withOrder = pending.map(t => {
    const order = ordersData.orders.find(o => o.id === t.orderId)

    return { ...t, orderNumber: order ? order.orderNumber : `#${t.orderId}` }
  })

  return [200, { transactions: withOrder, total: withOrder.length }]
})

// ------------------------------------------------
// GET: Return COD transactions awaiting reconciliation (separate from Payment Verification)
// ------------------------------------------------
mock.onGet('/apps/transactions/cod-queue').reply(() => {
  const codTransactions = data.transactions.filter(t => t.method === 'COD')

  const withOrder = codTransactions.map(t => {
    const order = ordersData.orders.find(o => o.id === t.orderId)

    return { ...t, orderNumber: order ? order.orderNumber : `#${t.orderId}`, orderStatus: order ? order.status : '' }
  })

  return [200, { transactions: withOrder, total: withOrder.length }]
})

// ------------------------------------------------
// GET: Return Single Transaction
// ------------------------------------------------
mock.onGet('/apps/transactions/single').reply(config => {
  const { id, orderId } = config.params ?? {}

  const transaction = id
    ? data.transactions.find(t => t.id === parseInt(id, 10))
    : data.transactions.find(t => t.orderId === parseInt(orderId, 10))

  if (!transaction) {
    return [404, { message: 'Unable to find the requested transaction!' }]
  }
  const order = ordersData.orders.find(o => o.id === transaction.orderId)

  return [200, { transaction: { ...transaction, order: order ?? null } }]
})

// ------------------------------------------------
// PUT: Verify or Reject a (non-COD) Transaction - Payment Verification workflow
// ------------------------------------------------
mock.onPut(/\/apps\/transactions\/verify\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const { status, verifiedBy = 'Finance Admin' } = JSON.parse(config.data).data
  const index = data.transactions.findIndex(t => t.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested transaction!' }]
  }
  if (!['verified', 'rejected'].includes(status)) {
    return [400, { message: `Invalid verification status "${status}"` }]
  }

  data.transactions[index] = {
    ...data.transactions[index],
    status,
    verifiedBy,
    verifiedAt: new Date().toISOString()
  }
  syncOrderPaymentStatus(data.transactions[index])

  return [200, { transaction: data.transactions[index] }]
})

// ------------------------------------------------
// PUT: Bulk-reconcile COD transactions ("cash collected") - COD Reconciliation workflow,
// kept entirely separate from Payment Verification above.
// ------------------------------------------------
mock.onPut('/apps/transactions/reconcile-cod').reply(config => {
  const { ids, reconciledBy = 'Warehouse Staff' } = JSON.parse(config.data).data
  const now = new Date().toISOString()

  const updated = []
  ids.forEach(id => {
    const index = data.transactions.findIndex(t => t.id === id && t.method === 'COD')
    if (index !== -1) {
      data.transactions[index] = {
        ...data.transactions[index],
        status: 'verified',
        codReconciled: true,
        codReconciledAt: now,
        codReconciledBy: reconciledBy
      }
      syncOrderPaymentStatus(data.transactions[index])
      updated.push(data.transactions[index])
    }
  })

  return [200, { transactions: updated }]
})

// ------------------------------------------------
// POST: Add new Transaction (e.g. manual entry)
// ------------------------------------------------
mock.onPost('/apps/transactions/add').reply(config => {
  const transaction = JSON.parse(config.data).data
  const lastId = Math.max(...data.transactions.map(t => t.id), 11000)
  const now = new Date().toISOString()

  const newTransaction = {
    status: 'pending',
    verifiedBy: null,
    verifiedAt: null,
    ...transaction,
    id: lastId + 1,
    createdAt: now
  }
  data.transactions.unshift(newTransaction)
  syncOrderPaymentStatus(newTransaction)

  return [201, { transaction: newTransaction }]
})
