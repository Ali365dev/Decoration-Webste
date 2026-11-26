// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

const defaultMethods = [
  { key: 'COD', title: 'Cash on Delivery', icon: 'mdi:cash', color: 'success' },
  { key: 'Bank Transfer', title: 'Bank Transfer', icon: 'mdi:bank-outline', color: 'primary' },
  { key: 'Easypaisa', title: 'Easypaisa', icon: 'mdi:cellphone-nfc', color: 'info' },
  { key: 'JazzCash', title: 'JazzCash', icon: 'mdi:cellphone-nfc', color: 'warning' },
  { key: 'SadaPay', title: 'SadaPay', icon: 'mdi:credit-card-outline', color: 'secondary' }
]

/**
 * Store Payment Methods config, modeled on the card+toggle shape of
 * views/pages/account-settings/billing/PaymentMethodCard.js, simplified to a
 * list of store-level methods (COD/Bank/Easypaisa/JazzCash/SadaPay) instead of
 * a customer's saved credit cards.
 */
const PaymentMethods = () => {
  const [enabled, setEnabled] = useState(() => defaultMethods.reduce((acc, m) => ({ ...acc, [m.key]: true }), {}))

  const handleToggle = key => {
    setEnabled(prev => {
      const next = { ...prev, [key]: !prev[key] }
      toast.success(`${key} ${next[key] ? 'enabled' : 'disabled'}`)

      return next
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Accepted Payment Methods' subheader='Toggle which methods customers can use at checkout' />
          <CardContent>
            <Grid container spacing={4}>
              {defaultMethods.map(method => (
                <Grid item xs={12} sm={6} md={4} key={method.key}>
                  <Card variant='outlined'>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CustomAvatar skin='light' color={method.color} variant='rounded' sx={{ mr: 3 }}>
                          <Icon icon={method.icon} />
                        </CustomAvatar>
                        <Typography variant='body1' sx={{ fontWeight: 600 }}>
                          {method.title}
                        </Typography>
                      </Box>
                      <FormControlLabel
                        label=''
                        control={<Switch checked={!!enabled[method.key]} onChange={() => handleToggle(method.key)} />}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PaymentMethods
