// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
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
import { getReviews, updateReviewStatus, replyToReview, deleteReview } from 'src/services/reviews'

// ** Utils Import
import { formatKarachiDate } from 'src/@core/utils/format'

const statusColors = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error'
}

const ReviewList = () => {
  // ** State
  const [reviews, setReviews] = useState([])
  const [statusValue, setStatusValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // Reply dialog state
  const [replyRow, setReplyRow] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyLoading, setReplyLoading] = useState(false)

  const fetchReviews = useCallback(async () => {
    const data = await getReviews({ status: statusValue })
    setReviews(data.reviews)
  }, [statusValue])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleStatusChange = async (row, status) => {
    await updateReviewStatus(row.id, status)
    toast.success(`Review ${status}`)
    fetchReviews()
  }

  const handleDelete = async row => {
    await deleteReview(row.id)
    toast.success('Review deleted')
    fetchReviews()
  }

  const handleOpenReply = row => {
    setReplyRow(row)
    setReplyText(row.adminReply || '')
    setReplyOpen(true)
  }

  const handleSaveReply = async () => {
    if (!replyRow || !replyText.trim()) {
      toast.error('Reply cannot be empty')

      return
    }
    setReplyLoading(true)
    await replyToReview(replyRow.id, replyText.trim())
    setReplyLoading(false)
    toast.success('Reply saved')
    setReplyOpen(false)
    setReplyRow(null)
    fetchReviews()
  }

  const columns = [
    {
      flex: 0.2,
      field: 'productName',
      minWidth: 220,
      headerName: 'Product'
    },
    {
      flex: 0.15,
      field: 'customerName',
      minWidth: 160,
      headerName: 'Customer',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='body2'>{row.customerName}</Typography>
          <Typography variant='caption'>{row.customerCity}</Typography>
        </Box>
      )
    },
    {
      flex: 0.1,
      field: 'rating',
      minWidth: 130,
      headerName: 'Rating',
      renderCell: ({ row }) => <Rating value={row.rating} readOnly size='small' />
    },
    {
      flex: 0.3,
      field: 'comment',
      minWidth: 260,
      headerName: 'Comment',
      renderCell: ({ row }) => (
        <Box sx={{ py: 1 }}>
          <Typography variant='body2'>{row.comment}</Typography>
          {row.adminReply && (
            <Box sx={{ mt: 0.5, pl: 1, borderLeft: '2px solid', borderColor: 'primary.main' }}>
              <Typography variant='caption' sx={{ color: 'primary.main', fontWeight: 600 }}>
                Your reply:
              </Typography>
              <Typography variant='caption' sx={{ display: 'block', color: 'text.secondary' }}>
                {row.adminReply}
              </Typography>
            </Box>
          )}
        </Box>
      )
    },
    {
      flex: 0.1,
      field: 'createdAt',
      minWidth: 120,
      headerName: 'Date',
      renderCell: ({ row }) => <Typography variant='body2'>{formatKarachiDate(row.createdAt)}</Typography>
    },
    {
      flex: 0.1,
      field: 'status',
      minWidth: 110,
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
      flex: 0.14,
      field: 'actions',
      minWidth: 160,
      sortable: false,
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex' }}>
          <Tooltip title={row.adminReply ? 'Edit Reply' : 'Reply'}>
            <IconButton size='small' color='primary' onClick={() => handleOpenReply(row)}>
              <Icon icon={row.adminReply ? 'mdi:comment-edit-outline' : 'mdi:comment-plus-outline'} fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Approve'>
            <IconButton size='small' color='success' onClick={() => handleStatusChange(row, 'approved')}>
              <Icon icon='mdi:check-circle-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Reject'>
            <IconButton size='small' color='error' onClick={() => handleStatusChange(row, 'rejected')}>
              <Icon icon='mdi:close-circle-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton size='small' onClick={() => handleDelete(row)}>
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Reviews'
            action={
              <FormControl size='small' sx={{ minWidth: 160 }}>
                <InputLabel id='review-status-select'>Status</InputLabel>
                <Select
                  value={statusValue}
                  label='Status'
                  labelId='review-status-select'
                  onChange={e => setStatusValue(e.target.value)}
                >
                  <MenuItem value=''>All</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='approved'>Approved</MenuItem>
                  <MenuItem value='rejected'>Rejected</MenuItem>
                </Select>
              </FormControl>
            }
          />
          <DataGrid
            autoHeight
            pagination
            rows={reviews}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowHeight={() => 'auto'}
            sx={{ '& .MuiDataGrid-cell': { alignItems: 'flex-start', py: 1 } }}
          />
        </Card>
      </Grid>

      {/* Reply Dialog */}
      <Dialog open={replyOpen} onClose={() => setReplyOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>
          {replyRow?.adminReply ? 'Edit Reply' : 'Reply to Review'}
        </DialogTitle>
        <DialogContent>
          {replyRow && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <Rating value={replyRow.rating} readOnly size='small' />
                <Typography variant='caption' color='text.secondary'>
                  by {replyRow.customerName} · {replyRow.productName}
                </Typography>
              </Box>
              <Typography variant='body2' sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 3 }}>
                &ldquo;{replyRow.comment}&rdquo;
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            minRows={3}
            label='Your Reply'
            placeholder='e.g. Thank you for your review! We appreciate your feedback. 🙏'
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={() => setReplyOpen(false)}>Cancel</Button>
          <Button
            variant='contained'
            disabled={replyLoading || !replyText.trim()}
            onClick={handleSaveReply}
            startIcon={<Icon icon='mdi:send' />}
          >
            {replyLoading ? 'Saving…' : 'Post Reply'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ReviewList
