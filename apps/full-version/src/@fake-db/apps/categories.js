// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string|null} parentId - References another Category.id, or null for a top-level category
 * @property {number} productCount
 */

const data = {
  /** @type {Category[]} */
  categories: [
    { id: 'cat-men', name: "Men's Clothing", parentId: null, productCount: 2, image: '/images/categories/mens-clothing.jpg', slug: 'mens-clothing', status: 'published' },
    { id: 'cat-men-kurta', name: 'Kurta & Shalwar Kameez', parentId: 'cat-men', productCount: 2, image: '/images/categories/kurta.jpg', slug: 'kurta-shalwar-kameez', status: 'published' },
    { id: 'cat-women', name: "Women's Clothing", parentId: null, productCount: 2, image: '/images/categories/womens-clothing.jpg', slug: 'womens-clothing', status: 'published' },
    { id: 'cat-women-lawn', name: 'Lawn Suits', parentId: 'cat-women', productCount: 1, image: null, slug: 'lawn-suits', status: 'published' },
    { id: 'cat-women-abaya', name: 'Abayas', parentId: 'cat-women', productCount: 1, image: null, slug: 'abayas', status: 'published' },
    { id: 'cat-mobile-accessories', name: 'Mobile Accessories', parentId: null, productCount: 4, image: null, slug: 'mobile-accessories', status: 'published' },
    { id: 'cat-home-kitchen', name: 'Home & Kitchen', parentId: null, productCount: 0, image: null, slug: 'home-kitchen', status: 'published' },
    { id: 'cat-kitchen-appliances', name: 'Kitchen Appliances', parentId: 'cat-home-kitchen', productCount: 3, image: null, slug: 'kitchen-appliances', status: 'published' },
    { id: 'cat-home-decor', name: 'Home Decor', parentId: 'cat-home-kitchen', productCount: 2, image: null, slug: 'home-decor', status: 'published' },
    { id: 'cat-beauty', name: 'Beauty & Personal Care', parentId: null, productCount: 3, image: null, slug: 'beauty-personal-care', status: 'published' },
    { id: 'cat-footwear', name: 'Footwear', parentId: null, productCount: 0, image: null, slug: 'footwear', status: 'draft' },
    { id: 'cat-men-footwear', name: "Men's Footwear", parentId: 'cat-footwear', productCount: 2, image: null, slug: 'mens-footwear', status: 'published' },
    { id: 'cat-women-footwear', name: "Women's Footwear", parentId: 'cat-footwear', productCount: 2, image: null, slug: 'womens-footwear', status: 'published' }
  ]
}

// ------------------------------------------------
// GET: Return Category List (flat, consumers build the tree)
// ------------------------------------------------
mock.onGet('/apps/categories/list').reply(config => {
  const { q = '', status = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  const filteredData = data.categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(queryLowered)
    const matchesStatus = status ? category.status === status : true
    return matchesSearch && matchesStatus
  })

  return [200, { categories: filteredData, allData: data.categories, total: filteredData.length }]
})

// ------------------------------------------------
// POST: Add new Category
// ------------------------------------------------
mock.onPost('/apps/categories/add-category').reply(config => {
  const category = JSON.parse(config.data).data
  const id = `cat-${Date.now()}`
  const newCategory = { productCount: 0, parentId: null, ...category, id }
  data.categories.push(newCategory)

  return [201, { category: newCategory }]
})

// ------------------------------------------------
// PUT: Update Category
// ------------------------------------------------
mock.onPut(/\/apps\/categories\/update-category\/.+/).reply(config => {
  const id = config.url.split('/').pop()
  const changes = JSON.parse(config.data).data
  const index = data.categories.findIndex(c => c.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested category!' }]
  }
  data.categories[index] = { ...data.categories[index], ...changes, id }

  return [200, { category: data.categories[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Category
// ------------------------------------------------
mock.onDelete('/apps/categories/delete').reply(config => {
  const categoryId = config.data
  const index = data.categories.findIndex(c => c.id === categoryId)
  if (index !== -1) {
    data.categories.splice(index, 1)
  }

  return [200]
})
