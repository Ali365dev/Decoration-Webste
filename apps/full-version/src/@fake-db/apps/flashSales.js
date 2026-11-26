// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} FlashSale
 * @property {number} id
 * @property {string} name
 * @property {number[]} productIds - References Product.id
 * @property {number} discountPercent
 * @property {string} startsAt - ISO date string
 * @property {string} endsAt - ISO date string
 * @property {boolean} isActive
 */

export const data = {
  /** @type {FlashSale[]} */
  flashSales: [
    {
      id: 7201,
      name: '11.11 Flash Sale',
      productIds: [3004, 3014, 3020],
      discountPercent: 30,
      startsAt: '2026-11-11T00:00:00.000Z',
      endsAt: '2026-11-12T00:00:00.000Z',
      isActive: false
    },
    {
      id: 7202,
      name: 'Winter Footwear Blowout',
      productIds: [3010, 3011, 3018, 3019],
      discountPercent: 25,
      startsAt: '2026-11-15T00:00:00.000Z',
      endsAt: '2026-11-18T00:00:00.000Z',
      isActive: true
    },
    {
      id: 7203,
      name: 'Kitchen Essentials Weekend',
      productIds: [3005, 3006, 3015],
      discountPercent: 20,
      startsAt: '2026-11-20T00:00:00.000Z',
      endsAt: '2026-11-22T00:00:00.000Z',
      isActive: true
    }
  ]
}

let nextId = 7204

mock.onGet('/apps/flash-sales/list').reply(() => {
  return [200, { flashSales: data.flashSales, allData: data.flashSales, total: data.flashSales.length }]
})

mock.onPost('/apps/flash-sales/add-flash-sale').reply(config => {
  const newData = JSON.parse(config.data).data
  const flashSale = { id: nextId++, isActive: true, ...newData }
  data.flashSales.unshift(flashSale)

  return [201, { flashSale }]
})

mock.onPut(/\/apps\/flash-sales\/update-flash-sale\/\d+/).reply(config => {
  const id = Number(config.url.split('/').pop())
  const updates = JSON.parse(config.data).data
  const index = data.flashSales.findIndex(f => f.id === id)
  if (index === -1) return [404]
  data.flashSales[index] = { ...data.flashSales[index], ...updates }

  return [200, { flashSale: data.flashSales[index] }]
})

mock.onDelete('/apps/flash-sales/delete').reply(config => {
  const id = Number(config.data)
  data.flashSales = data.flashSales.filter(f => f.id !== id)

  return [200]
})
