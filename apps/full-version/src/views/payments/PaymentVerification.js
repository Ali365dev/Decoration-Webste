// ** React Imports
import { useState, useEffect, useCallback, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getVerificationQueue, verifyTransaction } from 'src/services/transactions'

// ** Utils Import
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

const UploadZone = styled(Box)(({ theme, hasImage }) => ({
  border: `2px dashed ${hasImage ? theme.palette.success.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: hasImage ? 0 : theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  overflow: 'hidden',
  '&:hover': { borderColor: theme.palette.primary.main }
}))

const PaymentVerification = () => {
  const [rows, setRows] = useState([])
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [receiptImage, setReceiptImage] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const fileInputRef = useRef(null)

  const fetchQueue = useCallback(() => {
    getVerificationQueue().then(data => setRows(data.transactions))
  }, [])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  const handleReview = row => {
    setSelected(row)
    setReceiptImage(row.receiptImage || null)
    setOpen(true)
  }

  const handleDecision = async status => {
    if (!selected) return
    try {
      await verifyTransaction(selected.id, status)
      toast.success(`Transaction ${selected.reference} ${status}`)
      setOpen(false)
      setSelected(null)
      setReceiptImage(null)
      fetchQueue()
    } catch {
      toast.error('Unable to update transaction')
    }
  }

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setReceiptImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  const columns = [
    { flex: 0.16, field: 'orderNumber', minWidth: 120, headerName: 'Order #' },
    { flex: 0.16, field: 'method', minWidth: 120, headerName: 'Method' },
    {
      flex: 0.16,
      field: 'amount',
      minWidth: 120,
      headerName: 'Amount',
      renderCell: ({ row }) => <Typography variant='body2'>{formatPKR(row.amount)}</Typography>
    },
    { flex: 0.2, field: 'reference', minWidth: 170, headerName: 'Reference / Receipt' },
    {
      flex: 0.16,
      field: 'createdAt',
      minWidth: 140,
      headerName: 'Date',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.createdAt)}</Typography>
    },
    {
      flex: 0.08,
      field: 'hasProof',
      minWidth: 80,
      sortable: false,
      headerName: 'Proof',
      renderCell: ({ row }) =>
        row.receiptImage ? (
          <Icon icon='mdi:image-check' color='success' fontSize={20} />
        ) : (
          <Icon icon='mdi:image-off-outline' color='disabled' fontSize={20} />
        )
    },
    {
      flex: 0.12,
      field: 'actions',
      minWidth: 110,
      sortable: false,
      headerName: 'Actions',
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
          <CardHeader
            title='Payment Verification Queue'
            subheader='Bank Transfer / Easypaisa / JazzCash / SadaPay receipts awaiting review'
          />
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

      <Dialog fullWidth open={open} onClose={() => setOpen(false)} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 520 } }}>
        <DialogContent sx={{ pt: 8 }}>
          {selected && (
            <Box>
              <Typography variant='h6' sx={{ mb: 4 }}>
                Review Transaction
              </Typography>
              <Divider sx={{ mb: 4 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='body2'>Order</Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {selected.orderNumber}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='body2'>Method</Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {selected.method}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='body2'>Amount</Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {formatPKR(selected.amount)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant='body2'>Reference / Receipt</Typography>
                <CustomChip size='small' skin='light' color='info' label={selected.reference} />
              </Box>

              {/* Receipt Image Upload */}
              <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>
                Payment Screenshot
              </Typography>
              <UploadZone
                hasImage={Boolean(receiptImage)}
                onClick={() => fileInputRef.current?.click()}
              >
                {receiptImage ? (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component='img'
                      src={receiptImage}
                      alt='receipt'
                      sx={{ width: '100%', maxHeight: 260, objectFit: 'contain', display: 'block' }}
                    />
                    <IconButton
                      size='small'
                      onClick={e => { e.stopPropagation(); setReceiptImage(null) }}
                      sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper' }}
                    >
                      <Icon icon='mdi:close' fontSize={16} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ py: 2 }}>
                    <Icon icon='mdi:camera-outline' fontSize={32} style={{ opacity: 0.4 }} />
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                      Upload payment screenshot
                    </Typography>
                    <Typography variant='caption' color='text.disabled'>
                      PNG, JPG, WEBP
                    </Typography>
                  </Box>
                )}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={handleFileChange}
                />
              </UploadZone>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2'>Submitted</Typography>
                <Typography variant='body2'>{formatKarachiDate(selected.createdAt)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 6 }}>
          <Button variant='contained' color='success' sx={{ mr: 2 }} onClick={() => handleDecision('verified')}>
            Approve
          </Button>
          <Button variant='contained' color='error' sx={{ mr: 2 }} onClick={() => handleDecision('rejected')}>
            Reject
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default PaymentVerification
