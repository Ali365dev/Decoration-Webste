// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Services Import
import { getSettings, updateSettings } from 'src/services/settings'

/**
 * SEO settings: store-wide meta title/description defaults used when a
 * page doesn't define its own. No existing template analog - new form.
 */
const TabSeo = () => {
  const [form, setForm] = useState({ metaTitle: '', metaDescription: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(settings => {
      setForm(settings.seo)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    await updateSettings({ seo: form })
    toast.success('SEO settings saved')
  }

  if (loading) return null

  return (
    <Card>
      <CardHeader title='SEO Defaults' subheader='Used as a fallback when a product or page has no SEO fields of its own' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Default Meta Title'
              value={form.metaTitle}
              onChange={e => setForm({ ...form, metaTitle: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label='Default Meta Description'
              value={form.metaDescription}
              onChange={e => setForm({ ...form, metaDescription: e.target.value })}
            />
            <Typography variant='caption'>{form.metaDescription.length}/160 characters</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' onClick={handleSave}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TabSeo
