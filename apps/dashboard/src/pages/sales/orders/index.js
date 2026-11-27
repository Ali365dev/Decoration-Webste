// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Import
import { getOrders, deleteOrder, updateOrder } from 'src/services/orders'

// ** Export Util
import exportToCSV from 'src/@core/utils/exportCsv'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Vars
const orderStatusObj = {
  pending: { color: 'warning', icon: 'mdi:clock-outline' },
  processing: { color: 'info', icon: 'mdi:progress-clock' },
  shipped: { color: 'primary', icon: 'mdi:truck-fast-outline' },
  delivered: { color: 'success', icon: 'mdi:check' },
  cancelled: { color: 'error', icon: 'mdi:close-circle-outline' },
  returned: { color: 'secondary', icon: 'mdi:undo-variant' }
}

const avatarColors = ['primary', 'success', 'error', 'warning', 'info', 'secondary']

// ** renders client column
const renderClient = row => {
  const color = avatarColors[row.customerId % avatarColors.length]

  return (
    <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '1rem', width: 34, height: 34 }}>
      {getInitials(row.customerName || 'Customer')}
    </CustomAvatar>
  )
}

const defaultColumns = [
  {
    flex: 0.12,
    field: 'orderNumber',
    minWidth: 110,
    headerName: 'Order #',
    renderCell: ({ row }) => <LinkStyled href={`/sales/orders/preview/${row.id}`}>{row.orderNumber}</LinkStyled>
  },
  {
    flex: 0.08,
    minWidth: 80,
    field: 'status',
    renderHeader: () => (
      <Box sx={{ display: 'flex', color: 'action.active' }}>
        <Icon icon='mdi:trending-up' fontSize={20} />
      </Box>
    ),
    renderCell: ({ row }) => {
      const { status, paymentMethod, createdAt } = row
      const color = orderStatusObj[status] ? orderStatusObj[status].color : 'primary'

      return (
        <Tooltip
          title={
            <div>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600, textTransform: 'capitalize' }}>
                {status}
              </Typography>
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Payment:
              </Typography>{' '}
              {paymentMethod}
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Placed:
              </Typography>{' '}
              {formatKarachiDate(createdAt)}
            </div>
          }
        >
          <CustomAvatar skin='light' color={color} sx={{ width: 34, height: 34 }}>
            <Icon icon={orderStatusObj[status]?.icon ?? 'mdi:help'} fontSize='1.25rem' />
          </CustomAvatar>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.22,
    field: 'customerName',
    minWidth: 260,
    headerName: 'Customer',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant='body2'
              sx={{ color: 'text.primary', fontWeight: 500, lineHeight: '22px', letterSpacing: '.1px' }}
            >
              {row.customerName}
            </Typography>
            <Typography noWrap variant='caption'>
              {row.customerEmail}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.12,
    minWidth: 110,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }) => <Typography variant='body2'>{formatPKR(row.total || 0)}</Typography>
  },
  {
    flex: 0.14,
    minWidth: 130,
    field: 'createdAt',
    headerName: 'Placed On',
    renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.createdAt)}</Typography>
  },
  {
    flex: 0.12,
    minWidth: 120,
    field: 'paymentMethod',
    headerName: 'Payment',
    renderCell: ({ row }) => <Typography variant='body2'>{row.paymentMethod}</Typography>
  }
]

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' }
]

const OrderList = () => {
  // ** Router - drives the status filter via ?status= query param so every
  // ** nav sub-item (Pending/Processing/...) can point at this one page
  const router = useRouter()
  const statusFromQuery = typeof router.query.status === 'string' ? router.query.status : ''

  // ** State
  const [rows, setRows] = useState([])
  const [value, setValue] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [statusValue, setStatusValue] = useState(statusFromQuery)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Keep local filter state in sync when the query param changes (nav click)
  useEffect(() => {
    setStatusValue(statusFromQuery)
  }, [statusFromQuery])

  const fetchOrders = useCallback(() => {
    getOrders({ q: value, status: statusValue })
      .then(res => setRows(res.orders))
      .catch(() => toast.error('Unable to load orders'))
  }, [value, statusValue])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleFilter = val => {
    setValue(val)
  }

  const handleStatusValue = e => {
    const nextStatus = e.target.value
    setStatusValue(nextStatus)
    router.replace({ pathname: '/sales/orders', query: nextStatus ? { status: nextStatus } : {} }, undefined, {
      shallow: true
    })
  }

  const handleDelete = id => {
    deleteOrder(id)
      .then(() => {
        toast.success('Order deleted')
        fetchOrders()
      })
      .catch(() => toast.error('Unable to delete order'))
  }

  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10)
    exportToCSV(`orders-${date}.csv`, rows, [
      { label: 'Order #', value: r => r.orderNumber },
      { label: 'Customer', value: r => r.customerName },
      { label: 'Email', value: r => r.customerEmail },
      { label: 'Total (PKR)', value: r => r.total },
      { label: 'Status', value: r => r.status },
      { label: 'Payment', value: r => r.paymentMethod },
      { label: 'City', value: r => r.shippingAddress?.city ?? '' },
      { label: 'Date', value: r => r.createdAt?.slice(0, 10) ?? '' }
    ])
  }

  const handleBulkStatusChange = async status => {
    if (!selectedRows.length) return
    await Promise.all(selectedRows.map(id => updateOrder(id, { status })))
    toast.success(`${selectedRows.length} order${selectedRows.length > 1 ? 's' : ''} marked as ${status}`)
    setSelectedRows([])
    fetchOrders()
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Order'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleDelete(row.id)}>
              <Icon icon='mdi:delete-outline' />
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/sales/orders/preview/${row.id}`}>
              <Icon icon='mdi:eye-outline' />
            </IconButton>
          </Tooltip>
          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            iconButtonProps={{ size: 'small' }}
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            options={[
              {
                text: 'View Customer',
                href: `/customers/view/overview?id=${row.customerId}`,
                icon: <Icon icon='mdi:account-outline' fontSize={20} />
              },
              {
                text: 'Edit',
                href: `/sales/orders/edit/${row.id}`,
                icon: <Icon icon='mdi:pencil-outline' fontSize={20} />
              }
            ]}
          />
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='order-status-select'>Order Status</InputLabel>

                  <Select
                    fullWidth
                    value={statusValue}
                    sx={{ mr: 4, mb: 2 }}
                    label='Order Status'
                    onChange={handleStatusValue}
                    labelId='order-status-select'
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} onBulkStatusChange={handleBulkStatusChange} onExport={handleExport} />
          <DataGrid
            autoHeight
            pagination
            rows={rows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={rows => setSelectedRows(rows)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default OrderList
