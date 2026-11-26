// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services
import { updateOrder } from 'src/services/orders'

// ** Utils
import { formatPKR } from 'src/@core/utils/format'

import toast from 'react-hot-toast'

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']

const COURIERS = ['TCS', 'Leopards', 'M&P', 'BlueEx', 'Call Courier', 'Daewoo', 'Other']

const PreviewActions = ({ id, order, onStatusChange, shipment, onCreateShipment }) => {
  const [tracking, setTracking] = useState(order?.trackingNumber || '')
  const [courier, setCourier] = useState(order?.courier || '')
  const [savingTracking, setSavingTracking] = useState(false)

  const handleSaveTracking = async () => {
    if (!tracking.trim()) {
      toast.error('Enter a tracking number first')

      return
    }
    setSavingTracking(true)
    await updateOrder(id, { trackingNumber: tracking.trim(), courier })
    setSavingTracking(false)
    toast.success('Tracking saved')
  }

  const buildWhatsAppMessage = () => {
    if (!order) return ''

    const lines = [
      `Assalam o Alaikum ${order.customer?.name ?? 'Customer'}! 🛍️`,
      ``,
      `Your order *${order.orderNumber}* has been dispatched.`,
      ``,
      tracking
        ? `📦 Courier: ${courier || 'TCS'}\n🔖 Tracking: ${tracking}`
        : `Your order is on its way!`,
      ``,
      `Total: *${formatPKR(order.total)}* (${order.paymentMethod})`,
      ``,
      `Deliver to: ${order.shippingAddress?.address}, ${order.shippingAddress?.city}`,
      ``,
      `Thank you for shopping with us! 🙏`
    ]

    return encodeURIComponent(lines.join('\n'))
  }

  const whatsappHref = order?.customer?.phone
    ? `https://wa.me/92${order.customer.phone.replace(/^0/, '').replace(/\D/g, '')}?text=${buildWhatsAppMessage()}`
    : null

  return (
    <Card>
      <CardContent>
        {/* Status */}
        <FormControl fullWidth sx={{ mb: 3.5 }}>
          <InputLabel id='order-status-select'>Order Status</InputLabel>
          <Select
            label='Order Status'
            labelId='order-status-select'
            value={order?.status ?? ''}
            onChange={e => onStatusChange(e.target.value)}
          >
            {statusOptions.map(status => (
              <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ mb: 3.5 }} />

        {/* Tracking */}
        <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Tracking
        </Typography>
        <FormControl fullWidth sx={{ mt: 2, mb: 2.5 }}>
          <InputLabel id='courier-label'>Courier</InputLabel>
          <Select
            size='small'
            label='Courier'
            labelId='courier-label'
            value={courier}
            onChange={e => setCourier(e.target.value)}
          >
            <MenuItem value=''>— Select Courier</MenuItem>
            {COURIERS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          size='small'
          label='Tracking Number'
          placeholder='e.g. TCS-123456789'
          value={tracking}
          onChange={e => setTracking(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          size='small'
          variant='contained'
          disabled={savingTracking}
          onClick={handleSaveTracking}
          startIcon={<Icon icon='mdi:truck-check-outline' />}
          sx={{ mb: 3.5 }}
        >
          {savingTracking ? 'Saving…' : 'Save Tracking'}
        </Button>

        <Divider sx={{ mb: 3.5 }} />

        {/* WhatsApp */}
        {whatsappHref && (
          <Button
            fullWidth
            sx={{ mb: 3.5 }}
            component='a'
            href={whatsappHref}
            target='_blank'
            rel='noopener'
            variant='contained'
            color='success'
            startIcon={<Icon icon='mdi:whatsapp' />}
          >
            WhatsApp Customer
          </Button>
        )}

        {/* Packing Slip */}
        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          component={Link}
          href={`/sales/orders/packing/${id}`}
          target='_blank'
          color='secondary'
          variant='outlined'
          startIcon={<Icon icon='mdi:package-variant-closed' />}
        >
          Packing Slip
        </Button>

        {/* Print invoice */}
        <Button
          fullWidth
          target='_blank'
          sx={{ mb: 3.5 }}
          component={Link}
          color='secondary'
          variant='outlined'
          startIcon={<Icon icon='mdi:printer-outline' />}
          href={`/sales/orders/print/${id}`}
        >
          Print Invoice
        </Button>

        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          component={Link}
          color='secondary'
          variant='outlined'
          href={`/sales/orders/edit/${id}`}
        >
          Edit Order
        </Button>

        {order?.customer && (
          <Button
            fullWidth
            sx={{ mb: 3.5 }}
            component={Link}
            color='secondary'
            variant='outlined'
            startIcon={<Icon icon='mdi:account-outline' />}
            href={`/customers/view/overview?id=${order.customer.id}`}
          >
            View Customer
          </Button>
        )}

        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          component={Link}
          color='secondary'
          variant='outlined'
          startIcon={<Icon icon='mdi:cash-check' />}
          href={`/payments/transactions?orderId=${id}`}
        >
          Payment Details
        </Button>

        {shipment ? (
          <Button
            fullWidth
            component={Link}
            color='secondary'
            variant='outlined'
            startIcon={<Icon icon='mdi:truck-outline' />}
            href={`/shipping/tracking/${shipment.id}`}
          >
            Shipment Details
          </Button>
        ) : (
          <Button
            fullWidth
            color='secondary'
            variant='outlined'
            startIcon={<Icon icon='mdi:truck-plus-outline' />}
            onClick={onCreateShipment}
          >
            Create Shipment
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default PreviewActions
