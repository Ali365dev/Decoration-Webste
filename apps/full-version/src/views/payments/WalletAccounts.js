// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Switch from '@mui/material/Switch'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import TableContainer from '@mui/material/TableContainer'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Import
import {
  getWalletAccounts,
  createWalletAccount,
  updateWalletAccount,
  deleteWalletAccount
} from 'src/services/walletAccounts'

const emptyForm = { accountTitle: '', provider: 'Easypaisa', walletNumber: '', isActive: true }

/**
 * Wallet Accounts (Easypaisa/JazzCash/SadaPay) config CRUD - same
 * table+dialog pattern as BankAccounts.js (BillingAddressCard.js shape).
 */
const WalletAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchAccounts = useCallback(() => {
    getWalletAccounts().then(data => setAccounts(data.walletAccounts))
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleOpenAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const handleOpenEdit = account => {
    setEditingId(account.id)
    setForm(account)
    setOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateWalletAccount(editingId, form)
        toast.success('Wallet account updated')
      } else {
        await createWalletAccount(form)
        toast.success('Wallet account added')
      }
      setOpen(false)
      fetchAccounts()
    } catch {
      toast.error('Unable to save wallet account')
    }
  }

  const handleDelete = async id => {
    await deleteWalletAccount(id)
    toast.success('Wallet account removed')
    fetchAccounts()
  }

  const handleToggleActive = async account => {
    await updateWalletAccount(account.id, { isActive: !account.isActive })
    fetchAccounts()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Wallet Accounts'
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={handleOpenAdd}>
                Add Wallet Account
              </Button>
            }
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account Title</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Wallet Number</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map(account => (
                  <TableRow key={account.id}>
                    <TableCell>{account.accountTitle}</TableCell>
                    <TableCell>{account.provider}</TableCell>
                    <TableCell>{account.walletNumber}</TableCell>
                    <TableCell>
                      <Switch checked={!!account.isActive} onChange={() => handleToggleActive(account)} />
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton size='small' onClick={() => handleOpenEdit(account)}>
                        <Icon icon='mdi:pencil-outline' />
                      </IconButton>
                      <IconButton size='small' onClick={() => handleDelete(account.id)}>
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
        <DialogTitle>{editingId ? 'Edit Wallet Account' : 'Add Wallet Account'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Account Title'
                value={form.accountTitle}
                onChange={e => setForm({ ...form, accountTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='wallet-provider-select'>Provider</InputLabel>
                <Select
                  label='Provider'
                  labelId='wallet-provider-select'
                  value={form.provider}
                  onChange={e => setForm({ ...form, provider: e.target.value })}
                >
                  {['Easypaisa', 'JazzCash', 'SadaPay'].map(p => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Wallet Number'
                value={form.walletNumber}
                onChange={e => setForm({ ...form, walletNumber: e.target.value })}
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

export default WalletAccounts
