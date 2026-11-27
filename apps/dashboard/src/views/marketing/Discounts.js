// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import TableContainer from '@mui/material/TableContainer'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Import
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount } from 'src/services/discounts'
import { getCategories } from 'src/services/categories'
import { getProducts } from 'src/services/products'

const emptyForm = { name: '', scope: 'category', targetId: '', percent: 10 }

/**
 * Discounts screen: TableBasic + Dialog CRUD pattern, with product/category
 * rule targets pulled from the real Phase 4 catalog.
 */
const Discounts = () => {
  const [discounts, setDiscounts] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchDiscounts = useCallback(async () => {
    const data = await getDiscounts()
    setDiscounts(data.discounts)
  }, [])

  useEffect(() => {
    fetchDiscounts()
    getCategories().then(data => setCategories(data.categories))
    getProducts().then(data => setProducts(data.products))
  }, [fetchDiscounts])

  const targetOptions = form.scope === 'category' ? categories : products

  const handleOpenAdd = () => {
    setEditId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const handleOpenEdit = row => {
    setEditId(row.id)
    setForm({ name: row.name, scope: row.scope, targetId: row.targetId, percent: row.percent })
    setOpen(true)
  }

  const handleSubmit = async () => {
    const options = form.scope === 'category' ? categories : products
    const target = options.find(o => String(o.id) === String(form.targetId))

    const payload = {
      name: form.name,
      scope: form.scope,
      targetId: form.scope === 'category' ? form.targetId : Number(form.targetId),
      targetLabel: target ? target.name : '',
      percent: Number(form.percent)
    }

    if (editId) {
      await updateDiscount(editId, payload)
      toast.success('Discount updated')
    } else {
      await createDiscount(payload)
      toast.success('Discount created')
    }
    setOpen(false)
    fetchDiscounts()
  }

  const handleToggleActive = async row => {
    await updateDiscount(row.id, { isActive: !row.isActive })
    toast.success(`Discount ${row.isActive ? 'deactivated' : 'activated'}`)
    fetchDiscounts()
  }

  const handleDelete = async row => {
    await deleteDiscount(row.id)
    toast.success('Discount deleted')
    fetchDiscounts()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Discounts'
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={handleOpenAdd}>
                Add Discount
              </Button>
            }
          />
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Scope</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {discounts.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{row.scope}</TableCell>
                    <TableCell>{row.targetLabel}</TableCell>
                    <TableCell>{row.percent}%</TableCell>
                    <TableCell>
                      <Switch size='small' checked={row.isActive} onChange={() => handleToggleActive(row)} />
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton size='small' onClick={() => handleOpenEdit(row)}>
                        <Icon icon='mdi:pencil-outline' fontSize={20} />
                      </IconButton>
                      <IconButton size='small' onClick={() => handleDelete(row)}>
                        <Icon icon='mdi:delete-outline' fontSize={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>

      <Dialog maxWidth='sm' fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? 'Edit Discount' : 'Add Discount'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Discount Name'
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Scope</InputLabel>
                <Select
                  label='Scope'
                  value={form.scope}
                  onChange={e => setForm({ ...form, scope: e.target.value, targetId: '' })}
                >
                  <MenuItem value='category'>Category</MenuItem>
                  <MenuItem value='product'>Product</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{form.scope === 'category' ? 'Category' : 'Product'}</InputLabel>
                <Select
                  label={form.scope === 'category' ? 'Category' : 'Product'}
                  value={form.targetId}
                  onChange={e => setForm({ ...form, targetId: e.target.value })}
                >
                  {targetOptions.map(opt => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                label='Discount Percent'
                value={form.percent}
                onChange={e => setForm({ ...form, percent: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit} disabled={!form.name || !form.targetId}>
            {editId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Discounts
