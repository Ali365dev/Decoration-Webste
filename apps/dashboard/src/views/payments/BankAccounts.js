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
import { getBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } from 'src/services/bankAccounts'

const emptyForm = { accountTitle: '', bankName: '', accountNumber: '', iban: '', isActive: true }

/**
 * Bank Accounts config CRUD, reusing the BillingAddressCard.js pattern of a
 * card list + add/edit dialog (here rendered as a plain MUI Table, per
 * views/table/mui/TableBasic.js, with a Dialog for add/edit).
 */
const BankAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchAccounts = useCallback(() => {
    getBankAccounts().then(data => setAccounts(data.bankAccounts))
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
        await updateBankAccount(editingId, form)
        toast.success('Bank account updated')
      } else {
        await createBankAccount(form)
        toast.success('Bank account added')
      }
      setOpen(false)
      fetchAccounts()
    } catch {
      toast.error('Unable to save bank account')
    }
  }

  const handleDelete = async id => {
    await deleteBankAccount(id)
    toast.success('Bank account removed')
    fetchAccounts()
  }

  const handleToggleActive = async account => {
    await updateBankAccount(account.id, { isActive: !account.isActive })
    fetchAccounts()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Bank Accounts'
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={handleOpenAdd}>
                Add Bank Account
              </Button>
            }
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account Title</TableCell>
                  <TableCell>Bank</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>IBAN</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map(account => (
                  <TableRow key={account.id}>
                    <TableCell>{account.accountTitle}</TableCell>
                    <TableCell>{account.bankName}</TableCell>
                    <TableCell>{account.accountNumber}</TableCell>
                    <TableCell>{account.iban}</TableCell>
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
        <DialogTitle>{editingId ? 'Edit Bank Account' : 'Add Bank Account'}</DialogTitle>
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
              <TextField fullWidth label='Bank Name' value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Account Number'
                value={form.accountNumber}
                onChange={e => setForm({ ...form, accountNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='IBAN' value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })} />
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

export default BankAccounts
