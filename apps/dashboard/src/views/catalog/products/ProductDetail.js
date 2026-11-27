// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

const statusColors = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary'
}

/**
 * Read-only Product Detail view, modeled on the invoice-preview card layout
 * (document-style summary card + a side actions card).
 */
const ProductDetail = ({ product, category }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
              <CustomAvatar src={product.images?.[0]?.url} variant='rounded' sx={{ width: 90, height: 90, mr: 5 }} />
              <Box>
                <Typography variant='h5' sx={{ mb: 1 }}>
                  {product.name}
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  SKU: {product.sku}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <CustomChip
                    size='small'
                    skin='light'
                    color={statusColors[product.status] || 'primary'}
                    label={product.status}
                    sx={{ textTransform: 'capitalize' }}
                  />
                  <CustomChip size='small' skin='light' color='info' label={category?.name || 'Uncategorized'} />
                </Box>
              </Box>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Typography variant='caption'>Price</Typography>
                <Typography variant='h6'>{formatPKR(product.price)}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant='caption'>Compare-at Price</Typography>
                <Typography variant='h6' sx={{ textDecoration: 'line-through' }}>
                  {formatPKR(product.comparePrice)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant='caption'>Stock</Typography>
                <Typography variant='h6'>{product.stock} units</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant='body2' sx={{ ml: 2 }}>
                {product.rating} ({product.reviewCount} reviews)
              </Typography>
            </Box>
            <Typography variant='body2'>{product.description}</Typography>
            <Divider sx={{ my: 4 }} />
            <Typography variant='caption'>
              Created {formatKarachiDate(product.createdAt)} · Last updated {formatKarachiDate(product.updatedAt)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title='Actions' />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Button
              fullWidth
              variant='contained'
              component={Link}
              href={`/catalog/products/edit/${product.id}`}
              startIcon={<Icon icon='mdi:pencil-outline' />}
            >
              Edit Product
            </Button>
            <Button
              fullWidth
              variant='outlined'
              component={Link}
              href='/inventory/stock'
              startIcon={<Icon icon='mdi:warehouse' />}
            >
              Manage Inventory
            </Button>
            <Button
              fullWidth
              variant='outlined'
              component={Link}
              href={`/inventory/history?productId=${product.id}`}
              startIcon={<Icon icon='mdi:history' />}
            >
              View Stock History
            </Button>
            <Button
              fullWidth
              variant='outlined'
              color='secondary'
              component={Link}
              href='/catalog/products'
              startIcon={<Icon icon='mdi:arrow-left' />}
            >
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProductDetail
