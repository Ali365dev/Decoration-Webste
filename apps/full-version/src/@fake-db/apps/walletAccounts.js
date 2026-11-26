// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} WalletAccount
 * @property {number} id
 * @property {string} accountTitle
 * @property {'Easypaisa'|'JazzCash'|'SadaPay'} provider
 * @property {string} walletNumber
 * @property {boolean} isActive
 */

const rawAccounts = [
  { id: 12101, accountTitle: 'Zeeshan Traders', provider: 'Easypaisa', walletNumber: '0300-1234567', isActive: true },
  { id: 12102, accountTitle: 'Zeeshan Traders', provider: 'JazzCash', walletNumber: '0301-7654321', isActive: true },
  { id: 12103, accountTitle: 'Zeeshan Traders', provider: 'SadaPay', walletNumber: '0333-9988776', isActive: false }
]

export const data = {
  /** @type {WalletAccount[]} */
  walletAccounts: rawAccounts
}

// ------------------------------------------------
// GET: Return Wallet Account List
// ------------------------------------------------
mock.onGet('/apps/wallet-accounts/list').reply(() => {
  return [200, { walletAccounts: data.walletAccounts, total: data.walletAccounts.length }]
})

// ------------------------------------------------
// POST: Add new Wallet Account
// ------------------------------------------------
mock.onPost('/apps/wallet-accounts/add').reply(config => {
  const account = JSON.parse(config.data).data
  const lastId = Math.max(...data.walletAccounts.map(a => a.id), 12100)

  const newAccount = { isActive: true, ...account, id: lastId + 1 }
  data.walletAccounts.unshift(newAccount)

  return [201, { walletAccount: newAccount }]
})

// ------------------------------------------------
// PUT: Update Wallet Account
// ------------------------------------------------
mock.onPut(/\/apps\/wallet-accounts\/update\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const changes = JSON.parse(config.data).data
  const index = data.walletAccounts.findIndex(a => a.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested wallet account!' }]
  }
  data.walletAccounts[index] = { ...data.walletAccounts[index], ...changes, id }

  return [200, { walletAccount: data.walletAccounts[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Wallet Account
// ------------------------------------------------
mock.onDelete('/apps/wallet-accounts/delete').reply(config => {
  const accountId = Number(config.data)
  const index = data.walletAccounts.findIndex(a => a.id === accountId)
  if (index !== -1) {
    data.walletAccounts.splice(index, 1)
  }

  return [200]
})
