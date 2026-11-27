// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// ** Custom Components
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Utils
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { formatPKR } from 'src/@core/utils/format'

// ── Seed from orders fake-db ─────────────────────────────────────────────────
import { data as ordersData } from 'src/@fake-db/apps/orders'

const computeCityData = orders => {
  const cityMap = {}
  orders.forEach(order => {
    const city = order.shippingAddress?.city || 'Unknown'
    if (!cityMap[city]) cityMap[city] = { revenue: 0, count: 0 }
    cityMap[city].revenue += order.total
    cityMap[city].count += 1
  })

  return Object.entries(cityMap)
    .map(([city, { revenue, count }]) => ({ city, revenue, count }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 7)
}

const EcommerceCityChart = () => {
  const theme = useTheme()
  const cityData = computeCityData(ordersData.orders)

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        distributed: true,
        barHeight: '60%'
      }
    },
    legend: { show: false },
    dataLabels: {
      enabled: true,
      formatter: val => formatPKR(val),
      style: { fontSize: '11px', colors: [theme.palette.text.primary] },
      offsetX: 4
    },
    colors: [
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.85),
      hexToRGBA(theme.palette.primary.main, 0.7),
      hexToRGBA(theme.palette.primary.main, 0.6),
      hexToRGBA(theme.palette.primary.main, 0.5),
      hexToRGBA(theme.palette.primary.main, 0.4),
      hexToRGBA(theme.palette.primary.main, 0.3)
    ],
    xaxis: {
      categories: cityData.map(d => d.city),
      labels: {
        formatter: val => formatPKR(Number(val)),
        style: { colors: theme.palette.text.disabled, fontSize: '11px' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.secondary, fontWeight: 600 }
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { left: 0, right: 16 }
    },
    tooltip: {
      y: {
        formatter: val => formatPKR(val)
      },
      x: {
        formatter: (val, { dataPointIndex }) => {
          const d = cityData[dataPointIndex]

          return `${d.city} (${d.count} order${d.count !== 1 ? 's' : ''})`
        }
      }
    },
    states: {
      hover: { filter: { type: 'lighten', value: 0.1 } },
      active: { filter: { type: 'none' } }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Sales by City'
        subheader='Revenue distribution across Pakistan'
        subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
        titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
      />
      <CardContent sx={{ pb: '16px !important' }}>
        <ReactApexcharts
          type='bar'
          height={280}
          options={options}
          series={[{ name: 'Revenue', data: cityData.map(d => d.revenue) }]}
        />
      </CardContent>
    </Card>
  )
}

export default EcommerceCityChart
