// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getShipmentById, getTrackingEvents, updateShipment } from 'src/services/shipments'

// ** Utils Import
import { formatKarachiDate } from 'src/@core/utils/format'

// ** Styled Timeline component (same styling as views/components/timeline/TimelineOutlined.js
// and src/views/inventory/StockHistory.js's Stock History timeline)
const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': { display: 'none' }
  }
})

const statusColors = {
  pending: 'secondary',
  picked: 'info',
  'in-transit': 'primary',
  'out-for-delivery': 'warning',
  delivered: 'success',
  failed: 'error'
}

const NEXT_STATUS = {
  pending: 'picked',
  picked: 'in-transit',
  'in-transit': 'out-for-delivery',
  'out-for-delivery': 'delivered'
}

/**
 * Shipment Tracking: renders TrackingEvents on the same Timeline component
 * shape Phase 4 used for Stock History (views/inventory/StockHistory.js).
 * The "Update Delivery Status" action appends a new tracking event and
 * advances Shipment.status - the last step of the Shipping workflow.
 */
const Tracking = ({ id }) => {
  const [shipment, setShipment] = useState(null)
  const [events, setEvents] = useState([])
  const [location, setLocation] = useState('')
  const [nextStatus, setNextStatus] = useState('')
  const [error, setError] = useState(false)

  const fetchData = useCallback(() => {
    getShipmentById(id)
      .then(data => {
        setShipment(data)
        setError(false)
        setNextStatus(NEXT_STATUS[data.status] || '')

        return getTrackingEvents(data.id)
      })
      .then(evts => setEvents(evts || []))
      .catch(() => setError(true))
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleUpdateStatus = async () => {
    if (!nextStatus) return
    try {
      await updateShipment(shipment.id, { status: nextStatus, location: location || shipment.order?.shippingAddress?.city })
      toast.success(`Shipment marked as ${nextStatus}`)
      setLocation('')
      fetchData()
    } catch {
      toast.error('Unable to update shipment status')
    }
  }

  if (error) {
    return (
      <Alert severity='error'>
        Shipment with id {id} does not exist. <Link href='/shipping/shipments'>Back to Shipments</Link>
      </Alert>
    )
  }

  if (!shipment) return null

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title='Shipment Details' />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant='body2'>Order</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {shipment.order?.orderNumber}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant='body2'>Courier</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {shipment.courier?.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant='body2'>Tracking #</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {shipment.trackingNumber}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant='body2'>Status</Typography>
              <CustomChip
                size='small'
                skin='light'
                color={statusColors[shipment.status] || 'primary'}
                label={shipment.status}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
            <Divider sx={{ mb: 4 }} />
            {nextStatus ? (
              <>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id='next-status-select'>Update Status To</InputLabel>
                  <Select
                    label='Update Status To'
                    labelId='next-status-select'
                    value={nextStatus}
                    onChange={e => setNextStatus(e.target.value)}
                  >
                    {Object.keys(statusColors)
                      .filter(s => s !== 'pending')
                      .map(s => (
                        <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>
                          {s}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Button fullWidth variant='contained' onClick={handleUpdateStatus}>
                  Update Delivery Status
                </Button>
              </>
            ) : (
              <Typography variant='body2'>This shipment has reached a final status.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title='Tracking Timeline' />
          <Divider sx={{ m: '0 !important' }} />
          <CardContent>
            {events.length === 0 ? (
              <Typography variant='body2'>No tracking events yet.</Typography>
            ) : (
              <Timeline>
                {events.map(event => (
                  <TimelineItem key={event.id}>
                    <TimelineSeparator>
                      <TimelineDot color={statusColors[event.status] || 'primary'} variant='outlined' />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                          variant='body2'
                          sx={{ mr: 2, fontWeight: 600, color: 'text.primary', textTransform: 'capitalize' }}
                        >
                          {event.status}
                        </Typography>
                        <Typography variant='caption'>{formatKarachiDate(event.timestamp)}</Typography>
                      </Box>
                      <Typography variant='body2' sx={{ color: 'text.primary' }}>
                        {event.location} - {event.note}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Tracking
