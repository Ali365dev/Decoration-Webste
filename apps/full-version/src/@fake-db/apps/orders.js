// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Reference data - keeps order line-items consistent with the real Product catalog
import { data as productsData } from 'src/@fake-db/apps/products.js'
import { data as customersData } from 'src/@fake-db/apps/customers.js'

/**
 * @typedef {Object} OrderItem
 * @property {number} productId - References Product.id
 * @property {string} name - Denormalized product name at time of order
 * @property {number} price - Unit price in PKR at time of order
 * @property {number} qty
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {string} orderNumber - e.g. "ORD-10045"
 * @property {number} customerId - References Customer.id
 * @property {OrderItem[]} items
 * @property {number} subtotal - Sum of item price*qty, in PKR
 * @property {number} shipping - Shipping fee in PKR
 * @property {number} total - subtotal + shipping, in PKR
 * @property {'pending'|'processing'|'shipped'|'delivered'|'cancelled'|'returned'} status
 * @property {'COD'|'Bank Transfer'|'Easypaisa'|'JazzCash'|'SadaPay'} paymentMethod
 * @property {'pending'|'verified'|'rejected'|'refunded'} [paymentStatus] - Kept in sync with the
 *   related Transaction by src/@fake-db/apps/transactions.js (see syncOrderPaymentStatus)
 * @property {string} createdAt - ISO date string
 * @property {{address: string, city: string}} shippingAddress
 */

const findProduct = id => productsData.products.find(p => p.id === id)

const buildItems = pairs =>
  pairs.map(([productId, qty]) => {
    const product = findProduct(productId)

    return {
      productId,
      name: product ? product.name : `Product #${productId}`,
      price: product ? product.price : 0,
      qty
    }
  })

const sumItems = items => items.reduce((sum, item) => sum + item.price * item.qty, 0)

const rawOrders = [
  { id: 9001, orderNumber: 'ORD-10001', customerId: 5001, items: [[3001, 2], [3014, 1]], shipping: 200, status: 'delivered', paymentMethod: 'COD', createdAt: '2026-10-02T09:15:00.000Z', city: 'Karachi', address: 'Block 6, PECHS, Karachi' },
  { id: 9002, orderNumber: 'ORD-10002', customerId: 5001, items: [[3010, 1]], shipping: 150, status: 'delivered', paymentMethod: 'Easypaisa', createdAt: '2026-10-11T12:30:00.000Z', city: 'Karachi', address: 'Block 6, PECHS, Karachi' },
  { id: 9003, orderNumber: 'ORD-10003', customerId: 5001, items: [[3018, 1]], shipping: 250, status: 'processing', paymentMethod: 'Bank Transfer', createdAt: '2026-11-02T08:00:00.000Z', city: 'Karachi', address: 'Block 6, PECHS, Karachi' },
  { id: 9004, orderNumber: 'ORD-10004', customerId: 5002, items: [[3002, 1]], shipping: 200, status: 'shipped', paymentMethod: 'JazzCash', createdAt: '2026-10-18T10:45:00.000Z', city: 'Lahore', address: 'DHA Phase 5, Lahore' },
  { id: 9005, orderNumber: 'ORD-10005', customerId: 5002, items: [[3016, 2]], shipping: 180, status: 'pending', paymentMethod: 'COD', createdAt: '2026-11-05T14:00:00.000Z', city: 'Lahore', address: 'DHA Phase 5, Lahore' },
  { id: 9006, orderNumber: 'ORD-10006', customerId: 5003, items: [[3003, 3]], shipping: 150, status: 'cancelled', paymentMethod: 'SadaPay', createdAt: '2026-09-28T09:00:00.000Z', city: 'Islamabad', address: 'G-9 Markaz, Islamabad' },
  { id: 9007, orderNumber: 'ORD-10007', customerId: 5004, items: [[3008, 2], [3009, 1]], shipping: 150, status: 'delivered', paymentMethod: 'COD', createdAt: '2026-10-09T11:20:00.000Z', city: 'Faisalabad', address: 'Satiana Road, Faisalabad' },
  { id: 9008, orderNumber: 'ORD-10008', customerId: 5004, items: [[3017, 1]], shipping: 150, status: 'returned', paymentMethod: 'Bank Transfer', createdAt: '2026-10-25T16:40:00.000Z', city: 'Faisalabad', address: 'Satiana Road, Faisalabad' },
  { id: 9009, orderNumber: 'ORD-10009', customerId: 5005, items: [[3015, 1]], shipping: 250, status: 'processing', paymentMethod: 'Easypaisa', createdAt: '2026-11-01T13:10:00.000Z', city: 'Rawalpindi', address: 'Satellite Town, Rawalpindi' },
  { id: 9010, orderNumber: 'ORD-10010', customerId: 5006, items: [[3011, 1]], shipping: 200, status: 'shipped', paymentMethod: 'JazzCash', createdAt: '2026-10-30T09:50:00.000Z', city: 'Multan', address: 'Cantt Area, Multan' },
  { id: 9011, orderNumber: 'ORD-10011', customerId: 5006, items: [[3006, 1]], shipping: 200, status: 'pending', paymentMethod: 'COD', createdAt: '2026-11-06T17:00:00.000Z', city: 'Multan', address: 'Cantt Area, Multan' },
  { id: 9012, orderNumber: 'ORD-10012', customerId: 5007, items: [[3007, 1]], shipping: 150, status: 'delivered', paymentMethod: 'SadaPay', createdAt: '2026-10-05T10:10:00.000Z', city: 'Peshawar', address: 'University Road, Peshawar' },
  { id: 9013, orderNumber: 'ORD-10013', customerId: 5008, items: [[3012, 1]], shipping: 200, status: 'processing', paymentMethod: 'COD', createdAt: '2026-11-03T08:30:00.000Z', city: 'Karachi', address: 'Gulshan-e-Iqbal, Karachi' },
  { id: 9014, orderNumber: 'ORD-10014', customerId: 5008, items: [[3013, 1], [3005, 1]], shipping: 200, status: 'pending', paymentMethod: 'Bank Transfer', createdAt: '2026-11-07T09:45:00.000Z', city: 'Karachi', address: 'Gulshan-e-Iqbal, Karachi' },
  { id: 9015, orderNumber: 'ORD-10015', customerId: 5009, items: [[3020, 1]], shipping: 150, status: 'shipped', paymentMethod: 'Easypaisa', createdAt: '2026-10-29T15:05:00.000Z', city: 'Lahore', address: 'Johar Town, Lahore' },
  { id: 9016, orderNumber: 'ORD-10016', customerId: 5010, items: [[3004, 1]], shipping: 150, status: 'pending', paymentMethod: 'COD', createdAt: '2026-11-08T11:00:00.000Z', city: 'Hyderabad', address: 'Latifabad, Hyderabad' }
]

