// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Import
import { getCouriers } from 'src/services/couriers'
import { createShipment } from 'src/services/shipments'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

/**
 * Create Shipment drawer, triggered from Order Detail. Modeled on
 * AddPaymentDrawer.js's slide-in drawer shell (header + form + actions),
 * which is the closest existing interaction analog per ECOMMERCE_WORKFLOW_MAP.md
 * workflow 6. Assigns a Courier (autocomplete/select) and an optional
 * tracking number - the first two steps of the Shipping workflow.
 */
const CreateShipmentDrawer = ({ open, toggle, orderId, onCreated }) => {
  const [couriers, setCouriers] = useState([])
  const [courierId, setCourierId] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  useEffect(() => {
    if (open) {
      getCouriers().then(data => setCouriers(data.couriers.filter(c => c.isActive)))
    }
  }, [open])

  const handleSubmit = async () => {
    if (!courierId) {
      toast.error('Please select a courier')

      return
    }
    try {
      const shipment = await createShipment({ orderId, courierId, trackingNumber })
      toast.success('Shipment created')
      setCourierId('')
      setTrackingNumber('')
      toggle()
      onCreated?.(shipment)
    } catch {
      toast.error('Unable to create shipment')
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      onClose={toggle}
      variant='temporary'
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
    >
      <Header>
        <Typography variant='h6'>Create Shipment</Typography>
        <IconButton size='small' onClick={toggle} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <Box sx={{ mb: 6 }}>
          <FormControl fullWidth>
            <InputLabel id='courier-select'>Assign Courier</InputLabel>
            <Select label='Assign Courier' labelId='courier-select' value={courierId} onChange={e => setCourierId(e.target.value)}>
              {couriers.map(c => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mb: 6 }}>
          <TextField
            fullWidth
            label='Tracking Number (optional)'
            placeholder='Auto-generated if left blank'
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
          />
        </Box>
        <div>
          <Button size='large' variant='contained' onClick={handleSubmit} sx={{ mr: 4 }}>
            Create Shipment
          </Button>
          <Button size='large' variant='outlined' color='secondary' onClick={toggle}>
            Cancel
          </Button>
        </div>
      </Box>
    </Drawer>
  )
}

export default CreateShipmentDrawer
