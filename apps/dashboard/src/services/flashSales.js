// ** Thin service layer over the Flash Sale mock endpoints.

// ** Axios Import
import axios from 'axios'

export const getFlashSales = async () => {
  const response = await axios.get('/apps/flash-sales/list')

  return response.data
}

export const createFlashSale = async data => {
  const response = await axios.post('/apps/flash-sales/add-flash-sale', { data })

  return response.data.flashSale
}

export const updateFlashSale = async (id, data) => {
  const response = await axios.put(`/apps/flash-sales/update-flash-sale/${id}`, { data })

  return response.data.flashSale
}

export const deleteFlashSale = async id => {
  const response = await axios.delete('/apps/flash-sales/delete', { data: id })

  return response.data
}