export const data = {
  /** @type {Order[]} */
  orders: rawOrders.map(({ items, shipping, city, address, ...rest }) => {
    const builtItems = buildItems(items)
    const subtotal = sumItems(builtItems)

    return {
      ...rest,
      items: builtItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      shippingAddress: { address, city }
    }
  })
}

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']

// ------------------------------------------------
// GET: Return Order List (search/filter/sort/paginate)
// ------------------------------------------------
mock.onGet('/apps/orders/list').reply(config => {
  const { q = '', status = '', customerId = '', sortBy = 'createdAt', sortDir = 'desc' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  let filteredData = data.orders.filter(order => {
    const customer = customersData.customers.find(c => c.id === order.customerId)

    const matchesQuery =
      order.orderNumber.toLowerCase().includes(queryLowered) ||
      (customer && customer.name.toLowerCase().includes(queryLowered)) ||
      (customer && customer.email.toLowerCase().includes(queryLowered))
    const matchesStatus = !status || order.status === status
    const matchesCustomer = !customerId || order.customerId === parseInt(customerId, 10)

    return matchesQuery && matchesStatus && matchesCustomer
  })

  filteredData = filteredData.slice().sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (a[sortBy] < b[sortBy]) return -1 * dir
    if (a[sortBy] > b[sortBy]) return 1 * dir

    return 0
  })

  // ** Denormalize customer info for list display convenience
  const withCustomer = filteredData.map(order => {
    const customer = customersData.customers.find(c => c.id === order.customerId)

    return {
      ...order,
      customerName: customer ? customer.name : 'Unknown Customer',
      customerEmail: customer ? customer.email : ''
    }
  })

  return [
    200,
    {
      params: config.params,
      allData: data.orders,
      orders: withCustomer,
      total: withCustomer.length
    }
  ]
})

// ------------------------------------------------
// GET: Return Single Order
// ------------------------------------------------
mock.onGet('/apps/orders/single-order').reply(config => {
  const { id } = config.params
  const orderData = data.orders.filter(order => order.id === parseInt(id, 10))
  if (orderData.length) {
    const order = orderData[0]
    const customer = customersData.customers.find(c => c.id === order.customerId)

    return [200, { order: { ...order, customer: customer ?? null } }]
  } else {
    return [404, { message: 'Unable to find the requested order!' }]
  }
})

// ------------------------------------------------
// GET: Return Orders for a given Customer (Order History tab)
// ------------------------------------------------
mock.onGet('/apps/orders/by-customer').reply(config => {
  const { customerId } = config.params
  const orders = data.orders.filter(order => order.customerId === parseInt(customerId, 10))

  return [200, { orders }]
})

// ------------------------------------------------
// POST: Add new Order
// ------------------------------------------------
mock.onPost('/apps/orders/add-order').reply(config => {
  const order = JSON.parse(config.data).data
  const lastId = Math.max(...data.orders.map(o => o.id), 9000)
  const now = new Date().toISOString()
  const items = order.items ?? []
  const subtotal = sumItems(items)
  const shipping = order.shipping ?? 0

  const newOrder = {
    status: 'pending',
    paymentMethod: 'COD',
    ...order,
    id: lastId + 1,
    orderNumber: `ORD-${10000 + (lastId + 1 - 9000)}`,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    createdAt: now
  }
  data.orders.unshift(newOrder)

  return [201, { order: newOrder }]
})

// ------------------------------------------------
// PUT: Update Order (including status changes)
// ------------------------------------------------
mock.onPut(/\/apps\/orders\/update-order\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const changes = JSON.parse(config.data).data
  const index = data.orders.findIndex(o => o.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested order!' }]
  }
  if (changes.status && !STATUSES.includes(changes.status)) {
    return [400, { message: `Invalid status "${changes.status}"` }]
  }
  data.orders[index] = { ...data.orders[index], ...changes, id }

  return [200, { order: data.orders[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Order
// ------------------------------------------------
mock.onDelete('/apps/orders/delete').reply(config => {
  const orderId = Number(config.data)
  const orderIndex = data.orders.findIndex(o => o.id === orderId)
  if (orderIndex !== -1) {
    data.orders.splice(orderIndex, 1)
  }

  return [200]
})
