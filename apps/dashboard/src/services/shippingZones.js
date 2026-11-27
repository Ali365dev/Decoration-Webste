// ** Thin service layer over the Shipping Zone mock endpoints (also serves the
// ** Delivery Charges screen - deliveryCharge lives on the Zone record, see Phase 6 notes).
import axios from 'axios'

export const getShippingZones = async (params = {}) => {
  const response = await axios.get('/apps/shipping-zones/list', { params })

  return response.data
}

export const createShippingZone = async data => {
  const response = await axios.post('/apps/shipping-zones/add', { data })

  return response.data.zone
}

export const updateShippingZone = async (id, data) => {
  const response = await axios.put(`/apps/shipping-zones/update/${id}`, { data })

  return response.data.zone
}

export const deleteShippingZone = async id => {
  const response = await axios.delete('/apps/shipping-zones/delete', { data: id })

  return response.data
}
