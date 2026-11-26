// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Reference data
import { data as ordersData } from 'src/@fake-db/apps/orders'
import { data as transactionsData } from 'src/@fake-db/apps/transactions'

/**
 * @typedef {Object} Refund
 * @property {number} id
 * @property {number} orderId - References Order.id
 * @property {number} transactionId - References Transaction.id
 * @property {number} amount - PKR
 * @property {string} reason
 * @property {'pending'|'approved'|'rejected'} status
 * @property {string} createdAt - ISO date string
 */

const findTransactionForOrder = orderId => transactionsData.transactions.find(t => t.orderId === orderId)

const rawRefunds = [
  { orderId: 9008, reason: 'Customer returned item - wrong size', status: 'approved', createdAt: '2026-10-27T10:00:00.000Z' },
  { orderId: 9006, reason: 'Order cancelled before dispatch', status: 'approved', createdAt: '2026-09-29T09:30:00.000Z' }
]

export const data = {
  /** @type {Refund[]} */
  refunds: rawRefunds.map((r, index) => {
    const order = ordersData.orders.find(o => o.id === r.orderId)
    const transaction = findTransactionForOrder(r.orderId)

    return {
      id: 13001 + index,
      orderId: r.orderId,
      transactionId: transaction ? transaction.id : null,
      amount: order ? order.total : 0,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt
    }
  })
}

// ------------------------------------------------
// GET: Return Refund List
// ------------------------------------------------
mock.onGet('/apps/refunds/list').reply(config => {
  const { status = '' } = config.params ?? {}

  let filtered = data.refunds.filter(r => !status || r.status === status)
  filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const withOrder = filtered.map(r => {
    const order = ordersData.orders.find(o => o.id === r.orderId)

    return { ...r, orderNumber: order ? order.orderNumber : `#${r.orderId}` }
  })

  return [200, { refunds: withOrder, total: withOrder.length }]
})

// ------------------------------------------------
// POST: Add new Refund request
// ------------------------------------------------
mock.onPost('/apps/refunds/add').reply(config => {
  const refund = JSON.parse(config.data).data
  const lastId = Math.max(...data.refunds.map(r => r.id), 13000)

  const newRefund = { status: 'pending', ...refund, id: lastId + 1, createdAt: new Date().toISOString() }
  data.refunds.unshift(newRefund)

  return [201, { refund: newRefund }]
})

// ------------------------------------------------
// PUT: Approve or Reject a Refund - on approval, mark the related Transaction as refunded
// ------------------------------------------------
mock.onPut(/\/apps\/refunds\/update\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const { status } = JSON.parse(config.data).data
  const index = data.refunds.findIndex(r => r.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested refund!' }]
  }
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return [400, { message: `Invalid refund status "${status}"` }]
  }

  data.refunds[index] = { ...data.refunds[index], status }

  if (status === 'approved') {
    const transactionIndex = transactionsData.transactions.findIndex(t => t.id === data.refunds[index].transactionId)
    if (transactionIndex !== -1) {
      transactionsData.transactions[transactionIndex].status = 'refunded'
      const order = ordersData.orders.find(o => o.id === transactionsData.transactions[transactionIndex].orderId)
      if (order) order.paymentStatus = 'refunded'
    }
  }

  return [200, { refund: data.refunds[index] }]
})
