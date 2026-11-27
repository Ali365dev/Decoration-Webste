// ** Mock Adapter
import mock from 'src/@fake-db/mock'

/**
 * @typedef {Object} StoreSettings
 * @property {Object} general
 * @property {string} general.ownerName
 * @property {string} general.ownerEmail
 * @property {string} general.ownerPhone - Pakistani format
 * @property {Object} store
 * @property {string} store.storeName
 * @property {string} store.address
 * @property {string} store.city
 * @property {string} store.contactPhone
 * @property {string} store.contactEmail
 * @property {string} store.logoUrl - Stub, no real upload backend
 * @property {Object} shipping
 * @property {string|null} shipping.defaultZoneId - References ShippingZone.id
 * @property {Object} tax
 * @property {number} tax.rate - Percentage, defaults to Pakistan's standard sales tax rate
 * @property {boolean} tax.inclusive
 * @property {Object} notifications
 * @property {boolean} notifications.orderAlerts
 * @property {boolean} notifications.lowStockAlerts
 * @property {boolean} notifications.paymentAlerts
 * @property {boolean} notifications.reviewAlerts
 * @property {Object} seo
 * @property {string} seo.metaTitle
 * @property {string} seo.metaDescription
 */

export const data = {
  /** @type {StoreSettings} */
  settings: {
    general: {
      ownerName: 'Hassan Siddiqui',
      ownerEmail: 'hassan.siddiqui@store.pk',
      ownerPhone: '+92 300 1112233'
    },
    store: {
      storeName: 'Johar Town Mart',
      address: 'Plot 12, Block C, Johar Town',
      city: 'Lahore',
      contactPhone: '+92 42 3521 0099',
      contactEmail: 'support@johartownmart.pk',
      logoUrl: '/images/misc/mastercard-logo.png'
    },
    shipping: {
      defaultZoneId: null
    },
    tax: {
      rate: 17,
      inclusive: false
    },
    notifications: {
      orderAlerts: true,
      lowStockAlerts: true,
      paymentAlerts: true,
      reviewAlerts: false
    },
    seo: {
      metaTitle: 'Johar Town Mart - Online Shopping in Pakistan',
      metaDescription: 'Shop clothing, electronics, home & beauty essentials with fast COD delivery across Pakistan.'
    }
  }
}

mock.onGet('/apps/settings').reply(() => {
  return [200, { settings: data.settings }]
})

mock.onPut('/apps/settings').reply(config => {
  const updates = JSON.parse(config.data).data
  data.settings = {
    ...data.settings,
    ...updates,
    general: { ...data.settings.general, ...(updates.general ?? {}) },
    store: { ...data.settings.store, ...(updates.store ?? {}) },
    shipping: { ...data.settings.shipping, ...(updates.shipping ?? {}) },
    tax: { ...data.settings.tax, ...(updates.tax ?? {}) },
    notifications: { ...data.settings.notifications, ...(updates.notifications ?? {}) },
    seo: { ...data.settings.seo, ...(updates.seo ?? {}) }
  }

  return [200, { settings: data.settings }]
})
