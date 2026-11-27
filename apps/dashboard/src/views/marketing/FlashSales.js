// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
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

// ** Services Import
import { getFlashSales, createFlashSale, updateFlashSale, deleteFlashSale } from 'src/services/flashSales'
import { getProducts } from 'src/services/products'

// ** Utils Import
import { formatKarachiDate } from 'src/@core/utils/format'

const emptyForm = {
  name: '',
  productIds: [],
  discountPercent: 20,
  startsAt: new Date().toISOString().slice(0, 10),
  endsAt: new Date().toISOString().slice(0, 10)
}

/**
 * Flash Sales screen. Note on scope: the template's FullCalendar-based
 * Calendar.js/AddEventSidebar.js is built around many recurring calendar
 * events with drag/resize interactions - heavier than what a short list of
 * time-boxed promos needs. A simple start/end date-range form + table gives
 * the same scheduling capability (pick start/end, toggle active) with far
 * less integration surface, so that's what this screen uses.
 */
const FlashSales = () => {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const fetchSales = useCallback(async () => {
    const data = await getFlashSales()
    setSales(data.flashSales)
  }, [])

  useEffect(() => {
    fetchSales()
    getProducts().then(data => setProducts(data.products))
  }, [fetchSales])

  const productName = id => products.find(p => p.id === id)?.name || `Product #${id}`

  const handleOpenAdd = () => {
    setEditId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const handleOpenEdit = row => {
    setEditId(row.id)
    setForm({
      name: row.name,
      productIds: row.productIds,
      discountPercent: row.discountPercent,
      startsAt: row.startsAt.slice(0, 10),
      endsAt: row.endsAt.slice(0, 10)
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    const payload = {
      ...form,
      discountPercent: Number(form.discountPercent),
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString()
    }

    if (editId) {
      await updateFlashSale(editId, payload)
      toast.success('Flash sale updated')
    } else {
      await createFlashSale(payload)
      toast.success('Flash sale created')
    }
    setOpen(false)
    fetchSales()
  }

  const handleToggleActive = async row => {
    await updateFlashSale(row.id, { isActive: !row.isActive })
    toast.success(`Flash sale ${row.isActive ? 'deactivated' : 'activated'}`)
    fetchSales()
  }

  const handleDelete = async row => {
    await deleteFlashSale(row.id)
    toast.success('Flash sale deleted')
    fetchSales()
  }

  const columns = [
    { flex: 0.2, field: 'name', minWidth: 200, headerName: 'Name' },
    {
      flex: 0.25,
      field: 'productIds',
      minWidth: 240,
      headerName: 'Products',
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {row.productIds.slice(0, 2).map(id => (
            <Chip key={id} size='small' label={productName(id)} sx={{ maxWidth: 150 }} />
          ))}
          {row.productIds.length > 2 && <Chip size='small' label={`+${row.productIds.length - 2}`} />}
        </Box>
      )
    },
    {
      flex: 0.12,
      field: 'discountPercent',
      minWidth: 100,
      headerName: 'Discount',
      renderCell: ({ row }) => <Typography variant='body2'>{row.discountPercent}%</Typography>
    },
    {
      flex: 0.17,
      field: 'startsAt',
      minWidth: 150,
      headerName: 'Starts',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.startsAt)}</Typography>
    },
    {
      flex: 0.17,
      field: 'endsAt',
      minWidth: 150,
      headerName: 'Ends',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.endsAt)}</Typography>
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
            title='Flash Sales'
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={handleOpenAdd}>
                Add Flash Sale
              </Button>
            }
          />
          <DataGrid
            autoHeight
            rows={sales}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <Dialog maxWidth='sm' fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? 'Edit Flash Sale' : 'Add Flash Sale'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Flash Sale Name'
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Products</InputLabel>
                <Select
                  multiple
                  label='Products'
                  value={form.productIds}
                  onChange={e => setForm({ ...form, productIds: e.target.value })}
                  renderValue={selected => selected.map(id => productName(id)).join(', ')}
                >
                  {products.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type='number'
                label='Discount %'
                value={form.discountPercent}
                onChange={e => setForm({ ...form, discountPercent: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type='date'
                label='Starts At'
                InputLabelProps={{ shrink: true }}
                value={form.startsAt}
                onChange={e => setForm({ ...form, startsAt: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type='date'
                label='Ends At'
                InputLabelProps={{ shrink: true }}
                value={form.endsAt}
                onChange={e => setForm({ ...form, endsAt: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit} disabled={!form.name || form.productIds.length === 0}>
            {editId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default FlashSales
