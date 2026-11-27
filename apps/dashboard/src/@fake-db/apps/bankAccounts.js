// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} BankAccount
 * @property {number} id
 * @property {string} accountTitle
 * @property {string} bankName
 * @property {string} accountNumber
 * @property {string} iban
 * @property {boolean} isActive
 */

const rawAccounts = [
  {
    id: 12001,
    accountTitle: 'Zeeshan Traders (Pvt) Ltd',
    bankName: 'Meezan Bank',
    accountNumber: '0123456789012',
    iban: 'PK36MEZN0001230123456789',
    isActive: true
  },
  {
    id: 12002,
    accountTitle: 'Zeeshan Traders (Pvt) Ltd',
    bankName: 'HBL',
    accountNumber: '9876543210123',
    iban: 'PK24HABB0009879876543210',
    isActive: true
  }
]

export const data = {
  /** @type {BankAccount[]} */
  bankAccounts: rawAccounts
}

// ------------------------------------------------
// GET: Return Bank Account List
// ------------------------------------------------
mock.onGet('/apps/bank-accounts/list').reply(() => {
  return [200, { bankAccounts: data.bankAccounts, total: data.bankAccounts.length }]
})

// ------------------------------------------------
// POST: Add new Bank Account
// ------------------------------------------------
mock.onPost('/apps/bank-accounts/add').reply(config => {
  const account = JSON.parse(config.data).data
  const lastId = Math.max(...data.bankAccounts.map(a => a.id), 12000)

  const newAccount = { isActive: true, ...account, id: lastId + 1 }
  data.bankAccounts.unshift(newAccount)

  return [201, { bankAccount: newAccount }]
})

// ------------------------------------------------
// PUT: Update Bank Account
// ------------------------------------------------
mock.onPut(/\/apps\/bank-accounts\/update\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const changes = JSON.parse(config.data).data
  const index = data.bankAccounts.findIndex(a => a.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested bank account!' }]
  }
  data.bankAccounts[index] = { ...data.bankAccounts[index], ...changes, id }

  return [200, { bankAccount: data.bankAccounts[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Bank Account
// ------------------------------------------------
mock.onDelete('/apps/bank-accounts/delete').reply(config => {
  const accountId = Number(config.data)
  const index = data.bankAccounts.findIndex(a => a.id === accountId)
  if (index !== -1) {
    data.bankAccounts.splice(index, 1)
  }

  return [200]
})
