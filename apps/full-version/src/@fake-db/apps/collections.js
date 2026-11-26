// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} Collection
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number[]} productIds - References Product.id
 * @property {'active'|'inactive'} status
 * @property {string} createdAt - ISO date string
 */

const data = {
  /** @type {Collection[]} */
  collections: [
    {
      id: 'col-eid-specials',
      name: 'Eid Specials',
      description: 'Curated picks for Eid shopping across clothing, footwear and beauty.',
      productIds: [3001, 3008, 3011, 3013, 3017],
      status: 'active',
      createdAt: '2026-09-01T09:00:00.000Z'
    },
    {
      id: 'col-best-sellers',
      name: 'Best Sellers',
      description: 'Our most frequently ordered products across all categories.',
      productIds: [3001, 3003, 3005, 3010, 3014, 3020],
      status: 'active',
      createdAt: '2026-06-01T09:00:00.000Z'
    },
    {
      id: 'col-new-arrivals',
      name: 'New Arrivals',
      description: 'Freshly added products from the last 60 days.',
      productIds: [3002, 3007, 3011, 3013, 3014, 3015, 3018],
      status: 'active',
      createdAt: '2026-08-15T09:00:00.000Z'
    },
    {
      id: 'col-winter-2026',
      name: 'Winter Collection 2026',
      description: 'Seasonal winter wear and accessories (upcoming, not yet published).',
      productIds: [],
      status: 'inactive',
      createdAt: '2026-10-29T09:00:00.000Z'
    }
  ]
}

// ------------------------------------------------
// GET: Return Collection List
// ------------------------------------------------
mock.onGet('/apps/collections/list').reply(config => {
  const { q = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  const filteredData = data.collections.filter(collection => collection.name.toLowerCase().includes(queryLowered))

  return [200, { collections: filteredData, allData: data.collections, total: filteredData.length }]
})

// ------------------------------------------------
// POST: Add new Collection
// ------------------------------------------------
mock.onPost('/apps/collections/add-collection').reply(config => {
  const collection = JSON.parse(config.data).data
  const id = `col-${Date.now()}`

  const newCollection = {
    productIds: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    ...collection,
    id
  }
  data.collections.unshift(newCollection)

  return [201, { collection: newCollection }]
})

// ------------------------------------------------
// PUT: Update Collection
// ------------------------------------------------
mock.onPut(/\/apps\/collections\/update-collection\/.+/).reply(config => {
  const id = config.url.split('/').pop()
  const changes = JSON.parse(config.data).data
  const index = data.collections.findIndex(c => c.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested collection!' }]
  }
  data.collections[index] = { ...data.collections[index], ...changes, id }

  return [200, { collection: data.collections[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Collection
// ------------------------------------------------
mock.onDelete('/apps/collections/delete').reply(config => {
  const collectionId = config.data
  const index = data.collections.findIndex(c => c.id === collectionId)
  if (index !== -1) {
    data.collections.splice(index, 1)
  }

  return [200]
})
