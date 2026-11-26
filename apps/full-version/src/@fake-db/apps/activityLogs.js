// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} ActivityLog
 * @property {number} id
 * @property {number} staffId - References StaffMember.id
 * @property {string} staffName - Denormalized staff name at time of action
 * @property {string} action - e.g. "Approved payment #1234"
 * @property {'product'|'order'|'payment'|'inventory'|'marketing'|'staff'} category
 * @property {string} timestamp - ISO date string
 */

// ** Phase 7 simplification: this is a seeded, static activity feed, not a
// ** live audit log that intercepts every action across the app (that would
// ** be a much larger cross-cutting change). Entries below are written to
// ** read like plausible records of real actions from Phases 4-6.
export const data = {
  /** @type {ActivityLog[]} */
  logs: [
    {
      id: 8001,
      staffId: 6002,
      staffName: 'Mariam Qureshi',
      action: "Updated product price on \"Men's Slim Fit Cotton Kurta - Navy\" (SKU JDW-KRT-001)",
      category: 'product',
      timestamp: '2026-11-08T14:20:00.000Z'
    },
    {
      id: 8002,
      staffId: 6004,
      staffName: 'Owais Ahmed',
      action: 'Updated order ORD-10013 status to Processing',
      category: 'order',
      timestamp: '2026-11-08T10:05:00.000Z'
    },
    {
      id: 8003,
      staffId: 6001,
      staffName: 'Hassan Siddiqui',
      action: 'Verified Bank Transfer payment for order ORD-10004',
      category: 'payment',
      timestamp: '2026-11-07T16:40:00.000Z'
    },
    {
      id: 8004,
      staffId: 6003,
      staffName: 'Zainab Fatima',
      action: 'Created new product "Car Mobile Holder with Wireless Charging"',
      category: 'product',
      timestamp: '2026-11-07T11:15:00.000Z'
    },
    {
      id: 8005,
      staffId: 6004,
      staffName: 'Owais Ahmed',
      action: 'Recorded stock restock of 50 units for Electric Kettle 1.8L - Stainless Steel',
      category: 'inventory',
      timestamp: '2026-11-06T09:30:00.000Z'
    },
    {
      id: 8006,
      staffId: 6002,
      staffName: 'Mariam Qureshi',
      action: 'Approved refund for order ORD-10008 (Rs. 3,650)',
      category: 'payment',
      timestamp: '2026-11-05T15:00:00.000Z'
    },
    {
      id: 8007,
      staffId: 6002,
      staffName: 'Mariam Qureshi',
      action: 'Created flash sale "Winter Footwear Blowout" (25% off)',
      category: 'marketing',
      timestamp: '2026-11-04T13:10:00.000Z'
    },
    {
      id: 8008,
      staffId: 6001,
      staffName: 'Hassan Siddiqui',
      action: 'Invited Rabia Nasir as Support staff',
      category: 'staff',
      timestamp: '2026-11-02T09:00:00.000Z'
    },
    {
      id: 8009,
      staffId: 6004,
      staffName: 'Owais Ahmed',
      action: 'Marked COD collected for order ORD-10001 (Rs. 7,180)',
      category: 'payment',
      timestamp: '2026-10-30T12:00:00.000Z'
    },
    {
      id: 8010,
      staffId: 6003,
      staffName: 'Zainab Fatima',
      action: 'Approved customer review on "Air Fryer 4.5L Digital"',
      category: 'product',
      timestamp: '2026-10-28T17:45:00.000Z'
    }
  ]
}

mock.onGet('/apps/activity-logs/list').reply(config => {
  const { staffId } = config.params ?? {}
  const filtered = staffId ? data.logs.filter(l => String(l.staffId) === String(staffId)) : data.logs

  return [200, { logs: filtered, allData: data.logs, total: filtered.length }]
})
