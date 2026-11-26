// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

// ** Services Import
import { getProducts, deleteProduct } from 'src/services/products'
import { getCategories } from 'src/services/categories'

// ** Utils Import
import { formatPKR } from 'src/@core/utils/format'
import exportToCSV from 'src/@core/utils/exportCsv'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const statusColors = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary'
}

const stockColor = stock => {
  if (stock === 0) return 'error'
  if (stock <= 10) return 'warning'

  return 'success'
}

const ProductList = () => {
  // ** State
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [categoryValue, setCategoryValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const categoryName = id => categories.find(c => c.id === id)?.name || '—'

  const fetchProducts = useCallback(async () => {
    const data = await getProducts({ q: value, status: statusValue, categoryId: categoryValue })
    setProducts(data.products)
  }, [value, statusValue, categoryValue])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    getCategories().then(data => setCategories(data.categories))
  }, [])

  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10)
    exportToCSV(`products-${date}.csv`, products, [
      { label: 'SKU', value: r => r.sku },
      { label: 'Name', value: r => r.name },
      { label: 'Category', value: r => categoryName(r.categoryId) },
      { label: 'Price (PKR)', value: r => r.price },
      { label: 'Stock', value: r => r.stock },
      { label: 'Status', value: r => r.status }
    ])
  }

  const handleDelete = async row => {
    await deleteProduct(row.id)
    toast.success(`${row.name} deleted`)
    fetchProducts()
  }

  const columns = [
    {
      flex: 0.3,
      field: 'name',
      minWidth: 280,
      headerName: 'Product',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            src={row.images?.[0]}
            variant='rounded'
            sx={{ mr: 3, width: 38, height: 38 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <LinkStyled href={`/catalog/products/${row.id}`}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.name}
              </Typography>
            </LinkStyled>
            <Typography noWrap variant='caption'>
              SKU: {row.sku}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.15,
      minWidth: 140,
      field: 'categoryId',
      headerName: 'Category',
      renderCell: ({ row }) => <Typography variant='body2'>{categoryName(row.categoryId)}</Typography>
    },
    {
      flex: 0.12,
      minWidth: 110,
      field: 'price',
      headerName: 'Price',
      renderCell: ({ row }) => <Typography variant='body2'>{formatPKR(row.price)}</Typography>
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'stock',
      headerName: 'Stock',
      renderCell: ({ row }) => (
        <CustomChip size='small' skin='light' color={stockColor(row.stock)} label={`${row.stock} units`} />
      )
    },
    {
      flex: 0.12,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <CustomChip
          size='small'
          skin='light'
          color={statusColors[row.status] || 'primary'}
          label={row.status}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Product'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleDelete(row)}>
              <Icon icon='mdi:delete-outline' />
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton size='small' component={Link} sx={{ mr: 0.5 }} href={`/catalog/products/${row.id}`}>
              <Icon icon='mdi:eye-outline' />
            </IconButton>
          </Tooltip>
          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            iconButtonProps={{ size: 'small' }}
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            options={[
              {
                text: 'Edit',
                href: `/catalog/products/edit/${row.id}`,
                icon: <Icon icon='mdi:pencil-outline' fontSize={20} />
              },
              {
                text: 'View Inventory',
                href: '/inventory/stock',
                icon: <Icon icon='mdi:warehouse' fontSize={20} />
              }
            ]}
          />
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='product-status-select'>Status</InputLabel>
                  <Select
                    fullWidth
                    value={statusValue}
                    label='Status'
                    onChange={e => setStatusValue(e.target.value)}
                    labelId='product-status-select'
                  >
                    <MenuItem value=''>All</MenuItem>
                    <MenuItem value='published'>Published</MenuItem>
                    <MenuItem value='draft'>Draft</MenuItem>
                    <MenuItem value='archived'>Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='product-category-select'>Category</InputLabel>
                  <Select
                    fullWidth
                    value={categoryValue}
                    label='Category'
                    onChange={e => setCategoryValue(e.target.value)}
                    labelId='product-category-select'
                  >
                    <MenuItem value=''>All</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  value={value}
                  label='Search Product'
                  placeholder='Search by name or SKU'
                  onChange={e => setValue(e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Products'
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button size='small' color='secondary' variant='outlined' onClick={handleExport} startIcon={<Icon icon='mdi:download-outline' />}>
                  Export CSV
                </Button>
                <Button variant='contained' component={Link} href='/catalog/products/add' startIcon={<Icon icon='mdi:plus' />}>
                  Add Product
                </Button>
              </Box>
            }
          />
          <DataGrid
            autoHeight
            pagination
            rows={products}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ProductList
