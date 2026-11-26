// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Reference data - sent newsletters are recorded as Campaign-like records on the Campaigns entity
import { data as campaignsData } from 'src/@fake-db/apps/campaigns'

/**
 * @typedef {Object} NewsletterSubscriber
 * @property {number} id
 * @property {string} email
 * @property {string} subscribedAt - ISO date string
 * @property {boolean} isActive
 */

export const data = {
  /** @type {NewsletterSubscriber[]} */
  subscribers: [
    { id: 7401, email: 'ahmed.raza@example.pk', subscribedAt: '2026-04-12T10:00:00.000Z', isActive: true },
    { id: 7402, email: 'ayesha.khan@example.pk', subscribedAt: '2026-05-02T10:00:00.000Z', isActive: true },
    { id: 7403, email: 'bilal.hussain@example.pk', subscribedAt: '2026-05-20T10:00:00.000Z', isActive: true },
    { id: 7404, email: 'sana.tariq@example.pk', subscribedAt: '2026-06-01T10:00:00.000Z', isActive: false },
    { id: 7405, email: 'usman.malik@example.pk', subscribedAt: '2026-06-18T10:00:00.000Z', isActive: true },
    { id: 7406, email: 'fatima.noor@example.pk', subscribedAt: '2026-07-04T10:00:00.000Z', isActive: true }
  ]
}

let nextSubscriberId = 7407
let nextCampaignId = 7310

mock.onGet('/apps/newsletter/subscribers').reply(() => {
  return [200, { subscribers: data.subscribers, allData: data.subscribers, total: data.subscribers.length }]
})

mock.onPost('/apps/newsletter/subscribe').reply(config => {
  const { email } = JSON.parse(config.data).data
  const subscriber = { id: nextSubscriberId++, email, subscribedAt: new Date().toISOString(), isActive: true }
  data.subscribers.unshift(subscriber)

  return [201, { subscriber }]
})

mock.onPut(/\/apps\/newsletter\/subscribers\/\d+/).reply(config => {
  const id = Number(config.url.split('/').pop())
  const updates = JSON.parse(config.data).data
  const index = data.subscribers.findIndex(s => s.id === id)
  if (index === -1) return [404]
  data.subscribers[index] = { ...data.subscribers[index], ...updates }

  return [200, { subscriber: data.subscribers[index] }]
})

mock.onDelete('/apps/newsletter/subscribers/delete').reply(config => {
  const id = Number(config.data)
  data.subscribers = data.subscribers.filter(s => s.id !== id)

  return [200]
})

// ------------------------------------------------
// POST: Compose/Send - stub, no real email sending. Records a Campaign-like
// entry on the Campaigns entity (channel: 'email') so it shows up alongside
// other marketing campaigns.
// ------------------------------------------------
mock.onPost('/apps/newsletter/send').reply(config => {
  const { subject } = JSON.parse(config.data).data

  const campaign = {
    id: nextCampaignId++,
    name: subject,
    channel: 'email',
    status: 'sent',
    scheduledAt: new Date().toISOString()
  }
  campaignsData.campaigns.unshift(campaign)

  return [201, { campaign }]
})
