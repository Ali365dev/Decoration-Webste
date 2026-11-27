// ** React Imports
import { useEffect, useState, useMemo } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Import
import { getOrders } from 'src/services/orders'

// ** Utils Import
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

/**
 * Sales report: revenue over time, modeled on the Apex area/line chart
 * widget shape (views/charts/apex-charts/ApexLineChart.js), driven by real
 * Order data aggregated by day.
 */
const SalesReport = () => {
  const theme = useTheme()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getOrders().then(data => setOrders(data.orders))
  }, [])

  const { categories, series, totalRevenue, totalOrders } = useMemo(() => {
    const byDay = {}
    orders.forEach(order => {
      const day = order.createdAt.slice(0, 10)
      byDay[day] = (byDay[day] || 0) + order.total
    })
    const sortedDays = Object.keys(byDay).sort()

    return {
      categories: sortedDays.map(d => formatKarachiDate(d)),
      series: [{ name: 'Revenue', data: sortedDays.map(d => byDay[d]) }],
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      totalOrders: orders.length
    }
  }, [orders])

  const options = {
    chart: { toolbar: { show: false }, parentHeightOffset: 0 },
    stroke: { width: 3, curve: 'smooth' },
    grid: { borderColor: theme.palette.divider },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    xaxis: { categories, labels: { style: { colors: theme.palette.text.disabled } } },
    yaxis: { labels: { formatter: val => formatPKR(val), style: { colors: theme.palette.text.disabled } } },
    tooltip: { y: { formatter: val => formatPKR(val) } }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6}>
        <CardStatisticsHorizontal
          stats={formatPKR(totalRevenue)}
          title='Total Revenue'
          color='success'
          icon={<Icon icon='mdi:cash-multiple' />}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CardStatisticsHorizontal
          stats={totalOrders}
          title='Orders'
          color='primary'
          icon={<Icon icon='mdi:cart-outline' />}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Revenue Over Time' subheader='Aggregated from real order totals, grouped by day' />
          <CardContent>
            <ReactApexcharts type='area' height={350} series={series} options={options} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SalesReport
