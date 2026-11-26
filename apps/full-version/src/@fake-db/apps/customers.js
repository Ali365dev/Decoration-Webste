// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} Customer
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone - Pakistani format, e.g. +92 300 1234567
 * @property {string} city - Pakistani city
 * @property {number} totalOrders - Count of orders placed, kept in sync with orders.js
 * @property {number} totalSpent - Lifetime spend in PKR, kept in sync with orders.js
 * @property {string} joinedAt - ISO date string
 * @property {string} avatarColor - MUI theme color key used when no avatar image exists
 */

export const data = {
  /** @type {Customer[]} */
  customers: [
    {
      id: 5001,
      name: 'Ahmed Raza',
      email: 'ahmed.raza@example.pk',
      phone: '+92 300 1234567',
      city: 'Karachi',
      totalOrders: 3,
      totalSpent: 18940,
      joinedAt: '2026-04-12T10:00:00.000Z',
      avatarColor: 'primary'
    },
    {
      id: 5002,
      name: 'Ayesha Khan',
      email: 'ayesha.khan@example.pk',
      phone: '+92 321 9876543',
      city: 'Lahore',
      totalOrders: 2,
      totalSpent: 9850,
      joinedAt: '2026-05-02T10:00:00.000Z',
      avatarColor: 'success'
    },
    {
      id: 5003,
      name: 'Bilal Hussain',
      email: 'bilal.hussain@example.pk',
      phone: '+92 333 4455667',
      city: 'Islamabad',
      totalOrders: 1,
      totalSpent: 3200,
      joinedAt: '2026-06-18T10:00:00.000Z',
      avatarColor: 'warning'
    },
    {
      id: 5004,
      name: 'Fatima Noor',
      email: 'fatima.noor@example.pk',
      phone: '+92 345 2233445',
      city: 'Faisalabad',
      totalOrders: 2,
      totalSpent: 7690,
      joinedAt: '2026-06-25T10:00:00.000Z',
      avatarColor: 'info'
    },
    {
      id: 5005,
      name: 'Hamza Sheikh',
      email: 'hamza.sheikh@example.pk',
      phone: '+92 301 5566778',
      city: 'Rawalpindi',
      totalOrders: 1,
      totalSpent: 6500,
      joinedAt: '2026-07-09T10:00:00.000Z',
      avatarColor: 'error'
    },
    {
      id: 5006,
      name: 'Hira Baig',
      email: 'hira.baig@example.pk',
      phone: '+92 312 6677889',
      city: 'Multan',
      totalOrders: 2,
      totalSpent: 5440,
      joinedAt: '2026-07-21T10:00:00.000Z',
      avatarColor: 'secondary'
    },
    {
      id: 5007,
      name: 'Imran Qureshi',
      email: 'imran.qureshi@example.pk',
      phone: '+92 302 7788990',
      city: 'Peshawar',
      totalOrders: 1,
      totalSpent: 2750,
      joinedAt: '2026-08-03T10:00:00.000Z',
      avatarColor: 'primary'
    },
    {
      id: 5008,
      name: 'Mahnoor Tariq',
      email: 'mahnoor.tariq@example.pk',
      phone: '+92 334 8899001',
      city: 'Karachi',
      totalOrders: 2,
      totalSpent: 11200,
      joinedAt: '2026-08-15T10:00:00.000Z',
      avatarColor: 'success'
    },
    {
      id: 5009,
      name: 'Usman Ali',
      email: 'usman.ali@example.pk',
      phone: '+92 315 9900112',
      city: 'Lahore',
      totalOrders: 1,
      totalSpent: 4950,
      joinedAt: '2026-09-02T10:00:00.000Z',
      avatarColor: 'warning'
    },
    {
      id: 5010,
      name: 'Zainab Malik',
      email: 'zainab.malik@example.pk',
      phone: '+92 322 0011223',
      city: 'Hyderabad',
      totalOrders: 1,
      totalSpent: 1560,
      joinedAt: '2026-09-20T10:00:00.000Z',
      avatarColor: 'info'
    }
  ]
}

// ------------------------------------------------
// GET: Return Customer List (search/filter/sort/paginate)
// ------------------------------------------------
mock.onGet('/apps/customers/list').reply(config => {
  const { q = '', city = '', sortBy = 'joinedAt', sortDir = 'desc' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  let filteredData = data.customers.filter(
    customer =>
      (customer.name.toLowerCase().includes(queryLowered) ||
        customer.email.toLowerCase().includes(queryLowered) ||
        customer.phone.toLowerCase().includes(queryLowered)) &&
      customer.city === (city || customer.city)
  )

  filteredData = filteredData.slice().sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (a[sortBy] < b[sortBy]) return -1 * dir
    if (a[sortBy] > b[sortBy]) return 1 * dir

    return 0
  })

  return [
    200,
    {
      params: config.params,
      allData: data.customers,
      customers: filteredData,
      total: filteredData.length
    }
  ]
})

// ------------------------------------------------
// GET: Return Single Customer
// ------------------------------------------------
mock.onGet('/apps/customers/single-customer').reply(config => {
  const { id } = config.params
  const customerData = data.customers.filter(customer => customer.id === parseInt(id, 10))
  if (customerData.length) {
    return [200, { customer: customerData[0] }]
  } else {
    return [404, { message: 'Unable to find the requested customer!' }]
  }
})

// ------------------------------------------------
// POST: Add new Customer
// ------------------------------------------------
mock.onPost('/apps/customers/add-customer').reply(config => {
  const customer = JSON.parse(config.data).data
  const lastId = Math.max(...data.customers.map(c => c.id), 5000)
  const now = new Date().toISOString()

  const newCustomer = {
    totalOrders: 0,
    totalSpent: 0,
    avatarColor: 'primary',
    ...customer,
    id: lastId + 1,
    joinedAt: now
  }
  data.customers.unshift(newCustomer)

  return [201, { customer: newCustomer }]
})

// ------------------------------------------------
// PUT: Update Customer
// ------------------------------------------------
mock.onPut(/\/apps\/customers\/update-customer\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const changes = JSON.parse(config.data).data
  const index = data.customers.findIndex(c => c.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested customer!' }]
  }
  data.customers[index] = { ...data.customers[index], ...changes, id }

  return [200, { customer: data.customers[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Customer
// ------------------------------------------------
mock.onDelete('/apps/customers/delete').reply(config => {
  const customerId = Number(config.data)
  const customerIndex = data.customers.findIndex(c => c.id === customerId)
  if (customerIndex !== -1) {
    data.customers.splice(customerIndex, 1)
  }

  return [200]
})
