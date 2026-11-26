/**
 * Proxy route: forwards /api/admin/* requests from the dashboard to the
 * storefront (port 3000) with the ADMIN_API_KEY header added.
 *
 * Only works in development. Set in apps/full-version/.env.local:
 *   ADMIN_API_KEY=<same value as in apps/storefront/.env.local>
 *   STOREFRONT_URL=http://127.0.0.1:3000
 */

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(503).json({ error: 'Not available in production' })
  }

  const adminKey = process.env.ADMIN_API_KEY
  if (!adminKey) {
    return res.status(503).json({ error: 'ADMIN_API_KEY not set in dashboard env' })
  }

  const storefrontUrl = process.env.STOREFRONT_URL || 'http://127.0.0.1:3000'
  const path = req.query.path?.join('/') ?? ''
  const targetUrl = `${storefrontUrl}/api/admin/${path}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`

  // Read body for POST/PUT
  let body = undefined
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await new Promise((resolve, reject) => {
      const chunks = []
      req.on('data', chunk => chunks.push(chunk))
      req.on('end', () => resolve(Buffer.concat(chunks)))
      req.on('error', reject)
    })
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'content-type': req.headers['content-type'] || 'application/json',
        'x-admin-key': adminKey,
      },
      body: body && body.length ? body : undefined,
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    res.status(502).json({ error: 'Could not reach storefront', detail: err?.message })
  }
}
