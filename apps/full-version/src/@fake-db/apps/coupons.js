// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} Coupon
 * @property {number} id
 * @property {string} code
 * @property {'percentage'|'fixed'} type
 * @property {number} value - Percentage (0-100) or fixed PKR amount, depending on type
 * @property {number} minOrderAmount - Minimum order subtotal in PKR to use the coupon
 * @property {number} usageLimit - Max total uses across all customers
 * @property {number|null} perCustomerLimit - Max uses per individual customer (null = no limit)
 * @property {number} usedCount
 * @property {string} expiresAt - ISO date string
 * @property {boolean} isActive
 */

export const data = {
  /** @type {Coupon[]} */
  coupons: [
    {
      id: 7001,
      code: 'EID25',
      type: 'percentage',
      value: 25,
      minOrderAmount: 2000,
      usageLimit: 500,
      perCustomerLimit: 1,
      usedCount: 318,
      expiresAt: '2026-12-10T00:00:00.000Z',
      isActive: true
    },
    {
      id: 7002,
      code: 'WELCOME150',
      type: 'fixed',
      value: 150,
      minOrderAmount: 1000,
      usageLimit: 1000,
      perCustomerLimit: 1,
      usedCount: 642,
      expiresAt: '2027-01-31T00:00:00.000Z',
      isActive: true
    },
    {
      id: 7003,
      code: 'KARACHI10',
      type: 'percentage',
      value: 10,
      minOrderAmount: 1500,
      usageLimit: 200,
      perCustomerLimit: null,
      usedCount: 55,
      expiresAt: '2026-11-30T00:00:00.000Z',
      isActive: true
    },
    {
      id: 7004,
      code: 'RAMZAN2026',
      type: 'percentage',
      value: 15,
      minOrderAmount: 3000,
      usageLimit: 300,
      perCustomerLimit: 1,
      usedCount: 300,
      expiresAt: '2026-03-20T00:00:00.000Z',
      isActive: false
    },
    {
      id: 7005,
      code: 'FREESHIP200',
      type: 'fixed',
      value: 200,
      minOrderAmount: 2500,
      usageLimit: 400,
      perCustomerLimit: null,
      usedCount: 112,
      expiresAt: '2026-12-25T00:00:00.000Z',
      isActive: true
    }
  ]
}

let nextId = 7006

// ------------------------------------------------
// GET: Return Coupons List
// ------------------------------------------------
mock.onGet('/apps/coupons/list').reply(config => {
  const { q = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  const filteredData = data.coupons.filter(c => c.code.toLowerCase().includes(queryLowered))

  return [200, { coupons: filteredData, allData: data.coupons, total: filteredData.length }]
})

// ------------------------------------------------
// POST: Add Coupon
// ------------------------------------------------
mock.onPost('/apps/coupons/add-coupon').reply(config => {
  const { data: newData } = JSON.parse(config.data)
  const coupon = { id: nextId++, usedCount: 0, isActive: true, ...newData }
  data.coupons.unshift(coupon)

  return [201, { coupon }]
})

// ------------------------------------------------
// PUT: Update Coupon
// ------------------------------------------------
mock.onPut(/\/apps\/coupons\/update-coupon\/\d+/).reply(config => {
  const id = Number(config.url.split('/').pop())
  const { data: updates } = JSON.parse(config.data)
  const index = data.coupons.findIndex(c => c.id === id)
  if (index === -1) return [404]
  data.coupons[index] = { ...data.coupons[index], ...updates }

  return [200, { coupon: data.coupons[index] }]
})

// ------------------------------------------------
// DELETE: Delete Coupon
// ------------------------------------------------
mock.onDelete('/apps/coupons/delete').reply(config => {
  const id = Number(config.data)
  data.coupons = data.coupons.filter(c => c.id !== id)

  return [200]
})
