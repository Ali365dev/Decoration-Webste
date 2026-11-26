// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} Campaign
 * @property {number} id
 * @property {string} name
 * @property {'email'|'sms'|'push'} channel - Stub only, no real sending integration
 * @property {'draft'|'scheduled'|'sent'} status
 * @property {string} scheduledAt - ISO date string
 */

export const data = {
  /** @type {Campaign[]} */
  campaigns: [
    {
      id: 7301,
      name: 'Eid Collection Launch',
      channel: 'email',
      status: 'sent',
      scheduledAt: '2026-10-01T09:00:00.000Z'
    },
    {
      id: 7302,
      name: '11.11 Flash Sale Reminder',
      channel: 'sms',
      status: 'scheduled',
      scheduledAt: '2026-11-10T16:00:00.000Z'
    },
    {
      id: 7303,
      name: 'Winter Footwear Blowout Push',
      channel: 'push',
      status: 'scheduled',
      scheduledAt: '2026-11-14T10:00:00.000Z'
    },
    {
      id: 7304,
      name: 'Abandoned Cart Recovery',
      channel: 'email',
      status: 'draft',
      scheduledAt: '2026-11-20T08:00:00.000Z'
    }
  ]
}

let nextId = 7305

mock.onGet('/apps/campaigns/list').reply(() => {
  return [200, { campaigns: data.campaigns, allData: data.campaigns, total: data.campaigns.length }]
})

mock.onPost('/apps/campaigns/add-campaign').reply(config => {
  const newData = JSON.parse(config.data).data
  const campaign = { id: nextId++, status: 'draft', ...newData }
  data.campaigns.unshift(campaign)

  return [201, { campaign }]
})

mock.onPut(/\/apps\/campaigns\/update-campaign\/\d+/).reply(config => {
  const id = Number(config.url.split('/').pop())
  const updates = JSON.parse(config.data).data
  const index = data.campaigns.findIndex(c => c.id === id)
  if (index === -1) return [404]
  data.campaigns[index] = { ...data.campaigns[index], ...updates }

  return [200, { campaign: data.campaigns[index] }]
})

mock.onDelete('/apps/campaigns/delete').reply(config => {
  const id = Number(config.data)
  data.campaigns = data.campaigns.filter(c => c.id !== id)

  return [200]
})
