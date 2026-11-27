// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils
import { formatPKR } from 'src/@core/utils/format'

// ** Axios
import axios from 'axios'

const StatTile = ({ icon, color, label, value, sub }) => {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <CustomAvatar skin='light' color={color} variant='rounded' sx={{ width: 46, height: 46 }}>
        <Icon icon={icon} fontSize={22} />
      </CustomAvatar>
      <Box>
        <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1.2 }}>{value}</Typography>
        <Typography variant='caption' sx={{ color: 'text.secondary' }}>{label}</Typography>
        {sub && (
          <Typography variant='caption' sx={{ display: 'block', color: theme.palette[color]?.main ?? 'primary.main', fontWeight: 600 }}>
            {sub}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

const defaultSummary = { todayCount: 0, todayRevenue: 0, codCount: 0, codTotal: 0, pendingCount: 0, processingCount: 0 }

const EcommerceTodaySummary = () => {
  const [summary, setSummary] = useState(defaultSummary)

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(res => {
        const t = res.data?.today ?? {}
        setSummary({
          todayCount: t.count ?? 0,
          todayRevenue: t.revenue ?? 0,
          codCount: 0,
          codTotal: 0,
          pendingCount: t.pendingCount ?? 0,
          processingCount: t.processingCount ?? 0,
        })
      })
      .catch(() => { /* keep defaults if API unavailable */ })
  }, [])

  return (
    <Card>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>Today&apos;s Summary</Typography>
            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
              {new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Karachi' })}
            </Typography>
          </Box>
          <CustomAvatar skin='light' color='primary' variant='rounded'>
            <Icon icon='mdi:calendar-today' />
          </CustomAvatar>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={6}>
            <StatTile
              icon='mdi:shopping-outline'
              color='primary'
              label="Today's Orders"
              value={summary.todayCount}
              sub={summary.todayCount > 0 ? formatPKR(summary.todayRevenue) : 'No orders yet'}
            />
          </Grid>
          <Grid item xs={6}>
            <StatTile
              icon='mdi:cash'
              color='success'
              label='COD Today'
              value={summary.codCount}
              sub={summary.codCount > 0 ? `Collect ${formatPKR(summary.codTotal)}` : 'No COD today'}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={6}>
            <StatTile
              icon='mdi:clock-outline'
              color='warning'
              label='Pending Orders'
              value={summary.pendingCount}
              sub='Need attention'
            />
          </Grid>
          <Grid item xs={6}>
            <StatTile
              icon='mdi:cog-outline'
              color='info'
              label='Processing'
              value={summary.processingCount}
              sub='Being prepared'
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceTodaySummary
