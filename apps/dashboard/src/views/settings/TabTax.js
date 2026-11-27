// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Services Import
import { getSettings, updateSettings } from 'src/services/settings'

/**
 * Tax settings: simple rate config form, defaulting to Pakistan's standard
 * General Sales Tax (GST) rate.
 */
const TabTax = () => {
  const [form, setForm] = useState({ rate: 17, inclusive: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(settings => {
      setForm(settings.tax)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    await updateSettings({ tax: { ...form, rate: Number(form.rate) } })
    toast.success('Tax settings saved')
  }

  if (loading) return null

  return (
    <Card>
      <CardHeader title='Tax' subheader='Pakistan General Sales Tax (GST) is 17% by default' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label='Tax Rate'
              value={form.rate}
              onChange={e => setForm({ ...form, rate: e.target.value })}
              InputProps={{ endAdornment: <InputAdornment position='end'>%</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              label='Prices are tax-inclusive'
              control={
                <Switch checked={form.inclusive} onChange={e => setForm({ ...form, inclusive: e.target.checked })} />
              }
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

export default TabTax
