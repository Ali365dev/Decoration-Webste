// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

// ** Services Import
import { getStockHistory } from 'src/services/inventory'

// ** Utils Import
import { formatKarachiDate } from 'src/@core/utils/format'

// ** Styled Timeline component (same styling as views/components/timeline/TimelineOutlined.js)
const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const typeColors = {
  restock: 'success',
  sale: 'primary',
  adjustment: 'warning',
  return: 'info'
}

/**
 * Stock History screen: renders the StockMovement log using the same
 * Timeline component shape as views/components/timeline/TimelineOutlined.js.
 * Supports an optional ?productId= query param so the "View Stock History"
 * link on Product Detail lands on a pre-filtered timeline for that product.
 */
const StockHistory = () => {
  // ** Hooks
  const router = useRouter()
  const { productId } = router.query

  // ** State
  const [history, setHistory] = useState([])

  const fetchHistory = useCallback(async () => {
    const data = await getStockHistory({ productId })
    setHistory(data.history)
  }, [productId])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <Card>
      <CardHeader
        title='Stock History'
        subheader={productId ? `Showing movements for product #${productId}` : 'Showing movements for all products'}
      />
      <Divider sx={{ m: '0 !important' }} />
      <CardContent>
        {history.length === 0 ? (
          <Typography variant='body2'>No stock movements recorded yet.</Typography>
        ) : (
          <Timeline>
            {history.map(entry => (
              <TimelineItem key={entry.id}>
                <TimelineSeparator>
                  <TimelineDot color={typeColors[entry.type] || 'primary'} variant='outlined' />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      {entry.productName}
                    </Typography>
                    <Typography variant='caption'>{formatKarachiDate(entry.createdAt)}</Typography>
                  </Box>
                  <Typography variant='body2' sx={{ color: 'text.primary', textTransform: 'capitalize' }}>
                    {entry.type}: {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity} units ({entry.reason})
                  </Typography>
                  <Typography variant='caption'>Resulting stock: {entry.resultingStock} units</Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </CardContent>
    </Card>
  )
}

export default StockHistory
