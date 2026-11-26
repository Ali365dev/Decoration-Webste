// ** Thin service layer over the Bank Account config mock endpoints.
import axios from 'axios'

export const getBankAccounts = async () => {
  const response = await axios.get('/apps/bank-accounts/list')

  return response.data
}

export const createBankAccount = async data => {
  const response = await axios.post('/apps/bank-accounts/add', { data })

  return response.data.bankAccount
}

export const updateBankAccount = async (id, data) => {
  const response = await axios.put(`/apps/bank-accounts/update/${id}`, { data })

  return response.data.bankAccount
}

export const deleteBankAccount = async id => {
  const response = await axios.delete('/apps/bank-accounts/delete', { data: id })

  return response.data
}
