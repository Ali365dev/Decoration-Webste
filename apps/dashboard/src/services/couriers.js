// ** Thin service layer over the Courier mock endpoints.
import axios from 'axios'

export const getCouriers = async (params = {}) => {
  const response = await axios.get('/apps/couriers/list', { params })

  return response.data
}

export const createCourier = async data => {
  const response = await axios.post('/apps/couriers/add', { data })

  return response.data.courier
}

export const updateCourier = async (id, data) => {
  const response = await axios.put(`/apps/couriers/update/${id}`, { data })

  return response.data.courier
}

export const deleteCourier = async id => {
  const response = await axios.delete('/apps/couriers/delete', { data: id })

  return response.data
}
