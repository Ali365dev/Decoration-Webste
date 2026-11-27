// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
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
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { formatKarachiDate } from 'src/@core/utils/format'

// ** Services Imports
import { getStaff, createStaff, updateStaff, deleteStaff } from 'src/services/staff'

const ROLE_OPTIONS = ['Store Owner', 'Store Manager', 'Catalog Editor', 'Order Fulfillment', 'Support']

const statusColors = { active: 'success', invited: 'warning', suspended: 'error' }
const avatarColors = ['primary', 'success', 'error', 'warning', 'info', 'secondary']

const emptyForm = { name: '', email: '', role: 'Support', status: 'invited' }

/**
 * Staff Members screen. Reuses the same DataGrid + stats-card + search +
 * Add dialog shape as /customers (Phase 2's thin wrapper now replaced with a
 * real Staff entity), but with Role/Status columns instead of
 * customer-specific phone/city/spend columns.
 */
const StaffList = () => {
  const [rows, setRows] = useState([])
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const fetchStaff = useCallback(() => {
    getStaff({ q: value })
      .then(res => setRows(res.staff))
      .catch(() => toast.error('Unable to load staff'))
  }, [value])

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  const handleOpenAdd = () => {
    setEditId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const handleOpenEdit = row => {
    setEditId(row.id)
    setForm({ name: row.name, email: row.email, role: row.role, status: row.status })
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (editId) {
      await updateStaff(editId, form)
      toast.success('Staff member updated')
    } else {
      await createStaff(form)
      toast.success('Staff member invited')
    }
    setOpen(false)
    fetchStaff()
  }

  const handleDelete = async row => {
    await deleteStaff(row.id)
    toast.success('Staff member removed')
    fetchStaff()
  }

  const statsHorizontal = [
    { stats: rows.length, title: 'Total Staff', color: 'primary', icon: 'mdi:account-group-outline' },
    {
      stats: rows.filter(s => s.status === 'active').length,
      title: 'Active',
      color: 'success',
      icon: 'mdi:check-circle-outline'
    },
    {
      stats: rows.filter(s => s.status === 'invited').length,
      title: 'Pending Invites',
      color: 'warning',
      icon: 'mdi:email-outline'
    }
  ]

  const columns = [
    {
      flex: 0.25,
      minWidth: 230,
      field: 'name',
      headerName: 'Staff Member',
      renderCell: ({ row }) => {
        const color = avatarColors[row.id % avatarColors.length]

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color={color} sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
              {getInitials(row.name)}
            </CustomAvatar>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{row.name}</Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: 'role',
      headerName: 'Role',
      renderCell: ({ row }) => <CustomChip size='small' skin='light' color='primary' label={row.role} />
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <CustomChip
          size='small'
          skin='light'
          color={statusColors[row.status]}
          label={row.status}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    {
      flex: 0.15,
      minWidth: 130,
      field: 'joinedAt',
      headerName: 'Joined',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.joinedAt)}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
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
        <Grid container spacing={6}>
          {statsHorizontal.map((item, index) => (
            <Grid item xs={12} md={4} sm={6} key={index}>
              <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon} />} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Staff Members'
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={handleOpenAdd}>
                Invite Staff
              </Button>
            }
          />
          <Divider />
          <Box sx={{ p: 4 }}>
            <TextField
              size='small'
              placeholder='Search staff...'
              value={value}
              onChange={e => setValue(e.target.value)}
            />
          </Box>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>

      <Dialog maxWidth='sm' fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? 'Edit Staff Member' : 'Invite Staff Member'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Full Name'
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='email'
                label='Email'
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select label='Role' value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLE_OPTIONS.map(role => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label='Status' value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <MenuItem value='invited'>Invited</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='suspended'>Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit} disabled={!form.name || !form.email}>
            {editId ? 'Update' : 'Invite'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default StaffList
