// ** Thin service layer over the Wallet Account (Easypaisa/JazzCash/SadaPay) config mock endpoints.
import axios from 'axios'

export const getWalletAccounts = async () => {
  const response = await axios.get('/apps/wallet-accounts/list')

  return response.data
}

export const createWalletAccount = async data => {
  const response = await axios.post('/apps/wallet-accounts/add', { data })

  return response.data.walletAccount
}

export const updateWalletAccount = async (id, data) => {
  const response = await axios.put(`/apps/wallet-accounts/update/${id}`, { data })

  return response.data.walletAccount
}

export const deleteWalletAccount = async id => {
  const response = await axios.delete('/apps/wallet-accounts/delete', { data: id })

  return response.data
}
