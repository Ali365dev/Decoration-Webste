// ** React Imports
import { useEffect, useState, useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// ** Services Import
import { getOrders } from 'src/services/orders'
import { getProducts } from 'src/services/products'

/**
 * Products report: top-selling products, modeled on the Recharts bar chart
 * widget shape (views/charts/recharts/RechartsBarChart.js), driven by real
 * Order line-items aggregated by productId.
 */
const ProductsReport = () => {
  const theme = useTheme()
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    getOrders().then(data => setOrders(data.orders))
    getProducts().then(data => setProducts(data.products))
  }, [])

  const chartData = useMemo(() => {
    const qtyByProduct = {}
    orders.forEach(order => {
      order.items.forEach(item => {
        qtyByProduct[item.productId] = (qtyByProduct[item.productId] || 0) + item.qty
      })
    })

    return Object.entries(qtyByProduct)
      .map(([productId, qty]) => {
        const product = products.find(p => p.id === Number(productId))

        return { name: product ? product.name : `Product #${productId}`, qty }
      })
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8)
      .map(row => ({ ...row, name: row.name.length > 22 ? `${row.name.slice(0, 22)}...` : row.name }))
  }, [orders, products])

  const totalUnitsSold = chartData.reduce((sum, row) => sum + row.qty, 0)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Top-Selling Products' subheader={`${totalUnitsSold} units sold across top 8 products`} />
          <CardContent>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} layout='vertical' margin={{ left: 40, right: 20 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke={theme.palette.divider} />
                  <XAxis type='number' />
                  <YAxis type='category' dataKey='name' width={160} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={val => [`${val} units`, 'Sold']} />
                  <Bar dataKey='qty' name='Units Sold' fill={theme.palette.primary.main} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProductsReport
