// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

// ** Services Imports
import { getCustomers, deleteCustomer } from 'src/services/customers'

// ** Export Util
import exportToCSV from 'src/@core/utils/exportCsv'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'

const avatarColors = ['primary', 'success', 'error', 'warning', 'info', 'secondary']

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column
const renderClient = row => {
  const color = avatarColors[row.id % avatarColors.length]

  return (
    <CustomAvatar skin='light' color={color} sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
      {getInitials(row.name || 'Customer')}
    </CustomAvatar>
  )
}

const RowOptions = ({ id, onDeleted }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    deleteCustomer(id)
      .then(() => {
        toast.success('Customer deleted')
        onDeleted()
      })
      .catch(() => toast.error('Unable to delete customer'))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href={`/customers/view/overview?id=${id}`}
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const CustomerList = () => {
  // ** State
  const [rows, setRows] = useState([])
  const [value, setValue] = useState('')
  const [addCustomerOpen, setAddCustomerOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const fetchCustomers = useCallback(() => {
    getCustomers({ q: value })
      .then(res => setRows(res.customers))
      .catch(() => toast.error('Unable to load customers'))
  }, [value])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10)
    exportToCSV(`customers-${date}.csv`, rows, [
      { label: 'Name', value: r => r.name },
      { label: 'Email', value: r => r.email },
      { label: 'Phone', value: r => r.phone },
      { label: 'City', value: r => r.city },
      { label: 'Total Orders', value: r => r.totalOrders },
      { label: 'Total Spent (PKR)', value: r => r.totalSpent },
      { label: 'Joined', value: r => r.joinedAt?.slice(0, 10) ?? '' }
    ])
  }

  const statsHorizontal = [
    {
      stats: rows.length,
      title: 'Total Customers',
      color: 'primary',
      icon: 'mdi:account-group-outline'
    },
    {
      stats: formatPKR(rows.reduce((sum, c) => sum + (c.totalSpent || 0), 0)),
      title: 'Lifetime Spend',
      color: 'success',
      icon: 'mdi:cash-multiple'
    },
    {
      stats: rows.reduce((sum, c) => sum + (c.totalOrders || 0), 0),
      title: 'Orders Placed',
      color: 'info',
      icon: 'mdi:cart-outline'
    }
  ]

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'name',
      headerName: 'Customer',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <LinkStyled href={`/customers/view/overview?id=${row.id}`}>{row.name}</LinkStyled>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'phone',
      headerName: 'Phone',
      renderCell: ({ row }) => <Typography noWrap variant='body2'>{row.phone}</Typography>
    },
    {
      flex: 0.12,
      minWidth: 120,
      field: 'city',
      headerName: 'City',
      renderCell: ({ row }) => <Typography noWrap variant='body2'>{row.city}</Typography>
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'totalOrders',
      headerName: 'Orders',
      renderCell: ({ row }) => <Typography variant='body2'>{row.totalOrders}</Typography>
    },
    {
      flex: 0.14,
      minWidth: 120,
      field: 'totalSpent',
      headerName: 'Total Spent',
      renderCell: ({ row }) => <Typography variant='body2'>{formatPKR(row.totalSpent)}</Typography>
    },
    {
      flex: 0.12,
      minWidth: 120,
      field: 'joinedAt',
      headerName: 'Joined',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.joinedAt)}</Typography>
    },
    {
      flex: 0.08,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions id={row.id} onDeleted={fetchCustomers} />
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
          <CardHeader title='Customers' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddCustomerDrawer} onExport={handleExport} />
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

      <AddUserDrawer open={addCustomerOpen} toggle={toggleAddCustomerDrawer} onAdded={fetchCustomers} />
    </Grid>
  )
}

export default CustomerList
