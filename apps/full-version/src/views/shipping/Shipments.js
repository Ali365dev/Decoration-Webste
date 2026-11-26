// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getShipments } from 'src/services/shipments'

// ** Utils Import
import { formatKarachiDate } from 'src/@core/utils/format'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const statusColors = {
  pending: 'secondary',
  picked: 'info',
  'in-transit': 'primary',
  'out-for-delivery': 'warning',
  delivered: 'success',
  failed: 'error'
}

const statusOptions = ['', 'pending', 'picked', 'in-transit', 'out-for-delivery', 'delivered', 'failed']

/**
 * Shipments list, reusing the orders/invoice-list DataGrid pattern
 * (src/pages/sales/orders/index.js), linking each row to its Tracking timeline.
 */
const Shipments = () => {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [status, setStatus] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const fetchShipments = useCallback(() => {
    getShipments({ status }).then(data => setRows(data.shipments))
  }, [status])

  useEffect(() => {
    fetchShipments()
  }, [fetchShipments])

  const columns = [
    {
      flex: 0.16,
      field: 'orderNumber',
      minWidth: 120,
      headerName: 'Order #',
      renderCell: ({ row }) => <LinkStyled href={`/sales/orders/preview/${row.orderId}`}>{row.orderNumber}</LinkStyled>
    },
    { flex: 0.18, field: 'trackingNumber', minWidth: 150, headerName: 'Tracking #' },
    { flex: 0.18, field: 'courierName', minWidth: 150, headerName: 'Courier' },
    {
      flex: 0.16,
      field: 'status',
      minWidth: 140,
      headerName: 'Status',
      renderCell: ({ row }) => (
        <CustomChip
          size='small'
          skin='light'
          color={statusColors[row.status] || 'primary'}
          label={row.status}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    {
      flex: 0.16,
      field: 'createdAt',
      minWidth: 140,
      headerName: 'Created',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.createdAt)}</Typography>
    },
    {
      flex: 0.12,
      field: 'actions',
      minWidth: 100,
      sortable: false,
      headerName: 'Tracking',
      renderCell: ({ row }) => <LinkStyled href={`/shipping/tracking/${row.id}`}>Track</LinkStyled>
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
                  <InputLabel id='shipment-status-select'>Status</InputLabel>
                  <Select label='Status' labelId='shipment-status-select' value={status} onChange={e => setStatus(e.target.value)}>
                    {statusOptions.map(s => (
                      <MenuItem key={s || 'all'} value={s} sx={{ textTransform: 'capitalize' }}>
                        {s || 'All Statuses'}
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
          <CardHeader title='Shipments' />
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            getRowId={row => row.id}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowClick={({ row }) => router.push(`/shipping/tracking/${row.id}`)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default Shipments
