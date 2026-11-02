# Storage

Product and CMS media are stored in Supabase Storage buckets (e.g. `media`).
`media_assets` rows store public URLs, alt text, mime type, and dimensions.
Uploads happen from ops via the media domain + service-role client.
