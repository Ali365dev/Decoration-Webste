// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} sku
 * @property {string} slug
 * @property {string} categoryId - References Category.id
 * @property {string[]} collectionIds - References Collection.id
 * @property {number} price - Selling price in PKR
 * @property {number} comparePrice - Original/strike-through price in PKR
 * @property {string} description
 * @property {string[]} images
 * @property {number} stock - Live stock quantity (source of truth shared with Inventory)
 * @property {'published'|'draft'|'archived'} status
 * @property {number} rating - Average rating (0-5)
 * @property {number} reviewCount
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

// ** This array is the single source of truth for product stock. The Inventory
// ** fake-db (src/@fake-db/apps/inventory.js) imports this same reference so that
// ** Products and Inventory screens never drift out of sync.
export const data = {
  /** @type {Product[]} */
  products: [
    {
      id: 3001,
      name: "Men's Slim Fit Cotton Kurta - Navy",
      sku: 'JDW-KRT-001',
      slug: 'mens-slim-fit-cotton-kurta-navy',
      categoryId: 'cat-men-kurta',
      collectionIds: ['col-eid-specials', 'col-best-sellers'],
      price: 3490,
      comparePrice: 4200,
      description:
        'Premium cotton kurta with a slim fit cut, perfect for everyday wear or festive occasions. Breathable fabric suited for the Pakistani summer.',
      images: ['/images/avatars/1.png'],
      stock: 48,
      status: 'published',
      rating: 4.5,
      reviewCount: 3,
      createdAt: '2026-08-01T09:00:00.000Z',
      updatedAt: '2026-10-20T09:00:00.000Z'
    },
    {
      id: 3002,
      name: 'Unstitched Lawn Suit (3 Piece) - Floral Print',
      sku: 'GUL-LWN-014',
      slug: 'unstitched-lawn-suit-3-piece-floral-print',
      categoryId: 'cat-women-lawn',
      collectionIds: ['col-new-arrivals'],
      price: 4950,
      comparePrice: 5800,
      description: 'Lightweight unstitched lawn fabric with digital floral print, includes shirt, dupatta and trouser.',
      images: ['/images/avatars/2.png'],
      stock: 6,
      status: 'published',
      rating: 4.2,
      reviewCount: 2,
      createdAt: '2026-09-05T09:00:00.000Z',
      updatedAt: '2026-10-28T09:00:00.000Z'
    },
    {
      id: 3003,
      name: 'Tempered Glass Screen Protector - Universal 6.5"',
      sku: 'MOB-ACC-221',
      slug: 'tempered-glass-screen-protector-universal',
      categoryId: 'cat-mobile-accessories',
      collectionIds: ['col-best-sellers'],
      price: 350,
      comparePrice: 500,
      description: 'Anti-scratch 9H hardness tempered glass compatible with most 6.5 inch smartphones.',
      images: ['/images/avatars/3.png'],
      stock: 230,
      status: 'published',
      rating: 4.0,
      reviewCount: 5,
      createdAt: '2026-07-10T09:00:00.000Z',
      updatedAt: '2026-10-15T09:00:00.000Z'
    },
    {
      id: 3004,
      name: '20000mAh Fast Charging Power Bank',
      sku: 'MOB-ACC-098',
      slug: '20000mah-fast-charging-power-bank',
      categoryId: 'cat-mobile-accessories',
      collectionIds: [],
      price: 6500,
      comparePrice: 7800,
      description: 'Dual-port 20000mAh power bank with 22.5W fast charging, ideal for travel.',
      images: ['/images/avatars/4.png'],
      stock: 4,
      status: 'published',
      rating: 4.7,
      reviewCount: 4,
      createdAt: '2026-08-18T09:00:00.000Z',
      updatedAt: '2026-10-29T09:00:00.000Z'
    },
    {
      id: 3005,
      name: 'Non-Stick Cooking Pot Set (3 Piece)',
      sku: 'HMK-KTN-034',
      slug: 'non-stick-cooking-pot-set-3-piece',
      categoryId: 'cat-kitchen-appliances',
      collectionIds: ['col-best-sellers'],
      price: 8900,
      comparePrice: 10500,
      description: 'Durable non-stick coated cooking pots in three sizes, suitable for gas and induction stoves.',
      images: ['/images/avatars/5.png'],
      stock: 17,
      status: 'published',
      rating: 4.3,
      reviewCount: 2,
      createdAt: '2026-06-22T09:00:00.000Z',
      updatedAt: '2026-10-05T09:00:00.000Z'
    },
    {
      id: 3006,
      name: 'Electric Kettle 1.8L - Stainless Steel',
      sku: 'HMK-KTN-057',
      slug: 'electric-kettle-1-8l-stainless-steel',
      categoryId: 'cat-kitchen-appliances',
      collectionIds: [],
      price: 3200,
      comparePrice: 3800,
      description: 'Auto shut-off electric kettle with stainless steel body, 1.8 litre capacity.',
      images: ['/images/avatars/6.png'],
      stock: 0,
      status: 'published',
      rating: 3.8,
      reviewCount: 1,
      createdAt: '2026-05-14T09:00:00.000Z',
      updatedAt: '2026-10-30T09:00:00.000Z'
    },
    {
      id: 3007,
      name: 'Hand-Painted Wall Clock - Truck Art',
      sku: 'HMK-DEC-012',
      slug: 'hand-painted-wall-clock-truck-art',
      categoryId: 'cat-home-decor',
      collectionIds: ['col-new-arrivals'],
      price: 2750,
      comparePrice: 3200,
      description: 'Handcrafted wooden wall clock painted in traditional Pakistani truck art style.',
      images: ['/images/avatars/7.png'],
      stock: 12,
      status: 'published',
      rating: 4.9,
      reviewCount: 2,
      createdAt: '2026-09-01T09:00:00.000Z',
      updatedAt: '2026-10-22T09:00:00.000Z'
    },
    {
      id: 3008,
      name: 'Matte Lipstick - Shade "Lahore Rose"',
      sku: 'BTY-LIP-009',
      slug: 'matte-lipstick-lahore-rose',
      categoryId: 'cat-beauty',
      collectionIds: ['col-eid-specials'],
      price: 650,
      comparePrice: 800,
      description: 'Long-lasting matte lipstick, transfer-proof formula, dermatologically tested.',
      images: ['/images/avatars/8.png'],
      stock: 85,
      status: 'published',
      rating: 4.4,
      reviewCount: 3,
      createdAt: '2026-07-28T09:00:00.000Z',
      updatedAt: '2026-10-18T09:00:00.000Z'
    },
    {
      id: 3009,
      name: 'Herbal Face Wash with Neem Extract',
      sku: 'BTY-SKN-044',
      slug: 'herbal-face-wash-neem-extract',
      categoryId: 'cat-beauty',
      collectionIds: [],
      price: 480,
      comparePrice: 550,
      description: 'Gentle daily face wash formulated with neem extract for oil control and clear skin.',
      images: ['/images/avatars/1.png'],
      stock: 3,
      status: 'published',
      rating: 4.1,
      reviewCount: 2,
      createdAt: '2026-08-09T09:00:00.000Z',
      updatedAt: '2026-10-25T09:00:00.000Z'
    },
    {
      id: 3010,
      name: "Men's Peshawari Chappal - Brown Leather",
      sku: 'FTW-MEN-073',
      slug: 'mens-peshawari-chappal-brown-leather',
      categoryId: 'cat-men-footwear',
      collectionIds: ['col-best-sellers'],
      price: 2990,
      comparePrice: 3500,
      description: 'Handmade genuine leather Peshawari chappal with cushioned sole for all-day comfort.',
      images: ['/images/avatars/2.png'],
      stock: 22,
      status: 'published',
      rating: 4.6,
      reviewCount: 4,
      createdAt: '2026-06-30T09:00:00.000Z',
      updatedAt: '2026-10-12T09:00:00.000Z'
    },
    {
      id: 3011,
      name: "Women's Embroidered Khussa - Gold",
      sku: 'FTW-WMN-028',
      slug: 'womens-embroidered-khussa-gold',
      categoryId: 'cat-women-footwear',
      collectionIds: ['col-eid-specials', 'col-new-arrivals'],
      price: 2450,
      comparePrice: 2900,
      description: 'Traditional hand-embroidered khussa with cushioned insole, perfect for festive wear.',
      images: ['/images/avatars/3.png'],
      stock: 5,
      status: 'published',
      rating: 4.8,
      reviewCount: 3,
      createdAt: '2026-09-12T09:00:00.000Z',
      updatedAt: '2026-10-27T09:00:00.000Z'
    },
    {
      id: 3012,
      name: "Men's Formal Shalwar Kameez - Grey",
      sku: 'JDW-SKZ-056',
      slug: 'mens-formal-shalwar-kameez-grey',
      categoryId: 'cat-men-kurta',
      collectionIds: [],
      price: 4290,
      comparePrice: 4990,
      description: 'Formal stitched shalwar kameez in premium blended fabric, suitable for office and events.',
      images: ['/images/avatars/4.png'],
      stock: 14,
      status: 'draft',
      rating: 0,
      reviewCount: 0,
      createdAt: '2026-10-25T09:00:00.000Z',
      updatedAt: '2026-10-25T09:00:00.000Z'
    },
    {
      id: 3013,
      name: 'Abaya - Nida Fabric with Embroidered Border',
      sku: 'WMN-ABY-019',
      slug: 'abaya-nida-fabric-embroidered-border',
      categoryId: 'cat-women-abaya',
      collectionIds: ['col-new-arrivals'],
      price: 5490,
      comparePrice: 6200,
      description: 'Elegant flowy abaya stitched from premium Nida fabric with embroidered sleeve border.',
      images: ['/images/avatars/5.png'],
      stock: 9,
      status: 'published',
      rating: 4.3,
      reviewCount: 2,
      createdAt: '2026-08-30T09:00:00.000Z',
      updatedAt: '2026-10-24T09:00:00.000Z'
    },
    {
      id: 3014,
      name: 'Wireless Bluetooth Earbuds - Pro',
      sku: 'MOB-ACC-187',
      slug: 'wireless-bluetooth-earbuds-pro',
      categoryId: 'cat-mobile-accessories',
      collectionIds: ['col-best-sellers', 'col-new-arrivals'],
      price: 3990,
      comparePrice: 5200,
      description: 'In-ear wireless earbuds with ANC, 24-hour battery life with charging case.',
      images: ['/images/avatars/6.png'],
      stock: 41,
      status: 'published',
      rating: 4.2,
      reviewCount: 3,
      createdAt: '2026-07-02T09:00:00.000Z',
      updatedAt: '2026-10-21T09:00:00.000Z'
    },
    {
      id: 3015,
      name: 'Air Fryer 4.5L Digital',
      sku: 'HMK-KTN-081',
      slug: 'air-fryer-4-5l-digital',
      categoryId: 'cat-kitchen-appliances',
      collectionIds: ['col-new-arrivals'],
      price: 15900,
      comparePrice: 18500,
      description: 'Digital air fryer with 4.5 litre basket, 8 preset cooking modes, low oil frying.',
      images: ['/images/avatars/7.png'],
      stock: 2,
      status: 'published',
      rating: 4.6,
      reviewCount: 2,
      createdAt: '2026-09-20T09:00:00.000Z',
      updatedAt: '2026-10-29T09:00:00.000Z'
    },
    {
      id: 3016,
      name: 'Embroidered Cushion Cover Set (5 Piece)',
      sku: 'HMK-DEC-063',
      slug: 'embroidered-cushion-cover-set-5-piece',
      categoryId: 'cat-home-decor',
      collectionIds: [],
      price: 2100,
      comparePrice: 2600,
      description: 'Set of 5 embroidered cushion covers, machine washable, zip closure.',
      images: ['/images/avatars/8.png'],
      stock: 33,
      status: 'published',
      rating: 4.0,
      reviewCount: 1,
      createdAt: '2026-06-05T09:00:00.000Z',
      updatedAt: '2026-10-10T09:00:00.000Z'
    },
    {
      id: 3017,
      name: 'Whitening Night Cream with Vitamin C',
      sku: 'BTY-SKN-072',
      slug: 'whitening-night-cream-vitamin-c',
      categoryId: 'cat-beauty',
      collectionIds: ['col-eid-specials'],
      price: 890,
      comparePrice: 1100,
      description: 'Overnight brightening cream enriched with Vitamin C and niacinamide.',
      images: ['/images/avatars/1.png'],
      stock: 58,
      status: 'published',
      rating: 4.1,
      reviewCount: 2,
      createdAt: '2026-07-16T09:00:00.000Z',
      updatedAt: '2026-10-19T09:00:00.000Z'
    },
    {
      id: 3018,
      name: "Men's Sports Sneakers - White",
      sku: 'FTW-MEN-104',
      slug: 'mens-sports-sneakers-white',
      categoryId: 'cat-men-footwear',
      collectionIds: ['col-new-arrivals'],
      price: 4590,
      comparePrice: 5300,
      description: 'Lightweight breathable sneakers with EVA sole, great for daily wear and light exercise.',
      images: ['/images/avatars/2.png'],
      stock: 7,
      status: 'published',
      rating: 4.4,
      reviewCount: 2,
      createdAt: '2026-08-14T09:00:00.000Z',
      updatedAt: '2026-10-26T09:00:00.000Z'
    },
    {
      id: 3019,
      name: "Women's Formal Heels - Black Suede",
      sku: 'FTW-WMN-051',
      slug: 'womens-formal-heels-black-suede',
      categoryId: 'cat-women-footwear',
      collectionIds: [],
      price: 3450,
      comparePrice: 3990,
      description: 'Elegant block heels in black suede finish, cushioned footbed for comfort.',
      images: ['/images/avatars/3.png'],
      stock: 0,
      status: 'archived',
      rating: 3.9,
      reviewCount: 1,
      createdAt: '2026-04-11T09:00:00.000Z',
      updatedAt: '2026-10-02T09:00:00.000Z'
    },
    {
      id: 3020,
      name: 'Car Mobile Holder with Wireless Charging',
      sku: 'MOB-ACC-266',
      slug: 'car-mobile-holder-wireless-charging',
      categoryId: 'cat-mobile-accessories',
      collectionIds: ['col-best-sellers'],
      price: 2890,
      comparePrice: 3400,
      description: '15W wireless fast charging car mount with automatic clamping arms.',
      images: ['/images/avatars/4.png'],
      stock: 19,
      status: 'published',
      rating: 4.3,
      reviewCount: 2,
      createdAt: '2026-09-08T09:00:00.000Z',
      updatedAt: '2026-10-23T09:00:00.000Z'
    }
  ]
}

