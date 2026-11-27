// Turns the storefront API's field paths into words a shop owner can follow.

// A list key followed by an index names one item of that list ("slides.0" → "slide 1").
const ITEM_NAMES = {
  slides: 'slide',
  tiles: 'tile',
  categoryNav: 'collection',
  tabs: 'tab',
  reviews: 'review',
  messages: 'message',
  social: 'social link',
  items: 'item',
  children: 'item'
}

const FIELD_NAMES = {
  image: 'image',
  label: 'name',
  heading: 'heading',
  ctaLabel: 'button text',
  ctaHref: 'button link',
  href: 'link',
  badge: 'badge',
  bannerImage: 'banner image',
  categoryTitle: 'list heading',
  collectionSlug: 'collection',
  posterSrc: 'image before the video plays',
  videoSrc: 'video file',
  videoSrcMobile: 'video for phones',
  description: 'text',
  subtitle: 'text under the heading',
  eyebrow: 'small line above',
  quote: 'what they said',
  name: 'customer name',
  location: 'city',
  rating: 'stars',
  placeholder: 'text inside the email box',
  icon: 'icon',
  address: 'address',
  email: 'email',
  phone: 'phone',
  seoTitle: 'page title',
  seoDescription: 'description'
}

/** "slides.0.heading: This field is required." → "Slide 1, heading: This field is required." */
export const humanizeError = (message, prefix = '') => {
  const match = /^([\w.]+): (.*)$/.exec(message || '')
  if (!match) return message

  const keys = match[1].split('.')
  const words = []
  keys.forEach((key, i) => {
    if (/^\d+$/.test(key)) words.push(`${ITEM_NAMES[keys[i - 1]] || 'item'} ${Number(key) + 1}`)
    else if (!(ITEM_NAMES[key] && /^\d+$/.test(keys[i + 1] || ''))) words.push(FIELD_NAMES[key] || key)
  })

  const where = [prefix, ...words].filter(Boolean).join(', ')

  return `${where.charAt(0).toUpperCase()}${where.slice(1)}: ${match[2]}`
}
