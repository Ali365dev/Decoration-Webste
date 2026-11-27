// ** React Imports
import { useEffect, useState, useMemo } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Import
import { getTransactions } from 'src/services/transactions'

// ** Utils Import
import { formatPKR } from 'src/@core/utils/format'

const methodMeta = {
  COD: { icon: 'mdi:cash', color: 'success' },
  'Bank Transfer': { icon: 'mdi:bank-outline', color: 'primary' },
  Easypaisa: { icon: 'mdi:cellphone-nfc', color: 'info' },
  JazzCash: { icon: 'mdi:cellphone-nfc', color: 'warning' },
  SadaPay: { icon: 'mdi:credit-card-outline', color: 'secondary' }
}

/**
 * Payments report: transaction volume by method, modeled on the
 * CardTransactions.js card shape + a donut chart, driven by real Phase 6
 * Transaction data.
 */
const PaymentsReport = () => {
  const theme = useTheme()
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getTransactions().then(data => setTransactions(data.transactions))
  }, [])

  const { labels, amounts, counts, totalAmount } = useMemo(() => {
    const byMethod = {}
    transactions.forEach(t => {
      if (!byMethod[t.method]) byMethod[t.method] = { amount: 0, count: 0 }
      byMethod[t.method].amount += t.amount
      byMethod[t.method].count += 1
    })
    const entries = Object.entries(byMethod)

    return {
      labels: entries.map(([method]) => method),
      amounts: entries.map(([, v]) => v.amount),
      counts: Object.fromEntries(entries.map(([method, v]) => [method, v.count])),
      totalAmount: entries.reduce((sum, [, v]) => sum + v.amount, 0)
    }
  }, [transactions])

  const options = {
    chart: { parentHeightOffset: 0 },
    labels,
    stroke: { width: 0 },
    colors: labels.map(l => theme.palette[methodMeta[l]?.color || 'primary'].main),
    dataLabels: { formatter: val => `${Number(val).toFixed(1)}%` },
    legend: { position: 'bottom', labels: { colors: theme.palette.text.primary } },
    tooltip: { y: { formatter: val => formatPKR(val) } }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={7}>
        <Card>
          <CardHeader title='Transaction Volume by Method' subheader={`Total ${formatPKR(totalAmount)} processed`} />
          <CardContent>
            <ReactApexcharts type='donut' height={350} series={amounts} options={options} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardHeader title='By Method' />
          <CardContent>
            {labels.map(method => (
              <Box key={method} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' color={methodMeta[method]?.color || 'primary'} sx={{ mr: 3 }}>
                    <Icon icon={methodMeta[method]?.icon || 'mdi:cash'} />
                  </CustomAvatar>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{method}</Typography>
                    <Typography variant='caption'>{counts[method]} transactions</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {formatPKR(amounts[labels.indexOf(method)])}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PaymentsReport