// ------------------------------------------------
// GET: Return Product List (search/filter/sort/paginate)
// ------------------------------------------------
mock.onGet('/apps/products/list').reply(config => {
  const { q = '', status = '', categoryId = '', sortBy = 'updatedAt', sortDir = 'desc' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  let filteredData = data.products.filter(
    product =>
      (product.name.toLowerCase().includes(queryLowered) ||
        product.sku.toLowerCase().includes(queryLowered)) &&
      product.status === (status || product.status) &&
      product.categoryId === (categoryId || product.categoryId)
  )

  filteredData = filteredData.slice().sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (a[sortBy] < b[sortBy]) return -1 * dir
    if (a[sortBy] > b[sortBy]) return 1 * dir

    return 0
  })

  return [
    200,
    {
      params: config.params,
      allData: data.products,
      products: filteredData,
      total: filteredData.length
    }
  ]
})

// ------------------------------------------------
// GET: Return Single Product
// ------------------------------------------------
mock.onGet('/apps/products/single-product').reply(config => {
  const { id } = config.params
  const productData = data.products.filter(product => product.id === parseInt(id, 10))
  if (productData.length) {
    return [200, { product: productData[0] }]
  } else {
    return [404, { message: 'Unable to find the requested product!' }]
  }
})

// ------------------------------------------------
// POST: Add new Product
// ------------------------------------------------
mock.onPost('/apps/products/add-product').reply(config => {
  const product = JSON.parse(config.data).data
  const lastId = Math.max(...data.products.map(p => p.id), 3000)
  const now = new Date().toISOString()

  const newProduct = {
    rating: 0,
    reviewCount: 0,
    images: [],
    collectionIds: [],
    status: 'draft',
    stock: 0,
    ...product,
    id: lastId + 1,
    createdAt: now,
    updatedAt: now
  }
  data.products.unshift(newProduct)

  return [201, { product: newProduct }]
})

// ------------------------------------------------
// PUT: Update Product
// ------------------------------------------------
mock.onPut(/\/apps\/products\/update-product\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const changes = JSON.parse(config.data).data
  const index = data.products.findIndex(p => p.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested product!' }]
  }
  data.products[index] = { ...data.products[index], ...changes, id, updatedAt: new Date().toISOString() }

  return [200, { product: data.products[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Product
// ------------------------------------------------
mock.onDelete('/apps/products/delete').reply(config => {
  const productId = Number(config.data)
  const productIndex = data.products.findIndex(p => p.id === productId)
  if (productIndex !== -1) {
    data.products.splice(productIndex, 1)
  }

  return [200]
})
