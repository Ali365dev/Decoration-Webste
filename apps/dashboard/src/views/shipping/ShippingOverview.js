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
import { getShipments } from 'src/services/shipments'

/**
 * Shipping & Delivery Overview KPI tiles - same CardStatisticsHorizontal.js
 * composition as InventoryOverview.js / PaymentsOverview.js.
 */
const ShippingOverview = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getShipments().then(data => {
      const shipments = data.shipments
      setStats({
        total: shipments.length,
        inTransit: shipments.filter(s => s.status === 'in-transit' || s.status === 'picked').length,
        outForDelivery: shipments.filter(s => s.status === 'out-for-delivery').length,
        delivered: shipments.filter(s => s.status === 'delivered').length
      })
    })
  }, [])

  if (!stats) return null

  const tiles = [
    { stats: stats.total, title: 'Total Shipments', icon: 'mdi:truck-outline', color: 'primary' },
    { stats: stats.inTransit, title: 'In Transit', icon: 'mdi:truck-fast-outline', color: 'info' },
    { stats: stats.outForDelivery, title: 'Out For Delivery', icon: 'mdi:moped-outline', color: 'warning' },
    { stats: stats.delivered, title: 'Delivered', icon: 'mdi:check-circle-outline', color: 'success' }
  ]

  return (
    <Grid container spacing={6}>
      {tiles.map((item, index) => (
        <Grid item xs={12} md={3} sm={6} key={index}>
          <Link href='/shipping/shipments' style={{ textDecoration: 'none' }}>
            <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon} />} />
          </Link>
        </Grid>
      ))}
    </Grid>
  )
}

export default ShippingOverview
