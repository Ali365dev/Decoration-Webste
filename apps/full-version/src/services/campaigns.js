// ** Thin service layer over the Campaign mock endpoints.

// ** Axios Import
import axios from 'axios'

export const getCampaigns = async () => {
  const response = await axios.get('/apps/campaigns/list')

  return response.data
}

export const createCampaign = async data => {
  const response = await axios.post('/apps/campaigns/add-campaign', { data })

  return response.data.campaign
}

export const updateCampaign = async (id, data) => {
  const response = await axios.put(`/apps/campaigns/update-campaign/${id}`, { data })

  return response.data.campaign
}

export const deleteCampaign = async id => {
  const response = await axios.delete('/apps/campaigns/delete', { data: id })

  return response.data
}
