// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Stepper from '@mui/material/Stepper'
import Divider from '@mui/material/Divider'
import StepLabel from '@mui/material/StepLabel'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getRefunds, updateRefundStatus } from 'src/services/refunds'

// ** Utils Import
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

const statusColors = { pending: 'warning', approved: 'success', rejected: 'error' }
const steps = ['Requested', 'Reviewed', 'Resolved']

const statusToStep = status => {
  if (status === 'pending') return 0
  
return 2
}

/**
 * Refunds: request -> review -> approve/reject -> refunded, reusing the
 * Stepper/Step/StepLabel components from StepperLinearWithValidation.js to
 * visualise the refund's progress inside the review dialog.
 */
const Refunds = () => {
  const [rows, setRows] = useState([])
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const fetchRefunds = useCallback(() => {
    getRefunds().then(data => setRows(data.refunds))
  }, [])

  useEffect(() => {
    fetchRefunds()
  }, [fetchRefunds])

  const handleReview = row => {
    setSelected(row)
    setOpen(true)
  }

  const handleDecision = async status => {
    if (!selected) return
    try {
      await updateRefundStatus(selected.id, status)
      toast.success(`Refund for ${selected.orderNumber} ${status}`)
      setOpen(false)
      setSelected(null)
      fetchRefunds()
    } catch {
      toast.error('Unable to update refund')
    }
  }

  const columns = [
    { flex: 0.16, field: 'orderNumber', minWidth: 120, headerName: 'Order #' },
    {
      flex: 0.16,
      field: 'amount',
      minWidth: 120,
      headerName: 'Amount',
      renderCell: ({ row }) => <Typography variant='body2'>{formatPKR(row.amount)}</Typography>
    },
    { flex: 0.3, field: 'reason', minWidth: 220, headerName: 'Reason' },
    {
      flex: 0.14,
      field: 'status',
      minWidth: 120,
      headerName: 'Status',
      renderCell: ({ row }) => (
        <CustomChip size='small' skin='light' color={statusColors[row.status] || 'primary'} label={row.status} sx={{ textTransform: 'capitalize' }} />
      )
    },
    {
      flex: 0.14,
      field: 'createdAt',
      minWidth: 140,
      headerName: 'Requested',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.createdAt)}</Typography>
    },
    {
      flex: 0.1,
      field: 'actions',
      minWidth: 90,
      sortable: false,
      headerName: 'Review',
      renderCell: ({ row }) => (
        <IconButton size='small' onClick={() => handleReview(row)}>
          <Icon icon='mdi:file-search-outline' />
        </IconButton>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Refunds' />
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            getRowId={row => row.id}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <Dialog fullWidth open={open} onClose={() => setOpen(false)} maxWidth='sm'>
        <DialogContent sx={{ pt: 8 }}>
          {selected && (
            <Box>
              <Stepper activeStep={statusToStep(selected.status)} sx={{ mb: 6 }}>
                {steps.map(label => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Divider sx={{ mb: 4 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='body2'>Order</Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {selected.orderNumber}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='body2'>Amount</Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {formatPKR(selected.amount)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='body2'>Reason</Typography>
                <Typography variant='body2'>{selected.reason}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 6 }}>
          <Button
            variant='contained'
            color='success'
            sx={{ mr: 2 }}
            disabled={selected?.status !== 'pending'}
            onClick={() => handleDecision('approved')}
          >
            Approve
          </Button>
          <Button
            variant='contained'
            color='error'
            sx={{ mr: 2 }}
            disabled={selected?.status !== 'pending'}
            onClick={() => handleDecision('rejected')}
          >
            Reject
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Refunds
