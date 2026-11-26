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
import { getInventoryOverview } from 'src/services/inventory'

/**
 * Inventory Overview KPI tiles, reusing CardStatisticsHorizontal.js the same
 * way views/ui/cards/statistics/CardStatisticsHorizontal.js composes it.
 */
const InventoryOverview = () => {
  // ** State
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    getInventoryOverview().then(setOverview)
  }, [])

  if (!overview) return null

  const stats = [
    {
      stats: overview.totalSkus,
      title: 'Total SKUs',
      icon: 'mdi:package-variant-closed',
      color: 'primary',
      trendNumber: '',
      trend: undefined
    },
    {
      stats: overview.totalUnits,
      title: 'Total Units In Stock',
      icon: 'mdi:warehouse',
      color: 'info'
    },
    {
      stats: overview.lowStockCount,
      title: 'Low Stock Products',
      icon: 'mdi:alert-outline',
      color: 'warning'
    },
    {
      stats: overview.outOfStockCount,
      title: 'Out of Stock Products',
      icon: 'mdi:close-octagon-outline',
      color: 'error'
    }
  ]

  return (
    <Grid container spacing={6}>
      {stats.map((item, index) => (
        <Grid item xs={12} md={3} sm={6} key={index}>
          <Link href={index === 2 ? '/inventory/low-stock' : '/inventory/stock'} style={{ textDecoration: 'none' }}>
            <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon} />} />
          </Link>
        </Grid>
      ))}
    </Grid>
  )
}

export default InventoryOverview
