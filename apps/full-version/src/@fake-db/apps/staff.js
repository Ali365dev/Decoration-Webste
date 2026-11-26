// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} StaffMember
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} role - References a role name from /team/roles (Store Owner, Store Manager, Catalog Editor, Order Fulfillment, Support)
 * @property {'active'|'invited'|'suspended'} status
 * @property {string} joinedAt - ISO date string
 * @property {string} avatarColor - MUI theme color key used when no avatar image exists
 */

export const data = {
  /** @type {StaffMember[]} */
  staff: [
    {
      id: 6001,
      name: 'Hassan Siddiqui',
      email: 'hassan.siddiqui@store.pk',
      role: 'Store Owner',
      status: 'active',
      joinedAt: '2025-01-10T09:00:00.000Z',
      avatarColor: 'primary'
    },
    {
      id: 6002,
      name: 'Mariam Qureshi',
      email: 'mariam.qureshi@store.pk',
      role: 'Store Manager',
      status: 'active',
      joinedAt: '2025-02-15T09:00:00.000Z',
      avatarColor: 'success'
    },
    {
      id: 6003,
      name: 'Zainab Fatima',
      email: 'zainab.fatima@store.pk',
      role: 'Catalog Editor',
      status: 'active',
      joinedAt: '2025-04-01T09:00:00.000Z',
      avatarColor: 'info'
    },
    {
      id: 6004,
      name: 'Owais Ahmed',
      email: 'owais.ahmed@store.pk',
      role: 'Order Fulfillment',
      status: 'active',
      joinedAt: '2025-05-20T09:00:00.000Z',
      avatarColor: 'warning'
    },
    {
      id: 6005,
      name: 'Rabia Nasir',
      email: 'rabia.nasir@store.pk',
      role: 'Support',
      status: 'invited',
      joinedAt: '2026-09-02T09:00:00.000Z',
      avatarColor: 'secondary'
    },
    {
      id: 6006,
      name: 'Tariq Mehmood',
      email: 'tariq.mehmood@store.pk',
      role: 'Order Fulfillment',
      status: 'suspended',
      joinedAt: '2025-08-11T09:00:00.000Z',
      avatarColor: 'error'
    }
  ]
}

let nextId = 6007

mock.onGet('/apps/staff/list').reply(config => {
  const { q = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  const filteredData = data.staff.filter(
    s => s.name.toLowerCase().includes(queryLowered) || s.email.toLowerCase().includes(queryLowered)
  )

  return [200, { staff: filteredData, allData: data.staff, total: filteredData.length }]
})

mock.onPost('/apps/staff/add-staff').reply(config => {
  const newData = JSON.parse(config.data).data
  const avatarColors = ['primary', 'success', 'error', 'warning', 'info', 'secondary']

  const member = {
    id: nextId++,
    status: 'invited',
    joinedAt: new Date().toISOString(),
    avatarColor: avatarColors[nextId % avatarColors.length],
    ...newData
  }
  data.staff.unshift(member)

  return [201, { staff: member }]
})

mock.onPut(/\/apps\/staff\/update-staff\/\d+/).reply(config => {
  const id = Number(config.url.split('/').pop())
  const updates = JSON.parse(config.data).data
  const index = data.staff.findIndex(s => s.id === id)
  if (index === -1) return [404]
  data.staff[index] = { ...data.staff[index], ...updates }

  return [200, { staff: data.staff[index] }]
})

mock.onDelete('/apps/staff/delete').reply(config => {
  const id = Number(config.data)
  data.staff = data.staff.filter(s => s.id !== id)

  return [200]
})
