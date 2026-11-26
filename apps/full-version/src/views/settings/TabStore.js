// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Services Import
import { getSettings, updateSettings } from 'src/services/settings'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
  objectFit: 'contain',
  backgroundColor: theme.palette.action.hover
}))

const emptyForm = { storeName: '', address: '', city: '', contactPhone: '', contactEmail: '', logoUrl: '' }

/**
 * Store Information tab: store name/address/contact/logo. Reuses the same
 * account-settings form layout + image-upload box shape (TabAccount.js) for
 * the logo field, stubbed to a data URL preview only - no real upload backend.
 */
const TabStore = () => {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(settings => {
      setForm(settings.store)
      setLoading(false)
    })
  }, [])

  const handleLogoChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm({ ...form, logoUrl: reader.result })
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    await updateSettings({ store: form })
    toast.success('Store information saved')
  }

  if (loading) return null

  return (
    <Card>
      <CardHeader title='Store Information' />
      <CardContent>
        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
          <ImgStyled src={form.logoUrl} alt='Store Logo' />
          <div>
            <Button component='label' variant='contained' htmlFor='store-logo-upload'>
              Upload Logo
              <input hidden type='file' accept='image/png, image/jpeg' id='store-logo-upload' onChange={handleLogoChange} />
            </Button>
            <Typography sx={{ mt: 3, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
          </div>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Store Name'
              value={form.storeName}
              onChange={e => setForm({ ...form, storeName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='City'
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Address'
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Contact Phone'
              value={form.contactPhone}
              onChange={e => setForm({ ...form, contactPhone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Contact Email'
              value={form.contactEmail}
              onChange={e => setForm({ ...form, contactEmail: e.target.value })}
            />
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

export default TabStore
