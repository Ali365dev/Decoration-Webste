// ** Thin service layer over the Review mock endpoints.
import axios from 'axios'

export const getReviews = async (params = {}) => {
  const response = await axios.get('/apps/reviews/list', { params })

  return response.data
}

export const updateReviewStatus = async (id, status) => {
  const response = await axios.put(`/apps/reviews/update-status/${id}`, { data: { status } })

  return response.data.review
}

export const replyToReview = async (id, adminReply) => {
  const response = await axios.put(`/apps/reviews/reply/${id}`, { data: { adminReply } })

  return response.data.review
}

export const deleteReview = async id => {
  const response = await axios.delete('/apps/reviews/delete', { data: id })

  return response.data
}
