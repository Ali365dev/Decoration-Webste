// ** Thin service layer over the Store Settings mock endpoint.

// ** Axios Import
import axios from 'axios'

/**
 * @returns {Promise<{settings: import('./types').StoreSettings}>}
 */
export const getSettings = async () => {
  const response = await axios.get('/apps/settings')

  return response.data.settings
}

/**
 * @param {Partial<import('./types').StoreSettings>} data - Partial update, merged per-section
 */
export const updateSettings = async data => {
  const response = await axios.put('/apps/settings', { data })

  return response.data.settings
}
