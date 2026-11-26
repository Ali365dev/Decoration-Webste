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

// ** Utils Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { formatPKR } from 'src/@core/utils/format'

// ** Services Import
import { getCustomers } from 'src/services/customers'

/**
 * Customers report: city-level breakdown, reusing the exact "Sales by City"
 * widget shape from the Phase 3 Analytics dashboard
 * (views/dashboards/analytics/AnalyticsSalesCountry.js), driven by real
 * Customer city + totalSpent data instead of hardcoded figures.
 */
const CustomersReport = () => {
  const theme = useTheme()
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    getCustomers().then(data => setCustomers(data.customers))
  }, [])

  const { categories, series, totalSpend } = useMemo(() => {
    const byCity = {}
    customers.forEach(c => {
      byCity[c.city] = (byCity[c.city] || 0) + (c.totalSpent || 0)
    })
    const sorted = Object.entries(byCity).sort((a, b) => b[1] - a[1])

    return {
      categories: sorted.map(([city]) => city),
      series: [{ name: 'Lifetime Spend', data: sorted.map(([, value]) => value) }],
      totalSpend: sorted.reduce((sum, [, value]) => sum + value, 0)
    }
  }, [customers])

  const options = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    plotOptions: {
      bar: { borderRadius: 8, barHeight: '60%', horizontal: true, distributed: true, startingShape: 'rounded' }
    },
    dataLabels: {
      offsetY: 8,
      formatter: val => formatPKR(val),
      style: { fontWeight: 500, fontSize: '0.875rem' }
    },
    grid: {
      strokeDashArray: 8,
      borderColor: theme.palette.divider,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { top: -18, left: 21, right: 33, bottom: 10 }
    },
    colors: [
      hexToRGBA(theme.palette.primary.light, 1),
      hexToRGBA(theme.palette.success.light, 1),
      hexToRGBA(theme.palette.warning.light, 1),
      hexToRGBA(theme.palette.info.light, 1),
      hexToRGBA(theme.palette.error.light, 1),
      hexToRGBA(theme.palette.secondary.light, 1)
    ],
    legend: { show: false },
    states: { hover: { filter: { type: 'none' } }, active: { filter: { type: 'none' } } },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories,
      labels: {
        formatter: val => formatPKR(val),
        style: { fontSize: '0.875rem', colors: theme.palette.text.disabled }
      }
    },
    yaxis: {
      labels: {
        style: { fontWeight: 600, fontSize: '0.875rem', colors: theme.palette.text.primary }
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Sales by City' subheader={`Total ${formatPKR(totalSpend)} lifetime customer spend`} />
          <CardContent sx={{ p: '0 !important' }}>
            <ReactApexcharts type='bar' height={380} series={series} options={options} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CustomersReport
