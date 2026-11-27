// ** React Imports
import { useEffect, useState, useCallback } from 'react'

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

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getActivityLogs } from 'src/services/activityLogs'

// ** Utils Import
import { formatKarachiDate } from 'src/@core/utils/format'

// ** Styled Timeline component (same shape as src/views/inventory/StockHistory.js /
// ** views/dashboards/analytics/AnalyticsActivityTimeline.js)
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

const categoryColors = {
  product: 'info',
  order: 'primary',
  payment: 'success',
  inventory: 'warning',
  marketing: 'secondary',
  staff: 'error'
}

/**
 * Activity Logs screen. Note on scope: this is a seeded, static feed (see
 * src/@fake-db/apps/activityLogs.js), not a live audit-logging system that
 * intercepts every action across the app - that would be significant scope
 * creep for this phase. It reuses the Timeline component pattern already
 * established for Stock History / the Analytics dashboard.
 */
const ActivityLogs = () => {
  const [logs, setLogs] = useState([])

  const fetchLogs = useCallback(async () => {
    const data = await getActivityLogs()
    setLogs(data.logs)
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <Card>
      <CardHeader title='Activity Logs' subheader='Recent staff actions across catalog, orders, payments and marketing' />
      <Divider sx={{ m: '0 !important' }} />
      <CardContent>
        {logs.length === 0 ? (
          <Typography variant='body2'>No activity recorded yet.</Typography>
        ) : (
          <Timeline>
            {logs.map(entry => (
              <TimelineItem key={entry.id}>
                <TimelineSeparator>
                  <TimelineDot color={categoryColors[entry.category] || 'primary'} variant='outlined' />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      {entry.staffName}
                    </Typography>
                    <Typography variant='caption'>{formatKarachiDate(entry.timestamp, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</Typography>
                  </Box>
                  <Typography variant='body2' sx={{ color: 'text.primary', mb: 1 }}>
                    {entry.action}
                  </Typography>
                  <CustomChip
                    size='small'
                    skin='light'
                    color={categoryColors[entry.category] || 'primary'}
                    label={entry.category}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </CardContent>
    </Card>
  )
}

export default ActivityLogs
