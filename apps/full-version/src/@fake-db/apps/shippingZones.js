// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} ShippingZone
 * @property {number} id
 * @property {string} name
 * @property {number} deliveryCharge - PKR
 * @property {number} estimatedDays
 */

const rawZones = [
  { id: 17001, name: 'Karachi', deliveryCharge: 150, estimatedDays: 2 },
  { id: 17002, name: 'Lahore', deliveryCharge: 200, estimatedDays: 3 },
  { id: 17003, name: 'Islamabad / Rawalpindi', deliveryCharge: 200, estimatedDays: 3 },
  { id: 17004, name: 'Faisalabad', deliveryCharge: 220, estimatedDays: 4 },
  { id: 17005, name: 'Rest of Pakistan', deliveryCharge: 280, estimatedDays: 5 }
]

export const data = {
  /** @type {ShippingZone[]} */
  zones: rawZones
}

// ------------------------------------------------
// GET: Return Shipping Zone List
// ------------------------------------------------
mock.onGet('/apps/shipping-zones/list').reply(config => {
  const { q = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  const filtered = data.zones.filter(z => z.name.toLowerCase().includes(queryLowered))

  return [200, { zones: filtered, total: filtered.length }]
})

// ------------------------------------------------
// POST: Add new Shipping Zone
// ------------------------------------------------
mock.onPost('/apps/shipping-zones/add').reply(config => {
  const zone = JSON.parse(config.data).data
  const lastId = Math.max(...data.zones.map(z => z.id), 17000)

  const newZone = { ...zone, id: lastId + 1 }
  data.zones.unshift(newZone)

  return [201, { zone: newZone }]
})

// ------------------------------------------------
// PUT: Update Shipping Zone (also used for Delivery Charges screen)
// ------------------------------------------------
mock.onPut(/\/apps\/shipping-zones\/update\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const changes = JSON.parse(config.data).data
  const index = data.zones.findIndex(z => z.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested shipping zone!' }]
  }
  data.zones[index] = { ...data.zones[index], ...changes, id }

  return [200, { zone: data.zones[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Shipping Zone
// ------------------------------------------------
mock.onDelete('/apps/shipping-zones/delete').reply(config => {
  const zoneId = Number(config.data)
  const index = data.zones.findIndex(z => z.id === zoneId)
  if (index !== -1) {
    data.zones.splice(index, 1)
  }

  return [200]
})
