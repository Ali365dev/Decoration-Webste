// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'

// ** Services
import { getOrderById } from 'src/services/orders'

// ** Utils
import { formatPKR } from 'src/@core/utils/format'

// ─── Thermal-ish compact slip styles ─────────────────────────────────────────

const SlipRoot = styled(Box)({
  width: '80mm',
  margin: '0 auto',
  padding: '6mm 4mm',
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: 11,
  color: '#000',
  background: '#fff',
  '@media print': {
    margin: 0,
    padding: '4mm 3mm',
    boxShadow: 'none'
  }
})

const Row = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 2
})

const DashDivider = () => (
  <Typography component='div' sx={{ textAlign: 'center', letterSpacing: 2, my: 1, fontSize: 10, color: '#555' }}>
    {'- '.repeat(22)}
  </Typography>
)

// ─── Component ───────────────────────────────────────────────────────────────

const PackingSlip = ({ id }) => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const orderData = await getOrderById(id)
      setOrder(orderData ?? null)
      setLoading(false)
    }
    load()
  }, [id])

  useEffect(() => {
    if (!loading && order) {
      setTimeout(() => window.print(), 400)
    }
  }, [loading, order])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!order) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Order not found.</Typography>
      </Box>
    )
  }

  return (
    <SlipRoot>
      {/* Store header */}
      <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: 14, mb: 0.5, letterSpacing: 1 }}>
        DEC WALLS
      </Typography>
      <Typography sx={{ textAlign: 'center', fontSize: 9, color: '#555', mb: 1 }}>
        Wall Art &amp; Bedding Store · Pakistan
      </Typography>

      <DashDivider />

      {/* Order info */}
      <Row>
        <Typography sx={{ fontWeight: 700 }}>{order.orderNumber}</Typography>
        <Typography sx={{ fontSize: 10 }}>
          {new Date(order.createdAt).toLocaleDateString('en-PK', {
            day: 'numeric', month: 'short', year: '2-digit', timeZone: 'Asia/Karachi'
          })}
        </Typography>
      </Row>

      {order.trackingNumber && (
        <Row>
          <Typography sx={{ fontSize: 10 }}>📦 {order.courier || 'Courier'}</Typography>
          <Typography sx={{ fontSize: 10, fontWeight: 700 }}>{order.trackingNumber}</Typography>
        </Row>
      )}

      <DashDivider />

      {/* Ship-to */}
      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>SHIP TO:</Typography>
      <Typography sx={{ fontWeight: 600 }}>{order.customer?.name ?? 'Customer'}</Typography>
      {order.customer?.phone && (
        <Typography sx={{ fontSize: 10 }}>{order.customer.phone}</Typography>
      )}
      <Typography sx={{ fontSize: 10 }}>
        {order.shippingAddress?.address}
      </Typography>
      <Typography sx={{ fontSize: 10 }}>
        {order.shippingAddress?.city}
      </Typography>

      <DashDivider />

      {/* Items */}
      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>ITEMS:</Typography>
      {order.items.map((item, i) => (
        <Row key={i}>
          <Typography sx={{ fontSize: 10, maxWidth: '58mm' }}>
            {item.name} ×{item.qty}
          </Typography>
          <Typography sx={{ fontSize: 10, whiteSpace: 'nowrap' }}>
            {formatPKR(item.price * item.qty)}
          </Typography>
        </Row>
      ))}

      <DashDivider />

      {/* Totals */}
      <Row>
        <Typography sx={{ fontSize: 10 }}>Subtotal</Typography>
        <Typography sx={{ fontSize: 10 }}>{formatPKR(order.subtotal)}</Typography>
      </Row>
      <Row>
        <Typography sx={{ fontSize: 10 }}>Shipping</Typography>
        <Typography sx={{ fontSize: 10 }}>{formatPKR(order.shipping)}</Typography>
      </Row>
      <Row sx={{ mt: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 12 }}>TOTAL</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 12 }}>{formatPKR(order.total)}</Typography>
      </Row>

      {order.paymentMethod === 'COD' && (
        <Box sx={{
          mt: 1.5,
          px: 1,
          py: 0.75,
          border: '2px solid #000',
          textAlign: 'center'
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
            COD: {formatPKR(order.total)}
          </Typography>
          <Typography sx={{ fontSize: 9 }}>Collect on delivery</Typography>
        </Box>
      )}

      <DashDivider />

      {/* Footer */}
      <Typography sx={{ textAlign: 'center', fontSize: 9, color: '#555', mt: 1 }}>
        Packed with ❤️ — Thank you!
      </Typography>
    </SlipRoot>
  )
}

export default PackingSlip
