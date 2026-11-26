// ** React Imports
import { useEffect, useState, useMemo } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'

// ** Services Import
import { getProducts } from 'src/services/products'
import { getCategories } from 'src/services/categories'

/**
 * Inventory report: stock levels by category, modeled on the Chart.js
 * horizontal bar widget shape (views/charts/chartjs/ChartjsHorizontalBarChart.js),
 * driven by real Product.stock (the same stock field Inventory screens use).
 */
const InventoryReport = () => {
  const theme = useTheme()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getProducts().then(data => setProducts(data.products))
    getCategories().then(data => setCategories(data.categories))
  }, [])

  const { labels, stockData, totalStock } = useMemo(() => {
    const stockByCategory = {}
    products.forEach(p => {
      stockByCategory[p.categoryId] = (stockByCategory[p.categoryId] || 0) + p.stock
    })
    const entries = Object.entries(stockByCategory).sort((a, b) => b[1] - a[1])

    return {
      labels: entries.map(([catId]) => categories.find(c => c.id === catId)?.name || catId),
      stockData: entries.map(([, stock]) => stock),
      totalStock: entries.reduce((sum, [, stock]) => sum + stock, 0)
    }
  }, [products, categories])

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    elements: { bar: { borderRadius: { topRight: 15, bottomRight: 15 } } },
    scales: {
      x: { min: 0, grid: { drawTicks: false, color: theme.palette.divider }, ticks: { color: theme.palette.text.secondary } },
      y: { grid: { display: false }, ticks: { color: theme.palette.text.secondary } }
    },
    plugins: { legend: { display: false } }
  }

  const data = {
    labels,
    datasets: [
      {
        maxBarThickness: 22,
        label: 'Units in Stock',
        backgroundColor: theme.palette.primary.main,
        borderColor: 'transparent',
        data: stockData
      }
    ]
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Stock Levels by Category' subheader={`${totalStock} total units in stock`} />
          <CardContent>
            <Bar data={data} height={380} options={options} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InventoryReport
