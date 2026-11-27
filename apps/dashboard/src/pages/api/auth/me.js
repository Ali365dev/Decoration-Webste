const { verifyAdminToken } = require('src/lib/admin-auth')

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

  const secret = process.env.NEXT_PUBLIC_JWT_SECRET
  if (!secret) return res.status(503).json({ error: 'Auth not configured' })

  const user = verifyAdminToken(token, secret)
  if (!user) return res.status(401).json({ error: 'Invalid or expired token' })

  return res.status(200).json({ userData: { ...user, fullName: 'Admin' } })
}
