// State updates for the editors. Every change is a function of the latest state, so an update
// that arrives late (a slow image upload) only changes its own field and never undoes edits made
// in the meantime, and sections are found by id, not by their position.

/** Applies a value or an updater function to the previous value. */
export const applyUpdate = (prev, update) => (typeof update === 'function' ? update(prev) : update)

/** A setter for one field of an object whose parent `onChange` accepts updater functions. */
export const fieldSetter = (onChange, key) => value =>
  onChange(prev => ({ ...prev, [key]: applyUpdate(prev?.[key], value) }))

/** Applies `patch` (values or updater functions per key) to the section with this id. */
export const updateSectionById = (working, id, patch) => ({
  ...working,
  sections: working.sections.map(section => {
    if (section.id !== id) return section
    const next = { ...section }
    for (const [key, value] of Object.entries(patch)) next[key] = applyUpdate(section[key], value)

    return next
  })
})

/** Runs `fn`, returning `fallback` if malformed stored data makes it throw. */
export const safely = (fn, fallback) => {
  try {
    return fn()
  } catch {
    return fallback
  }
}

export const SHOWCASE_TYPE = 'category_showcase'

export const MAX_SHOWCASES = 8

/** A new, empty category showcase, placed right after the last one (or at the end). */
export const addShowcase = (working, id) => {
  const section = {
    id,
    type: SHOWCASE_TYPE,
    hidden: false,
    isNew: true,
    data: {
      bannerImage: '',
      heading: '',
      categoryTitle: '',
      ctaLabel: 'Shop Now',
      ctaHref: '/collections/new-in',
      collectionSlug: 'new-in',
      categoryNav: []
    }
  }
  const lastShowcase = working.sections.map(s => s.type).lastIndexOf(SHOWCASE_TYPE)
  const at = lastShowcase === -1 ? working.sections.length : lastShowcase + 1

  return { ...working, sections: [...working.sections.slice(0, at), section, ...working.sections.slice(at)] }
}

export const removeSection = (working, id) => ({ ...working, sections: working.sections.filter(s => s.id !== id) })

const PLAIN_NAMES = { 'new-in': 'New in', sale: 'Sale' }

/**
 * A menu link to a collection. Menu items and columns (depth 0 and 1) use capitals, like the
 * existing menu ("HOME DECOR"); links inside a column keep normal case ("Table Decor").
 */
export const collectionToLink = (collection, depth) => {
  const name = PLAIN_NAMES[collection.slug] || collection.name

  return { label: depth < 2 ? name.toUpperCase() : name, href: `/collections/${collection.slug}` }
}
