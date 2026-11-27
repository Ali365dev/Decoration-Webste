const { verifyAdminPassword, signAdminToken } = require('src/lib/admin-auth')

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body ?? {}
  const apiKey = process.env.ADMIN_API_KEY
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET

  if (!apiKey || !secret) {
    return res.status(503).json({ error: 'Auth not configured' })
  }

  if (!email || !verifyAdminPassword(password, apiKey)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const user = { id: 'admin', email, role: 'admin', fullName: 'Admin' }
  const accessToken = signAdminToken(user, secret)

  return res.status(200).json({ accessToken, userData: user })
}
