// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Reference data
import { data as ordersData } from 'src/@fake-db/apps/orders'
import { data as couriersData } from 'src/@fake-db/apps/couriers'

/**
 * @typedef {Object} Shipment
 * @property {number} id
 * @property {number} orderId - References Order.id
 * @property {number} courierId - References Courier.id
 * @property {string} trackingNumber
 * @property {'pending'|'picked'|'in-transit'|'out-for-delivery'|'delivered'|'failed'} status
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} TrackingEvent
 * @property {number} id
 * @property {number} shipmentId - References Shipment.id
 * @property {string} status
 * @property {string} location - Pakistani city
 * @property {string} timestamp - ISO date string
 * @property {string} note
 */

const SHIPMENT_SEED = [
  { orderId: 9001, courierId: 15001, status: 'delivered', city: 'Karachi' },
  { orderId: 9002, courierId: 15002, status: 'delivered', city: 'Karachi' },
  { orderId: 9004, courierId: 15001, status: 'in-transit', city: 'Lahore' },
  { orderId: 9007, courierId: 15003, status: 'delivered', city: 'Faisalabad' },
  { orderId: 9010, courierId: 15002, status: 'out-for-delivery', city: 'Multan' },
  { orderId: 9012, courierId: 15001, status: 'delivered', city: 'Peshawar' },
  { orderId: 9015, courierId: 15004, status: 'in-transit', city: 'Lahore' }
]

const EVENT_TEMPLATES_BY_STATUS = {
  delivered: ['pending', 'picked', 'in-transit', 'out-for-delivery', 'delivered'],
  'out-for-delivery': ['pending', 'picked', 'in-transit', 'out-for-delivery'],
  'in-transit': ['pending', 'picked', 'in-transit'],
  picked: ['pending', 'picked'],
  pending: ['pending'],
  failed: ['pending', 'picked', 'in-transit', 'out-for-delivery', 'failed']
}

const STATUS_NOTES = {
  pending: 'Shipment booked, awaiting pickup',
  picked: 'Parcel picked up from warehouse',
  'in-transit': 'Parcel in transit to destination city',
  'out-for-delivery': 'Out for delivery with rider',
  delivered: 'Parcel delivered to customer',
  failed: 'Delivery attempt failed'
}

let shipments = []
let trackingEvents = []

const buildSeed = () => {
  const builtShipments = []
  const builtEvents = []
  let eventId = 1

  SHIPMENT_SEED.forEach((seed, index) => {
    const order = ordersData.orders.find(o => o.id === seed.orderId)
    const shipmentId = 14001 + index
    const baseDate = order ? new Date(order.createdAt) : new Date()

    builtShipments.push({
      id: shipmentId,
      orderId: seed.orderId,
      courierId: seed.courierId,
      trackingNumber: `TRK-${shipmentId}`,
      status: seed.status,
      createdAt: baseDate.toISOString()
    })

    const steps = EVENT_TEMPLATES_BY_STATUS[seed.status] ?? ['pending']
    steps.forEach((stepStatus, stepIndex) => {
      const ts = new Date(baseDate.getTime() + stepIndex * 20 * 60 * 60 * 1000)

      builtEvents.push({
        id: eventId++,
        shipmentId,
        status: stepStatus,
        location: seed.city,
        timestamp: ts.toISOString(),
        note: STATUS_NOTES[stepStatus]
      })
    })
  })

  return { builtShipments, builtEvents }
}

const seeded = buildSeed()
shipments = seeded.builtShipments
trackingEvents = seeded.builtEvents

export const data = {
  /** @type {Shipment[]} */
  shipments,

  /** @type {TrackingEvent[]} */
  trackingEvents
}

const STATUSES = ['pending', 'picked', 'in-transit', 'out-for-delivery', 'delivered', 'failed']

