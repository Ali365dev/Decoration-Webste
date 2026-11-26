// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getCodQueue, reconcileCodTransactions } from 'src/services/transactions'

// ** Utils Import
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

/**
 * COD Reconciliation: bulk-mark Cash-on-Delivery orders as "cash collected".
 * Reuses the DataGrid checkboxSelection + bulk-action pattern from
 * views/table/data-grid/TableSelection.js. Deliberately a SEPARATE screen/table
 * from PaymentVerification.js - COD cash collection is not bank/wallet receipt
 * verification, even though both ultimately mark a Transaction "verified".
 */
const CodReconciliation = () => {
  const [rows, setRows] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const fetchQueue = useCallback(() => {
    getCodQueue().then(data => setRows(data.transactions))
  }, [])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  const handleReconcile = async () => {
    if (!selectedIds.length) return
    try {
      await reconcileCodTransactions(selectedIds)
      toast.success(`${selectedIds.length} COD order(s) marked as collected`)
      setSelectedIds([])
      fetchQueue()
    } catch {
      toast.error('Unable to reconcile selected orders')
    }
  }

  const columns = [
    { flex: 0.16, field: 'orderNumber', minWidth: 120, headerName: 'Order #' },
    {
      flex: 0.16,
      field: 'amount',
      minWidth: 120,
      headerName: 'Amount Due',
      renderCell: ({ row }) => <Typography variant='body2'>{formatPKR(row.amount)}</Typography>
    },
    { flex: 0.16, field: 'orderStatus', minWidth: 120, headerName: 'Order Status', renderCell: ({ row }) => (
      <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>{row.orderStatus}</Typography>
    ) },
    {
      flex: 0.16,
      field: 'codReconciled',
      minWidth: 140,
      headerName: 'Cash Collected',
      renderCell: ({ row }) =>
        row.codReconciled ? (
          <CustomChip size='small' skin='light' color='success' label='Collected' />
        ) : (
          <CustomChip size='small' skin='light' color='warning' label='Awaiting Collection' />
        )
    },
    {
      flex: 0.16,
      field: 'createdAt',
      minWidth: 140,
      headerName: 'Order Date',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.createdAt)}</Typography>
    }
  ]

  // ** Only un-reconciled rows are selectable for the bulk action
  const isRowSelectable = ({ row }) => !row.codReconciled

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='COD Reconciliation'
            subheader='Mark Cash-on-Delivery orders as collected once the rider/courier hands over the cash'
            action={
              <Button
                variant='contained'
                disabled={!selectedIds.length}
                startIcon={<Icon icon='mdi:cash-check' />}
                onClick={handleReconcile}
              >
                Mark {selectedIds.length || ''} as Collected
              </Button>
            }
          />
          <Box sx={{ px: 6, pb: 2 }}>
            <Typography variant='caption'>
              This is separate from Payment Verification - COD cash is collected on delivery, not verified from a bank/wallet
              receipt.
            </Typography>
          </Box>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            isRowSelectable={isRowSelectable}
            getRowId={row => row.id}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={ids => setSelectedIds(ids)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default CodReconciliation
