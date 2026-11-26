// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Switch from '@mui/material/Switch'
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
import { getCouriers, createCourier, updateCourier, deleteCourier } from 'src/services/couriers'

const emptyForm = { name: '', phone: '', isActive: true }

/**
 * Couriers table+dialog CRUD, same TableBasic.js + Dialog pattern as
 * ShippingZones.js / BankAccounts.js.
 */
const Couriers = () => {
  const [couriers, setCouriers] = useState([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchCouriers = useCallback(() => {
    getCouriers().then(data => setCouriers(data.couriers))
  }, [])

  useEffect(() => {
    fetchCouriers()
  }, [fetchCouriers])

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const handleOpenEdit = courier => {
    setEditingId(courier.id)
    setForm(courier)
    setOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateCourier(editingId, form)
        toast.success('Courier updated')
      } else {
        await createCourier(form)
        toast.success('Courier added')
      }
      setOpen(false)
      fetchCouriers()
    } catch {
      toast.error('Unable to save courier')
    }
  }

  const handleDelete = async id => {
    await deleteCourier(id)
    toast.success('Courier removed')
    fetchCouriers()
  }

  const handleToggleActive = async courier => {
    await updateCourier(courier.id, { isActive: !courier.isActive })
    fetchCouriers()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Couriers'
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={handleOpenAdd}>
                Add Courier
              </Button>
            }
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {couriers.map(courier => (
                  <TableRow key={courier.id}>
                    <TableCell>{courier.name}</TableCell>
                    <TableCell>{courier.phone}</TableCell>
                    <TableCell>
                      <Switch checked={!!courier.isActive} onChange={() => handleToggleActive(courier)} />
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton size='small' onClick={() => handleOpenEdit(courier)}>
                        <Icon icon='mdi:pencil-outline' />
                      </IconButton>
                      <IconButton size='small' onClick={() => handleDelete(courier.id)}>
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
        <DialogTitle>{editingId ? 'Edit Courier' : 'Add Courier'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label='Courier Name' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Phone' value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
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

export default Couriers
