// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
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
import TextField from '@mui/material/TextField'
import { DataGrid } from '@mui/x-data-grid'

// ** Services Import
import { getTransactions } from 'src/services/transactions'

// ** Utils Import
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Styled component for the link in the dataTable (same shape as Orders list)
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const statusColors = {
  pending: 'warning',
  verified: 'success',
  rejected: 'error',
  refunded: 'secondary'
}

const methodOptions = ['', 'COD', 'Bank Transfer', 'Easypaisa', 'JazzCash', 'SadaPay']

/**
 * Transaction list, reusing the invoice/order-list DataGrid pattern
 * (src/pages/sales/orders/index.js) with Transaction-specific columns.
 */
const TransactionList = () => {
  const router = useRouter()
  const orderIdFromQuery = typeof router.query.orderId === 'string' ? router.query.orderId : ''

  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [method, setMethod] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const fetchTransactions = useCallback(() => {
    getTransactions({ q, status, method, orderId: orderIdFromQuery }).then(data => setRows(data.transactions))
  }, [q, status, method, orderIdFromQuery])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const columns = [
    {
      flex: 0.14,
      field: 'orderNumber',
      minWidth: 120,
      headerName: 'Order #',
      renderCell: ({ row }) => <LinkStyled href={`/sales/orders/preview/${row.orderId}`}>{row.orderNumber}</LinkStyled>
    },
    {
      flex: 0.16,
      field: 'method',
      minWidth: 130,
      headerName: 'Method',
      renderCell: ({ row }) => <Typography variant='body2'>{row.method}</Typography>
    },
    {
      flex: 0.14,
      field: 'amount',
      minWidth: 120,
      headerName: 'Amount',
      renderCell: ({ row }) => <Typography variant='body2'>{formatPKR(row.amount)}</Typography>
    },
    {
      flex: 0.18,
      field: 'reference',
      minWidth: 160,
      headerName: 'Reference',
      renderCell: ({ row }) => <Typography variant='body2'>{row.reference}</Typography>
    },
    {
      flex: 0.14,
      field: 'status',
      minWidth: 120,
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
      headerName: 'Date',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.createdAt)}</Typography>
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label='Search' placeholder='Order # / reference' value={q} onChange={e => setQ(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='tx-status-select'>Status</InputLabel>
                  <Select label='Status' labelId='tx-status-select' value={status} onChange={e => setStatus(e.target.value)}>
                    <MenuItem value=''>All Statuses</MenuItem>
                    {Object.keys(statusColors).map(s => (
                      <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='tx-method-select'>Method</InputLabel>
                  <Select label='Method' labelId='tx-method-select' value={method} onChange={e => setMethod(e.target.value)}>
                    {methodOptions.map(m => (
                      <MenuItem key={m || 'all'} value={m}>
                        {m || 'All Methods'}
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
          <CardHeader title='Transactions' />
          <DataGrid
            autoHeight
            pagination
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={row => row.id}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default TransactionList
