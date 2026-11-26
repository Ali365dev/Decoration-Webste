// ** Thin service layer over the Activity Log mock endpoints.

// ** Axios Import
import axios from 'axios'

export const getActivityLogs = async (params = {}) => {
  const response = await axios.get('/apps/activity-logs/list', { params })

  return response.data
}
