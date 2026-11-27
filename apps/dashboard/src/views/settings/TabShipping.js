// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Import
import { getSettings, updateSettings } from 'src/services/settings'
import { getShippingZones } from 'src/services/shippingZones'

/**
 * Shipping settings: a simple default-zone toggle, plus a link out to the
 * full Shipping Zones configuration screen (Phase 6) rather than duplicating
 * that CRUD UI here.
 */
const TabShipping = () => {
  const [zones, setZones] = useState([])
  const [defaultZoneId, setDefaultZoneId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSettings(), getShippingZones()]).then(([settings, zonesData]) => {
      setZones(zonesData.zones)
      setDefaultZoneId(settings.shipping.defaultZoneId || '')
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    await updateSettings({ shipping: { defaultZoneId } })
    toast.success('Shipping settings saved')
  }

  if (loading) return null

  return (
    <Card>
      <CardHeader title='Shipping' />
      <CardContent>
        <Alert severity='info' sx={{ mb: 6 }}>
          Zone rates, couriers and delivery charges are configured on the{' '}
          <Link href='/shipping/zones'>Shipping Zones</Link> screen. This default zone is just the fallback used when
          an order's city doesn't match any configured zone.
        </Alert>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Default Shipping Zone</InputLabel>
              <Select
                label='Default Shipping Zone'
                value={defaultZoneId}
                onChange={e => setDefaultZoneId(e.target.value)}
              >
                <MenuItem value=''>None</MenuItem>
                {zones.map(zone => (
                  <MenuItem key={zone.id} value={zone.id}>
                    {zone.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' onClick={handleSave} sx={{ mr: 3 }}>
              Save Changes
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              component={Link}
              href='/shipping/zones'
              startIcon={<Icon icon='mdi:open-in-new' />}
            >
              Manage Shipping Zones
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TabShipping
