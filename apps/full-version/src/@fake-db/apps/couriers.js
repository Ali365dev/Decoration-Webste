// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} Courier
 * @property {number} id
 * @property {string} name
 * @property {string} phone
 * @property {boolean} isActive
 */

const rawCouriers = [
  { id: 15001, name: 'TCS', phone: '021-111-123-456', isActive: true },
  { id: 15002, name: 'Leopards Courier', phone: '021-111-567-890', isActive: true },
  { id: 15003, name: 'M&P (Muller & Phipps)', phone: '021-111-222-333', isActive: true },
  { id: 15004, name: 'Call Courier', phone: '021-111-444-555', isActive: true },
  { id: 15005, name: 'Rider', phone: '021-111-999-000', isActive: false }
]

export const data = {
  /** @type {Courier[]} */
  couriers: rawCouriers
}

// ------------------------------------------------
// GET: Return Courier List
// ------------------------------------------------
mock.onGet('/apps/couriers/list').reply(config => {
  const { q = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  const filtered = data.couriers.filter(c => c.name.toLowerCase().includes(queryLowered))

  return [200, { couriers: filtered, total: filtered.length }]
})

// ------------------------------------------------
// POST: Add new Courier
// ------------------------------------------------
mock.onPost('/apps/couriers/add').reply(config => {
  const courier = JSON.parse(config.data).data
  const lastId = Math.max(...data.couriers.map(c => c.id), 15000)

  const newCourier = { isActive: true, ...courier, id: lastId + 1 }
  data.couriers.unshift(newCourier)

  return [201, { courier: newCourier }]
})

// ------------------------------------------------
// PUT: Update Courier
// ------------------------------------------------
mock.onPut(/\/apps\/couriers\/update\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const changes = JSON.parse(config.data).data
  const index = data.couriers.findIndex(c => c.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested courier!' }]
  }
  data.couriers[index] = { ...data.couriers[index], ...changes, id }

  return [200, { courier: data.couriers[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Courier
// ------------------------------------------------
mock.onDelete('/apps/couriers/delete').reply(config => {
  const courierId = Number(config.data)
  const index = data.couriers.findIndex(c => c.id === courierId)
  if (index !== -1) {
    data.couriers.splice(index, 1)
  }

  return [200]
})
