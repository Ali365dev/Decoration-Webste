// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from 'src/services/coupons'

// ** Utils Import
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

const emptyForm = {
  code: '',
  type: 'percentage',
  value: 10,
  minOrderAmount: 1000,
  usageLimit: 100,
  perCustomerLimit: 1,
  expiresAt: new Date().toISOString().slice(0, 10)
}

/**
 * Coupons screen: reuses the Orders-list DataGrid pattern (same page shape as
 * /sales/orders) for a code/type/usage table, with an Add/Edit dialog.
 */
const Coupons = () => {
  // ** State
  const [coupons, setCoupons] = useState([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const fetchCoupons = useCallback(async () => {
    const data = await getCoupons()
    setCoupons(data.coupons)
  }, [])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  const handleOpenAdd = () => {
    setEditId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const handleOpenEdit = row => {
    setEditId(row.id)
    setForm({ ...row, expiresAt: row.expiresAt.slice(0, 10) })
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleSubmit = async () => {
    const payload = {
      ...form,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount),
      usageLimit: Number(form.usageLimit),
      perCustomerLimit: form.perCustomerLimit === '' || form.perCustomerLimit === null ? null : Number(form.perCustomerLimit),
      expiresAt: new Date(form.expiresAt).toISOString()
    }

    if (editId) {
      await updateCoupon(editId, payload)
      toast.success('Coupon updated')
    } else {
      await createCoupon(payload)
      toast.success('Coupon created')
    }
    setOpen(false)
    fetchCoupons()
  }

  const handleToggleActive = async row => {
    await updateCoupon(row.id, { isActive: !row.isActive })
    toast.success(`Coupon ${row.isActive ? 'deactivated' : 'activated'}`)
    fetchCoupons()
  }

  const handleDelete = async row => {
    await deleteCoupon(row.id)
    toast.success('Coupon deleted')
    fetchCoupons()
  }

  const columns = [
    { flex: 0.15, field: 'code', minWidth: 140, headerName: 'Code' },
    {
      flex: 0.15,
      field: 'type',
      minWidth: 140,
      headerName: 'Type',
      renderCell: ({ row }) => (
        <CustomChip size='small' skin='light' label={row.type} sx={{ textTransform: 'capitalize' }} />
      )
    },
    {
      flex: 0.15,
      field: 'value',
      minWidth: 120,
      headerName: 'Value',
      renderCell: ({ row }) => <Typography variant='body2'>{row.type === 'percentage' ? `${row.value}%` : formatPKR(row.value)}</Typography>
    },
    {
      flex: 0.15,
      field: 'minOrderAmount',
      minWidth: 140,
      headerName: 'Min Order',
      renderCell: ({ row }) => <Typography variant='body2'>{formatPKR(row.minOrderAmount)}</Typography>
    },
    {
      flex: 0.15,
      field: 'usage',
      minWidth: 120,
      headerName: 'Usage',
      renderCell: ({ row }) => (
        <Typography variant='body2'>
          {row.usedCount}/{row.usageLimit}
        </Typography>
      )
    },
    {
      flex: 0.14,
      field: 'perCustomerLimit',
      minWidth: 130,
      headerName: 'Per Customer',
      renderCell: ({ row }) => (
        <Typography variant='body2'>
          {row.perCustomerLimit != null ? `${row.perCustomerLimit}×` : 'Unlimited'}
        </Typography>
      )
    },
    {
      flex: 0.15,
      field: 'expiresAt',
      minWidth: 130,
      headerName: 'Expires',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.expiresAt)}</Typography>
    },
    {
      flex: 0.1,
      field: 'isActive',
      minWidth: 100,
      headerName: 'Active',
      renderCell: ({ row }) => <Switch size='small' checked={row.isActive} onChange={() => handleToggleActive(row)} />
    },
    {
      flex: 0.1,
      field: 'actions',
      minWidth: 100,
      sortable: false,
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex' }}>
          <IconButton size='small' onClick={() => handleOpenEdit(row)}>
            <Icon icon='mdi:pencil-outline' fontSize={20} />
          </IconButton>
          <IconButton size='small' onClick={() => handleDelete(row)}>
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Coupons'
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={handleOpenAdd}>
                Add Coupon
              </Button>
            }
          />
          <DataGrid
            autoHeight
            rows={coupons}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <Dialog maxWidth='sm' fullWidth open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Coupon Code'
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select label='Type' value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <MenuItem value='percentage'>Percentage</MenuItem>
                  <MenuItem value='fixed'>Fixed (PKR)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label={form.type === 'percentage' ? 'Value (%)' : 'Value (Rs.)'}
                value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Min Order Amount (Rs.)'
                value={form.minOrderAmount}
                onChange={e => setForm({ ...form, minOrderAmount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Total Usage Limit'
                value={form.usageLimit}
                onChange={e => setForm({ ...form, usageLimit: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Per-Customer Limit'
                placeholder='Leave blank for unlimited'
                value={form.perCustomerLimit ?? ''}
                helperText='Max times one customer can use this coupon'
                onChange={e => setForm({ ...form, perCustomerLimit: e.target.value === '' ? null : e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='date'
                label='Expires At'
                InputLabelProps={{ shrink: true }}
                value={form.expiresAt}
                onChange={e => setForm({ ...form, expiresAt: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit} disabled={!form.code}>
            {editId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Coupons
