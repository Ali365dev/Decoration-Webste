// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Product data import - Inventory reads/writes the SAME product records so that
// ** stock counts on Products, Inventory, Low Stock and Stock History never drift apart.
import { data as productData } from 'src/@fake-db/apps/products'

/**
 * @typedef {Object} InventoryRecord
 * @property {number} productId - References Product.id
 * @property {string} sku
 * @property {string} productName
 * @property {number} stock - Live stock quantity (mirrors Product.stock)
 * @property {number} reorderLevel - Threshold below which the product is "low stock"
 */

/**
 * @typedef {Object} StockMovement
 * @property {number} id
 * @property {number} productId - References Product.id
 * @property {string} productName
 * @property {'restock'|'sale'|'adjustment'|'return'} type
 * @property {number} quantity - Positive for stock in, negative for stock out
 * @property {string} reason
 * @property {number} resultingStock - Product.stock value right after this movement
 * @property {string} createdAt - ISO date string
 */

const LOW_STOCK_THRESHOLD = 10

const movements = {
  /** @type {StockMovement[]} */
  log: [
    {
      id: 1,
      productId: 3001,
      productName: "Men's Slim Fit Cotton Kurta - Navy",
      type: 'restock',
      quantity: 50,
      reason: 'Initial stock-in from Karachi warehouse',
      resultingStock: 50,
      createdAt: '2026-08-01T09:00:00.000Z'
    },
    {
      id: 2,
      productId: 3001,
      productName: "Men's Slim Fit Cotton Kurta - Navy",
      type: 'sale',
      quantity: -2,
      reason: 'Order #4987 fulfilled',
      resultingStock: 48,
      createdAt: '2026-10-20T09:00:00.000Z'
    },
    {
      id: 3,
      productId: 3002,
      productName: 'Unstitched Lawn Suit (3 Piece) - Floral Print',
      type: 'restock',
      quantity: 20,
      reason: 'Initial stock-in from Lahore warehouse',
      resultingStock: 20,
      createdAt: '2026-09-05T09:00:00.000Z'
    },
    {
      id: 4,
      productId: 3002,
      productName: 'Unstitched Lawn Suit (3 Piece) - Floral Print',
      type: 'sale',
      quantity: -14,
      reason: 'Bulk order fulfilled for Eid sale',
      resultingStock: 6,
      createdAt: '2026-10-28T09:00:00.000Z'
    },
    {
      id: 5,
      productId: 3006,
      productName: 'Electric Kettle 1.8L - Stainless Steel',
      type: 'sale',
      quantity: -3,
      reason: 'Last units sold out',
      resultingStock: 0,
      createdAt: '2026-10-30T09:00:00.000Z'
    },
    {
      id: 6,
      productId: 3004,
      productName: '20000mAh Fast Charging Power Bank',
      type: 'adjustment',
      quantity: -1,
      reason: 'Damaged unit written off during QC',
      resultingStock: 4,
      createdAt: '2026-10-29T09:00:00.000Z'
    },
    {
      id: 7,
      productId: 3019,
      productName: "Women's Formal Heels - Black Suede",
      type: 'return',
      quantity: 1,
      reason: 'Customer return - wrong size, restocked',
      resultingStock: 1,
      createdAt: '2026-09-28T09:00:00.000Z'
    },
    {
      id: 8,
      productId: 3019,
      productName: "Women's Formal Heels - Black Suede",
      type: 'adjustment',
      quantity: -1,
      reason: 'Product archived, remaining stock written off',
      resultingStock: 0,
      createdAt: '2026-10-02T09:00:00.000Z'
    }
  ]
}

// Per-product low-stock threshold overrides. Defaults to LOW_STOCK_THRESHOLD when absent.
const perProductThresholds = {}

const buildInventoryRecords = () =>
  productData.products.map(product => ({
    productId: product.id,
    sku: product.sku,
    productName: product.name,
    stock: product.stock,
    reorderLevel: perProductThresholds[product.id] ?? LOW_STOCK_THRESHOLD
  }))

// ------------------------------------------------
// GET: Inventory Overview (KPI tiles)
// ------------------------------------------------
mock.onGet('/apps/inventory/overview').reply(() => {
  const records = buildInventoryRecords()
  const totalSkus = records.length
  const totalUnits = records.reduce((sum, r) => sum + r.stock, 0)
  const lowStockCount = records.filter(r => r.stock > 0 && r.stock <= r.reorderLevel).length
  const outOfStockCount = records.filter(r => r.stock === 0).length

  return [200, { totalSkus, totalUnits, lowStockCount, outOfStockCount }]
})

// ------------------------------------------------
// GET: Stock list (all inventory records, for Stock Management table)
// ------------------------------------------------
mock.onGet('/apps/inventory/stock').reply(config => {
  const { q = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  const records = buildInventoryRecords().filter(
    r => r.productName.toLowerCase().includes(queryLowered) || r.sku.toLowerCase().includes(queryLowered)
  )

  return [200, { stock: records, total: records.length }]
})

// ------------------------------------------------
// GET: Low stock list (filtered view of the same stock data)
// ------------------------------------------------
mock.onGet('/apps/inventory/low-stock').reply(() => {
  const records = buildInventoryRecords().filter(r => r.stock <= r.reorderLevel)

  return [200, { stock: records, total: records.length }]
})

// ------------------------------------------------
// GET: Stock movement history
// ------------------------------------------------
mock.onGet('/apps/inventory/history').reply(config => {
  const { productId = '' } = config.params ?? {}

  const filtered = movements.log
    .filter(m => String(m.productId) === String(productId || m.productId))
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return [200, { history: filtered, total: filtered.length }]
})

// ------------------------------------------------
// POST: Adjust stock for a product (writes to Product.stock AND appends a StockMovement)
// ------------------------------------------------
mock.onPost('/apps/inventory/adjust-stock').reply(config => {
  const { productId, quantity, type = 'adjustment', reason = 'Manual adjustment' } = JSON.parse(config.data).data
  const product = productData.products.find(p => p.id === Number(productId))
  if (!product) {
    return [404, { message: 'Unable to find the requested product!' }]
  }
  product.stock = Math.max(0, product.stock + Number(quantity))
  product.updatedAt = new Date().toISOString()

  const lastId = Math.max(...movements.log.map(m => m.id), 0)

  const movement = {
    id: lastId + 1,
    productId: product.id,
    productName: product.name,
    type,
    quantity: Number(quantity),
    reason,
    resultingStock: product.stock,
    createdAt: new Date().toISOString()
  }
  movements.log.unshift(movement)

  return [200, { product, movement }]
})

// ------------------------------------------------
// PUT: Set per-product low-stock threshold
// ------------------------------------------------
mock.onPut(/\/apps\/inventory\/threshold\/\d+/).reply(config => {
  const productId = Number(config.url.split('/').pop())
  const { threshold } = JSON.parse(config.data).data
  const product = productData.products.find(p => p.id === productId)
  if (!product) {
    return [404, { message: 'Unable to find the requested product!' }]
  }
  perProductThresholds[productId] = Number(threshold)

  return [200, { productId, threshold: perProductThresholds[productId] }]
})
