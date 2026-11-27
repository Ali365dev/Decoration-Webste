// Storefront content (home page sections, menus, contact details) — the real storefront admin API,
// through the dashboard proxy. Every read returns a `version`; every save sends it back so a save
// made from an out-of-date copy is refused instead of overwriting someone else's changes.

import axios from 'axios'

const BASE = '/api/admin/storefront'

export const LIVE_REFRESH_NOTICE = 'Saved. The live site will update within 5 minutes.'

export class ConflictError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConflictError'
  }
}

const read = async path => {
  const response = await axios.get(`${BASE}${path}`)

  return { data: response.data.data, version: response.data.version }
}

const save = async (path, payload, version) => {
  try {
    const response = await axios.put(`${BASE}${path}`, { ...payload, version })
    const { data, version: next, liveRefresh } = response.data

    return { data, version: next, notice: liveRefresh === 'ok' ? null : LIVE_REFRESH_NOTICE }
  } catch (error) {
    const status = error?.response?.status
    const message = error?.response?.data?.error || error?.message || 'Could not save. Try again.'
    if (status === 409) throw new ConflictError(message)
    throw new Error(message)
  }
}

export const getHomeContent = () => read('/home')

export const saveHomeContent = (payload, version) => save('/home', payload, version)

export const getMenu = key => read(`/menus/${key}`)

export const saveMenu = (key, payload, version) => save(`/menus/${key}`, payload, version)

export const getContact = () => read('/contact')

export const saveContact = (payload, version) => save('/contact', payload, version)
