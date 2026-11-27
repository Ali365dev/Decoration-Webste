// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} Review
 * @property {number} id
 * @property {number} productId - References Product.id
 * @property {string} productName
 * @property {string} customerName
 * @property {string} customerCity
 * @property {number} rating - 1 to 5
 * @property {string} comment
 * @property {'pending'|'approved'|'rejected'} status
 * @property {string} createdAt - ISO date string
 * @property {string|null} adminReply - Store reply from admin
 */

const data = {
  /** @type {Review[]} */
  reviews: [
    {
      id: 1,
      productId: 3001,
      productName: "Men's Slim Fit Cotton Kurta - Navy",
      customerName: 'Ahmed Raza',
      customerCity: 'Karachi',
      rating: 5,
      comment: 'Fabric quality is excellent and the fit is exactly as described. Will order again.',
      status: 'approved',
      adminReply: 'Thank you for your kind review! We hope to serve you again soon. 🙏',
      createdAt: '2026-10-05T10:00:00.000Z'
    },
    {
      id: 2,
      productId: 3001,
      productName: "Men's Slim Fit Cotton Kurta - Navy",
      customerName: 'Bilal Hussain',
      customerCity: 'Lahore',
      rating: 4,
      comment: 'Good quality, slightly loose around the shoulders but overall satisfied.',
      status: 'approved',
      createdAt: '2026-10-12T10:00:00.000Z'
    },
    {
      id: 3,
      productId: 3001,
      productName: "Men's Slim Fit Cotton Kurta - Navy",
      customerName: 'Hamza Sheikh',
      customerCity: 'Islamabad',
      rating: 4,
      comment: 'Delivery was quick, color is exactly as shown in pictures.',
      status: 'pending',
      createdAt: '2026-10-30T10:00:00.000Z'
    },
    {
      id: 4,
      productId: 3002,
      productName: 'Unstitched Lawn Suit (3 Piece) - Floral Print',
      customerName: 'Ayesha Khan',
      customerCity: 'Lahore',
      rating: 5,
      comment: 'Beautiful print, fabric feels premium. Highly recommended for summer.',
      status: 'approved',
      createdAt: '2026-10-02T10:00:00.000Z'
    },
    {
      id: 5,
      productId: 3002,
      productName: 'Unstitched Lawn Suit (3 Piece) - Floral Print',
      customerName: 'Mehwish Tariq',
      customerCity: 'Faisalabad',
      rating: 3,
      comment: 'Nice fabric but one of the pieces had a small print defect.',
      status: 'pending',
      createdAt: '2026-10-27T10:00:00.000Z'
    },
    {
      id: 6,
      productId: 3003,
      productName: 'Tempered Glass Screen Protector - Universal 6.5"',
      customerName: 'Usman Ali',
      customerCity: 'Karachi',
      rating: 4,
      comment: 'Fits well, easy to apply with no bubbles.',
      status: 'approved',
      createdAt: '2026-09-28T10:00:00.000Z'
    },
    {
      id: 7,
      productId: 3004,
      productName: '20000mAh Fast Charging Power Bank',
      customerName: 'Sana Malik',
      customerCity: 'Rawalpindi',
      rating: 5,
      comment: 'Charges my phone 4 times fully. Great value for money.',
      status: 'approved',
      createdAt: '2026-10-08T10:00:00.000Z'
    },
    {
      id: 8,
      productId: 3005,
      productName: 'Non-Stick Cooking Pot Set (3 Piece)',
      customerName: 'Nadia Yousuf',
      customerCity: 'Karachi',
      rating: 4,
      comment: 'Good quality pots, non-stick coating works well so far.',
      status: 'approved',
      createdAt: '2026-09-15T10:00:00.000Z'
    },
    {
      id: 9,
      productId: 3008,
      productName: 'Matte Lipstick - Shade "Lahore Rose"',
      customerName: 'Zoya Ahmed',
      customerCity: 'Lahore',
      rating: 5,
      comment: 'Color is gorgeous and stays on the whole day.',
      status: 'approved',
      createdAt: '2026-10-14T10:00:00.000Z'
    },
    {
      id: 10,
      productId: 3008,
      productName: 'Matte Lipstick - Shade "Lahore Rose"',
      customerName: 'Komal Nasir',
      customerCity: 'Multan',
      rating: 3,
      comment: 'Nice shade but dries out the lips a bit.',
      status: 'rejected',
      createdAt: '2026-10-20T10:00:00.000Z'
    },
    {
      id: 11,
      productId: 3010,
      productName: "Men's Peshawari Chappal - Brown Leather",
      customerName: 'Faisal Qureshi',
      customerCity: 'Peshawar',
      rating: 5,
      comment: 'Authentic leather and very comfortable for daily wear.',
      status: 'approved',
      createdAt: '2026-09-22T10:00:00.000Z'
    },
    {
      id: 12,
      productId: 3011,
      productName: "Women's Embroidered Khussa - Gold",
      customerName: 'Rabia Siddiqui',
      customerCity: 'Lahore',
      rating: 5,
      comment: 'Embroidery work is stunning, wore it on Eid and got many compliments.',
      status: 'approved',
      createdAt: '2026-10-18T10:00:00.000Z'
    },
    {
      id: 13,
      productId: 3014,
      productName: 'Wireless Bluetooth Earbuds - Pro',
      customerName: 'Owais Shah',
      customerCity: 'Karachi',
      rating: 4,
      comment: 'Sound quality is decent for the price, battery life is as advertised.',
      status: 'pending',
      createdAt: '2026-10-29T10:00:00.000Z'
    },
    {
      id: 14,
      productId: 3015,
      productName: 'Air Fryer 4.5L Digital',
      customerName: 'Sidra Iqbal',
      customerCity: 'Lahore',
      rating: 5,
      comment: 'Cooks evenly and cleanup is very easy. Worth the price.',
      status: 'approved',
      createdAt: '2026-10-10T10:00:00.000Z'
    },
    {
      id: 15,
      productId: 3019,
      productName: "Women's Formal Heels - Black Suede",
      customerName: 'Maryam Fawad',
      customerCity: 'Karachi',
      rating: 3,
      comment: 'Looked great but sizing ran a little small.',
      status: 'approved',
      createdAt: '2026-08-02T10:00:00.000Z'
    }
  ]
}

