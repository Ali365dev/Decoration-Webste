// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Services Import
import { getSettings, updateSettings } from 'src/services/settings'

const toggleMeta = [
  { key: 'orderAlerts', label: 'New Order Alerts', hint: 'Notify when a new order is placed' },
  { key: 'lowStockAlerts', label: 'Low Stock Alerts', hint: 'Notify when a product falls below its reorder threshold' },
  { key: 'paymentAlerts', label: 'Payment Verification Alerts', hint: 'Notify when a payment needs manual verification' },
  { key: 'reviewAlerts', label: 'New Review Alerts', hint: 'Notify when a customer submits a product review' }
]

/**
 * Notifications settings: renamed from the generic account-settings
 * "Recent Devices" demo tab (which had no persistence - checkboxes with no
 * Save behavior) to order/stock/payment/review alert toggles wired to the
 * real store settings, per the no-dead-buttons rule.
 */
const TabNotifications = () => {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then(settings => {
      setForm(settings.notifications)
      setLoading(false)
    })
  }, [])

  const handleToggle = async key => {
    const next = { ...form, [key]: !form[key] }
    setForm(next)
    await updateSettings({ notifications: next })
    toast.success(`${toggleMeta.find(t => t.key === key).label} ${next[key] ? 'enabled' : 'disabled'}`)
  }

  if (loading) return null

  return (
    <Card>
      <CardHeader title='Notifications' subheader='Choose which store events trigger an alert' />
      <CardContent>
        <Grid container spacing={4}>
          {toggleMeta.map(item => (
            <Grid item xs={12} key={item.key}>
              <Grid container alignItems='center' justifyContent='space-between'>
                <Grid item>
                  <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
                  <Typography variant='caption'>{item.hint}</Typography>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label=''
                    control={<Switch checked={!!form[item.key]} onChange={() => handleToggle(item.key)} />}
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
              Changes save automatically.
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TabNotifications
