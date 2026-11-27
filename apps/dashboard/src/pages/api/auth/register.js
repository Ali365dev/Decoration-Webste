const { signAdminToken } = require('src/lib/admin-auth')

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { username, email, password, inviteKey } = req.body ?? {}
  const apiKey = process.env.ADMIN_API_KEY
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET

  if (!apiKey || !secret) {
    return res.status(503).json({ error: 'Auth not configured' })
  }

  if (!username || typeof username !== 'string' || username.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' })
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }
  if (!inviteKey || inviteKey !== apiKey) {
    return res.status(401).json({ error: 'Invalid invite key' })
  }

  const user = { id: email, email: email.toLowerCase(), role: 'admin', fullName: username.trim() }
  const accessToken = signAdminToken(user, secret)

  return res.status(200).json({ accessToken, userData: user })
}