// ------------------------------------------------
// GET: Return Review List
// ------------------------------------------------
mock.onGet('/apps/reviews/list').reply(config => {
  const { q = '', status = '', productId = '' } = config.params ?? {}
  const queryLowered = q.toLowerCase()

  const filteredData = data.reviews.filter(
    review =>
      (review.customerName.toLowerCase().includes(queryLowered) ||
        review.productName.toLowerCase().includes(queryLowered) ||
        review.comment.toLowerCase().includes(queryLowered)) &&
      review.status === (status || review.status) &&
      String(review.productId) === String(productId || review.productId)
  )

  return [200, { reviews: filteredData, allData: data.reviews, total: filteredData.length }]
})

// ------------------------------------------------
// PUT: Post admin reply
// ------------------------------------------------
mock.onPut(/\/apps\/reviews\/reply\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const { adminReply } = JSON.parse(config.data).data
  const index = data.reviews.findIndex(r => r.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested review!' }]
  }
  data.reviews[index] = { ...data.reviews[index], adminReply }

  return [200, { review: data.reviews[index] }]
})

// ------------------------------------------------
// PUT: Update Review Status (approve/reject)
// ------------------------------------------------
mock.onPut(/\/apps\/reviews\/update-status\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop(), 10)
  const { status } = JSON.parse(config.data).data
  const index = data.reviews.findIndex(r => r.id === id)
  if (index === -1) {
    return [404, { message: 'Unable to find the requested review!' }]
  }
  data.reviews[index] = { ...data.reviews[index], status }

  return [200, { review: data.reviews[index] }]
})

// ------------------------------------------------
// DELETE: Deletes Review
// ------------------------------------------------
mock.onDelete('/apps/reviews/delete').reply(config => {
  const reviewId = Number(config.data)
  const index = data.reviews.findIndex(r => r.id === reviewId)
  if (index !== -1) {
    data.reviews.splice(index, 1)
  }

  return [200]
})
