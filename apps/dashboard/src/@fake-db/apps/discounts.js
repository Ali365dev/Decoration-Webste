// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} Discount
 * @property {number} id
 * @property {string} name
 * @property {'product'|'category'} scope
 * @property {string|number} targetId - References Product.id (number) or Category.id (string), depending on scope
 * @property {string} targetLabel - Denormalized product/category name
 * @property {number} percent - Discount percentage (0-100)
 * @property {boolean} isActive
 */

export const data = {
  /** @type {Discount[]} */
  discounts: [
    {
      id: 7101,
      name: 'Kurta Season Discount',
      scope: 'category',
      targetId: 'cat-men-kurta',
      targetLabel: 'Kurta & Shalwar Kameez',
      percent: 15,
      isActive: true
    },
    {
      id: 7102,
      name: 'Mobile Accessories Clearance',
      scope: 'category',
      targetId: 'cat-mobile-accessories',
      targetLabel: 'Mobile Accessories',
      percent: 20,
      isActive: true
    },
    {
      id: 7103,
      name: 'Air Fryer Promo',
      scope: 'product',
      targetId: 3015,
      targetLabel: 'Air Fryer 4.5L Digital',
      percent: 10,
      isActive: true
    },
    {
      id: 7104,
      name: 'Footwear End of Season',
      scope: 'category',
      targetId: 'cat-footwear',
      targetLabel: 'Footwear',
      percent: 30,
      isActive: false
    }
  ]
}

let nextId = 7105

mock.onGet('/apps/discounts/list').reply(() => {
  return [200, { discounts: data.discounts, allData: data.discounts, total: data.discounts.length }]
})

mock.onPost('/apps/discounts/add-discount').reply(config => {
  const newData = JSON.parse(config.data).data
  const discount = { id: nextId++, isActive: true, ...newData }
  data.discounts.unshift(discount)

  return [201, { discount }]
})

mock.onPut(/\/apps\/discounts\/update-discount\/\d+/).reply(config => {
  const id = Number(config.url.split('/').pop())
  const updates = JSON.parse(config.data).data
  const index = data.discounts.findIndex(d => d.id === id)
  if (index === -1) return [404]
  data.discounts[index] = { ...data.discounts[index], ...updates }

  return [200, { discount: data.discounts[index] }]
})

mock.onDelete('/apps/discounts/delete').reply(config => {
  const id = Number(config.data)
  data.discounts = data.discounts.filter(d => d.id !== id)

  return [200]
})
