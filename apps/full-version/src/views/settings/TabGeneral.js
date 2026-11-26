// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Services Import
import { getSettings, updateSettings } from 'src/services/settings'

/**
 * General settings: store owner/admin profile, modeled on the account-settings
 * Account tab form layout but scoped to the fields that matter here (the
 * demo's avatar upload / country / language / plan fields don't apply to a
 * single-store admin, so this tab keeps just owner name/email/phone).
 */
const TabGeneral = () => {
  const [form, setForm] = useState({ ownerName: '', ownerEmail: '', ownerPhone: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(settings => {
      setForm(settings.general)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    await updateSettings({ general: form })
    toast.success('General settings saved')
  }

  if (loading) return null

  return (
    <Card>
      <CardHeader title='Admin Account Details' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Owner Name'
              value={form.ownerName}
              onChange={e => setForm({ ...form, ownerName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Owner Email'
              value={form.ownerEmail}
              onChange={e => setForm({ ...form, ownerEmail: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Owner Phone'
              value={form.ownerPhone}
              onChange={e => setForm({ ...form, ownerPhone: e.target.value })}
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

export default TabGeneral
