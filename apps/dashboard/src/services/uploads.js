// Direct signed upload to Cloudinary: the storefront signs, the browser uploads.
// The Cloudinary secret never reaches the browser.

import axios from 'axios'

export async function uploadImage(file, folder) {
  const { data } = await axios.post('/api/admin/uploads/sign', { folder })
  const { cloudName, apiKey, timestamp, signature } = data.data

  const body = new FormData()
  body.append('file', file)
  body.append('api_key', apiKey)
  body.append('timestamp', String(timestamp))
  body.append('signature', signature)
  body.append('folder', data.data.folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.error?.message || 'Image upload failed')

  return { url: json.secure_url, publicId: json.public_id }
}

/** Items are saved images `{ url, publicId }` or new ones `{ file }`. Uploads new ones in order. */
export async function uploadImages(items, folder) {
  const out = []
  for (const item of items) {
    out.push(item.file ? await uploadImage(item.file, folder) : { url: item.url, publicId: item.publicId ?? null })
  }
  
return out
}
