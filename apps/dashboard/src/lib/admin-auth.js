const jwt = require('jsonwebtoken')

/** @typedef {{ id: string; email: string; role: string }} AdminUser */

/**
 * Returns true when the submitted password matches the stored API key.
 * @param {string} password
 * @param {string} apiKey
 * @returns {boolean}
 */
function verifyAdminPassword(password, apiKey) {
  if (!password || !apiKey) return false
  return password === apiKey
}

/**
 * Signs a short-lived JWT for a verified admin user.
 * @param {AdminUser} user
 * @param {string} secret
 * @returns {string}
 */
function signAdminToken(user, secret) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: '8h' }
  )
}

/**
 * Verifies and decodes an admin JWT. Returns null on any error.
 * @param {string} token
 * @param {string} secret
 * @returns {AdminUser | null}
 */
function verifyAdminToken(token, secret) {
  try {
    const payload = jwt.verify(token, secret)
    if (typeof payload === 'object' && payload.email) {
      return { id: payload.id, email: payload.email, role: payload.role }
    }
    return null
  } catch {
    return null
  }
}

module.exports = { verifyAdminPassword, signAdminToken, verifyAdminToken }
