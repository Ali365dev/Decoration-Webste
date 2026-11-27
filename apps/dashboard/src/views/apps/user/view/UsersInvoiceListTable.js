// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Services Import
import { getOrdersByCustomer } from 'src/services/orders'

// ** Utils Import
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

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

const columns = [
  {
    flex: 0.25,
    field: 'orderNumber',
    minWidth: 120,
    headerName: 'Order #',
    renderCell: ({ row }) => <LinkStyled href={`/sales/orders/preview/${row.id}`}>{row.orderNumber}</LinkStyled>
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'status',
    renderHeader: () => <Icon icon='mdi:trending-up' fontSize={20} />,
    renderCell: ({ row }) => {
      const color = orderStatusObj[row.status] ? orderStatusObj[row.status].color : 'primary'

      return (
        <Tooltip title={row.status}>
          <CustomAvatar skin='light' color={color} sx={{ width: '1.875rem', height: '1.875rem' }}>
            <Icon icon={orderStatusObj[row.status]?.icon ?? 'mdi:help'} fontSize='1rem' />
          </CustomAvatar>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.25,
    minWidth: 100,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }) => <Typography variant='body2'>{formatPKR(row.total || 0)}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 130,
    field: 'createdAt',
    headerName: 'Placed On',
    renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.createdAt)}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 70,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title='View Order'>
          <IconButton size='small' component={Link} href={`/sales/orders/preview/${row.id}`}>
            <Icon icon='mdi:eye-outline' fontSize={20} />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }
]

const UsersInvoiceListTable = ({ customerId }) => {
  // ** State
  const [orders, setOrders] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  useEffect(() => {
    if (!customerId) return
    getOrdersByCustomer(customerId)
      .then(setOrders)
      .catch(() => toast.error('Unable to load order history'))
  }, [customerId])

  return (
    <Card>
      <CardHeader title='Order History' sx={{ '& .MuiCardHeader-action': { m: 0 } }} />
      <DataGrid
        autoHeight
        columns={columns}
        rows={orders}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
      />
    </Card>
  )
}

export default UsersInvoiceListTable
