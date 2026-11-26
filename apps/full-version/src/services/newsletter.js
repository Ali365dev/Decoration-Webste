// ** Thin service layer over the Newsletter mock endpoints.

// ** Axios Import
import axios from 'axios'

export const getSubscribers = async () => {
  const response = await axios.get('/apps/newsletter/subscribers')

  return response.data
}

export const subscribe = async email => {
  const response = await axios.post('/apps/newsletter/subscribe', { data: { email } })

  return response.data.subscriber
}

export const updateSubscriber = async (id, data) => {
  const response = await axios.put(`/apps/newsletter/subscribers/${id}`, { data })

  return response.data.subscriber
}

export const deleteSubscriber = async id => {
  const response = await axios.delete('/apps/newsletter/subscribers/delete', { data: id })

  return response.data
}

/**
 * Stub "compose/send" - no real email sending, just creates a Campaign-like record.
 * @param {{subject: string, body: string}} data
 */
export const sendNewsletter = async data => {
  const response = await axios.post('/apps/newsletter/send', { data })

  return response.data.campaign
}
