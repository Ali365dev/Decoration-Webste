// ** Thin service layer over the Shipment + TrackingEvent mock endpoints.
import axios from 'axios'

export const getShipments = async (params = {}) => {
  const response = await axios.get('/apps/shipments/list', { params })

  return response.data
}

export const getShipmentById = async id => {
  const response = await axios.get('/apps/shipments/single', { params: { id } })

  return response.data.shipment
}

export const getShipmentByOrderId = async orderId => {
  const response = await axios.get('/apps/shipments/single', { params: { orderId } })

  return response.data.shipment
}

export const getTrackingEvents = async shipmentId => {
  const response = await axios.get('/apps/shipments/tracking', { params: { shipmentId } })

  return response.data.events
}

/**
 * @param {{orderId: number, courierId: number, trackingNumber?: string}} data
 */
export const createShipment = async data => {
  const response = await axios.post('/apps/shipments/create', { data })

  return response.data.shipment
}

/**
 * @param {number|string} id
 * @param {Object} data
 */
export const updateShipment = async (id, data) => {
  const response = await axios.put(`/apps/shipments/update/${id}`, { data })

  return response.data.shipment
}
