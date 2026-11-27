// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import TableContainer from '@mui/material/TableContainer'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Import
import { getShippingZones, createShippingZone, updateShippingZone, deleteShippingZone } from 'src/services/shippingZones'

// ** Utils Import
import { formatPKR } from 'src/@core/utils/format'

const emptyForm = { name: '', deliveryCharge: 0, estimatedDays: 1 }

/**
 * Shipping Zones table+dialog CRUD, modeled on views/table/mui/TableBasic.js
 * with an add/edit Dialog. Delivery Charges (per Phase 6 scope) are folded
 * into this same screen - each zone already carries its own deliveryCharge,
 * so a separate "/shipping/delivery-charges" page would just duplicate this
 * table; that route renders this same component (see pages/shipping/delivery-charges).
 */
const ShippingZones = () => {
  const [zones, setZones] = useState([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchZones = useCallback(() => {
    getShippingZones().then(data => setZones(data.zones))
  }, [])

  useEffect(() => {
    fetchZones()
  }, [fetchZones])

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const handleOpenEdit = zone => {
    setEditingId(zone.id)
    setForm(zone)
    setOpen(true)
  }

  const handleSave = async () => {
    try {
      const payload = { ...form, deliveryCharge: Number(form.deliveryCharge), estimatedDays: Number(form.estimatedDays) }
      if (editingId) {
        await updateShippingZone(editingId, payload)
        toast.success('Shipping zone updated')
      } else {
        await createShippingZone(payload)
        toast.success('Shipping zone added')
      }
      setOpen(false)
      fetchZones()
    } catch {
      toast.error('Unable to save shipping zone')
    }
  }

  const handleDelete = async id => {
    await deleteShippingZone(id)
    toast.success('Shipping zone removed')
    fetchZones()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Shipping Zones & Delivery Charges'
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={handleOpenAdd}>
                Add Zone
              </Button>
            }
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Zone</TableCell>
                  <TableCell>Delivery Charge</TableCell>
                  <TableCell>Estimated Days</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zones.map(zone => (
                  <TableRow key={zone.id}>
                    <TableCell>{zone.name}</TableCell>
                    <TableCell>{formatPKR(zone.deliveryCharge)}</TableCell>
                    <TableCell>{zone.estimatedDays} day(s)</TableCell>
                    <TableCell align='right'>
                      <IconButton size='small' onClick={() => handleOpenEdit(zone)}>
                        <Icon icon='mdi:pencil-outline' />
                      </IconButton>
                      <IconButton size='small' onClick={() => handleDelete(zone.id)}>
                        <Icon icon='mdi:delete-outline' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>

      <Dialog fullWidth open={open} onClose={() => setOpen(false)} maxWidth='sm'>
        <DialogTitle>{editingId ? 'Edit Shipping Zone' : 'Add Shipping Zone'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label='Zone Name' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Delivery Charge (PKR)'
                value={form.deliveryCharge}
                onChange={e => setForm({ ...form, deliveryCharge: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Estimated Days'
                value={form.estimatedDays}
                onChange={e => setForm({ ...form, estimatedDays: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ShippingZones
