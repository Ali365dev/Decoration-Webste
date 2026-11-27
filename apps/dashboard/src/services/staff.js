// ** Thin service layer over the Staff mock endpoints.

// ** Axios Import
import axios from 'axios'

export const getStaff = async (params = {}) => {
  const response = await axios.get('/apps/staff/list', { params })

  return response.data
}

export const createStaff = async data => {
  const response = await axios.post('/apps/staff/add-staff', { data })

  return response.data.staff
}

export const updateStaff = async (id, data) => {
  const response = await axios.put(`/apps/staff/update-staff/${id}`, { data })

  return response.data.staff
}

export const deleteStaff = async id => {
  const response = await axios.delete('/apps/staff/delete', { data: id })

  return response.data
}
