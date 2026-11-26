// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Services Import
import { getOrderById, updateOrderStatus } from 'src/services/orders'
import { getShipmentByOrderId } from 'src/services/shipments'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/invoice/preview/PreviewCard'
import PreviewActions from 'src/views/apps/invoice/preview/PreviewActions'
import CreateShipmentDrawer from 'src/views/shipping/CreateShipmentDrawer'

const OrderPreview = ({ id }) => {
  // ** State
  const [error, setError] = useState(false)
  const [order, setOrder] = useState(null)
  const [shipment, setShipment] = useState(null)
  const [shipmentDrawerOpen, setShipmentDrawerOpen] = useState(false)

  const fetchOrder = useCallback(() => {
    getOrderById(id)
      .then(data => {
        setOrder(data)
        setError(false)
      })
      .catch(() => {
        setOrder(null)
        setError(true)
      })
  }, [id])

  const fetchShipment = useCallback(() => {
    getShipmentByOrderId(id)
      .then(setShipment)
      .catch(() => setShipment(null))
  }, [id])

  useEffect(() => {
    fetchOrder()
    fetchShipment()
  }, [fetchOrder, fetchShipment])

  const handleStatusChange = status => {
    updateOrderStatus(id, status)
      .then(() => {
        toast.success(`Order marked as ${status}`)
        fetchOrder()
      })
      .catch(() => toast.error('Unable to update order status'))
  }

  if (order) {
    return (
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <PreviewCard order={order} />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <PreviewActions
            id={id}
            order={order}
            shipment={shipment}
            onStatusChange={handleStatusChange}
            onCreateShipment={() => setShipmentDrawerOpen(true)}
          />
        </Grid>
        <CreateShipmentDrawer
          open={shipmentDrawerOpen}
          toggle={() => setShipmentDrawerOpen(false)}
          orderId={order.id}
          onCreated={fetchShipment}
        />
      </Grid>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Order with the id: {id} does not exist. Please check the list of orders:{' '}
            <Link href='/sales/orders'>Order List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default OrderPreview
