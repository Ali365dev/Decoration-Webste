// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Services Import
import { getTransactions } from 'src/services/transactions'
import { getRefunds } from 'src/services/refunds'

// ** Utils Import
import { formatPKR } from 'src/@core/utils/format'

/**
 * Payments & Finance Overview KPI tiles, reusing CardStatisticsHorizontal.js the
 * same way src/views/inventory/InventoryOverview.js composes it for Inventory.
 */
const PaymentsOverview = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    Promise.all([getTransactions(), getRefunds()]).then(([txData, refundData]) => {
      const transactions = txData.transactions

      const verifiedRevenue = transactions
        .filter(t => t.status === 'verified' || t.status === 'refunded')
        .reduce((sum, t) => sum + t.amount, 0)
      const pendingVerification = transactions.filter(t => t.method !== 'COD' && t.status === 'pending').length
      const pendingCod = transactions.filter(t => t.method === 'COD' && !t.codReconciled).length

      const totalRefunded = refundData.refunds
        .filter(r => r.status === 'approved')
        .reduce((sum, r) => sum + r.amount, 0)

      setStats({ verifiedRevenue, pendingVerification, pendingCod, totalRefunded })
    })
  }, [])

  if (!stats) return null

  const tiles = [
    {
      stats: formatPKR(stats.verifiedRevenue),
      title: 'Verified Revenue',
      icon: 'mdi:cash-check',
      color: 'success',
      href: '/payments/transactions'
    },
    {
      stats: stats.pendingVerification,
      title: 'Pending Payment Verification',
      icon: 'mdi:file-search-outline',
      color: 'warning',
      href: '/payments/verification'
    },
    {
      stats: stats.pendingCod,
      title: 'COD Pending Reconciliation',
      icon: 'mdi:truck-check-outline',
      color: 'info',
      href: '/payments/cod-reconciliation'
    },
    {
      stats: formatPKR(stats.totalRefunded),
      title: 'Total Refunded',
      icon: 'mdi:cash-refund',
      color: 'error',
      href: '/payments/refunds'
    }
  ]

  return (
    <Grid container spacing={6}>
      {tiles.map((item, index) => (
        <Grid item xs={12} md={3} sm={6} key={index}>
          <Link href={item.href} style={{ textDecoration: 'none' }}>
            <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon} />} />
          </Link>
        </Grid>
      ))}
    </Grid>
  )
}

export default PaymentsOverview