// ------------------------------------------------
// GET: Return Shipment List
// ------------------------------------------------
mock.onGet('/apps/shipments/list').reply(config => {
  const { q = '', status = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  let filtered = data.shipments.filter(s => {
    const order = ordersData.orders.find(o => o.id === s.orderId)

    const matchesQuery =
      s.trackingNumber.toLowerCase().includes(queryLowered) ||
      (order && order.orderNumber.toLowerCase().includes(queryLowered))
    const matchesStatus = !status || s.status === status

    return matchesQuery && matchesStatus
  })

  filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const enriched = filtered.map(s => {
    const order = ordersData.orders.find(o => o.id === s.orderId)
    const courier = couriersData.couriers.find(c => c.id === s.courierId)

    return {
      ...s,
      orderNumber: order ? order.orderNumber : `#${s.orderId}`,
      courierName: courier ? courier.name : 'Unassigned'
    }
  })

  return [200, { shipments: enriched, total: enriched.length }]
})

// ------------------------------------------------
// GET: Return Single Shipment (by id or orderId)
// ------------------------------------------------
mock.onGet('/apps/shipments/single').reply(config => {
  const { id, orderId } = config.params ?? {}

  const shipment = id
    ? data.shipments.find(s => s.id === parseInt(id, 10))
    : data.shipments.find(s => s.orderId === parseInt(orderId, 10))

  if (!shipment) {
    return [404, { message: 'Unable to find the requested shipment!' }]
  }
  const order = ordersData.orders.find(o => o.id === shipment.orderId)
  const courier = couriersData.couriers.find(c => c.id === shipment.courierId)

  return [200, { shipment: { ...shipment, order: order ?? null, courier: courier ?? null } }]
})

// ------------------------------------------------
// GET: Return Tracking Events for a Shipment
// ------------------------------------------------
mock.onGet('/apps/shipments/tracking').reply(config => {
  const { shipmentId } = config.params ?? {}

  const events = data.trackingEvents
    .filter(e => e.shipmentId === parseInt(shipmentId, 10))
    .slice()
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  return [200, { events, total: events.length }]
})

// ------------------------------------------------
// POST: Create Shipment for an Order (Shipping workflow step 1-2: Create Shipment + Assign Courier)
// ------------------------------------------------
mock.onPost('/apps/shipments/create').reply(config => {
  const { orderId, courierId, trackingNumber } = JSON.parse(config.data).data

  const existing = data.shipments.find(s => s.orderId === orderId)
  if (existing) {
    return [409, { message: 'A shipment already exists for this order!' }]
  }

  const lastId = Math.max(...data.shipments.map(s => s.id), 14000)
  const now = new Date().toISOString()

  const newShipment = {
    id: lastId + 1,
    orderId,
    courierId,
    trackingNumber: trackingNumber || `TRK-${lastId + 1}`,
    status: 'pending',
    createdAt: now
  }
  data.shipments.push(newShipment)

  const lastEventId = Math.max(...data.trackingEvents.map(e => e.id), 0)
  const order = ordersData.orders.find(o => o.id === orderId)
  data.trackingEvents.push({
    id: lastEventId + 1,
    shipmentId: newShipment.id,
    status: 'pending',
    location: order ? order.shippingAddress.city : 'Karachi',
    timestamp: now,
    note: STATUS_NOTES.pending
  })

  return [201, { shipment: newShipment }]
})

// ------------------------------------------------
// PUT: Update Delivery Status + Add Tracking Event (Shipping workflow step 3-4)
// ------------------------------------------------
mock.onPut(/\/apps\/shipments\/update\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const { status, location, note, courierId, trackingNumber } = JSON.parse(config.data).data
  const index = data.shipments.findIndex(s => s.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested shipment!' }]
  }
  if (status && !STATUSES.includes(status)) {
    return [400, { message: `Invalid shipment status "${status}"` }]
  }

  data.shipments[index] = {
    ...data.shipments[index],
    ...(status ? { status } : {}),
    ...(courierId ? { courierId } : {}),
    ...(trackingNumber ? { trackingNumber } : {})
  }

  if (status) {
    const lastEventId = Math.max(...data.trackingEvents.map(e => e.id), 0)
    data.trackingEvents.push({
      id: lastEventId + 1,
      shipmentId: id,
      status,
      location: location || 'Karachi',
      timestamp: new Date().toISOString(),
      note: note || STATUS_NOTES[status] || 'Status updated'
    })

    // ** Reflect delivered shipments back onto the related Order
    if (status === 'delivered') {
      const order = ordersData.orders.find(o => o.id === data.shipments[index].orderId)
      if (order && order.status !== 'delivered') order.status = 'delivered'
    }
  }

  return [200, { shipment: data.shipments[index] }]
})
