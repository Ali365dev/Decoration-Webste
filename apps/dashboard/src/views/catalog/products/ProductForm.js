// ** React Imports
import { useState, useRef } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import { styled, alpha } from '@mui/material/styles'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Import
import { createProduct, updateProduct, apiError } from 'src/services/products'
import { toApiPayload } from 'src/services/productMapping'
import { uploadImages } from 'src/services/uploads'

// ─── Styled helpers ──────────────────────────────────────────────────────────

const DropZone = styled(Box)(({ theme, isDragOver }) => ({
  border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  background: isDragOver ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
  '&:hover': { borderColor: theme.palette.primary.main, background: alpha(theme.palette.primary.main, 0.04) }
}))

const ThumbBox = styled(Box)(({ theme, isPrimary }) => ({
  position: 'relative',
  width: 90,
  height: 90,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `2px solid ${isPrimary ? theme.palette.primary.main : theme.palette.divider}`,
  flexShrink: 0,
  cursor: 'grab'
}))

const VariantRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 130px 100px auto',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.action.hover
}))

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = yup.object().shape({
  name: yup.string().min(3).required('Product name is required'),
  sku: yup.string().required('SKU is required'),
  categoryId: yup.string().required('Category is required'),
  price: yup.number().typeError('Price is required').positive().required(),
  comparePrice: yup.number().typeError('Required').min(0).required(),
  stock: yup.number().typeError('Required').min(0).required(),
  description: yup.string()
})

const SIZES = ['A4', 'A3', 'A2', '12×18"', '18×24"', '24×36"', 'Custom']
const MATERIALS = ['Canvas', 'Matte Paper', 'Glossy Paper', 'Cotton', 'Polyester', 'Satin', 'Linen', 'Fleece', 'Other']

// ─── Component ───────────────────────────────────────────────────────────────

const ProductForm = ({ product, categories, collections }) => {
  const router = useRouter()

  // Collections multi-select
  const [collectionIds, setCollectionIds] = useState(product?.collectionIds || [])

  // Image gallery state: saved images are { url, publicId }, new drops are { url: dataURL, file }
  const [images, setImages] = useState(product?.images || [])
  const [submitting, setSubmitting] = useState(false)
  const [primaryIdx, setPrimaryIdx] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

  // Size variants state
  const [variants, setVariants] = useState(
    product?.variants?.length
      ? product.variants
      : []
  )

  const defaultValues = {
    name: product?.name || '',
    sku: product?.sku || '',
    material: product?.material || '',
    categoryId: product?.categoryId || '',
    price: product?.price ?? '',
    comparePrice: product?.comparePrice ?? '',
    stock: product?.stock ?? 0,
    status: product?.status || 'draft',
    description: product?.description || ''
  }

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ── Image handlers ──────────────────────────────────────────────────────────

  const readFiles = files => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = e => setImages(prev => [...prev, { url: e.target.result, file }])
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = e => {
    e.preventDefault()
    setIsDragOver(false)
    readFiles(e.dataTransfer.files)
  }

  const removeImage = idx => {
    setImages(prev => prev.filter((_, i) => i !== idx))
    if (primaryIdx >= idx && primaryIdx > 0) setPrimaryIdx(p => p - 1)
  }

  const handleDragSort = () => {
    const updated = [...images]
    const dragged = updated.splice(dragItem.current, 1)[0]
    updated.splice(dragOverItem.current, 0, dragged)
    setImages(updated)
    if (primaryIdx === dragItem.current) setPrimaryIdx(dragOverItem.current)
  }

  // ── Variant handlers ────────────────────────────────────────────────────────

  const addVariant = () => setVariants(prev => [...prev, { size: '', price: '', stock: 0 }])

  const updateVariant = (idx, field, val) =>
    setVariants(prev => prev.map((v, i) => (i === idx ? { ...v, [field]: val } : v)))

  const removeVariant = idx => setVariants(prev => prev.filter((_, i) => i !== idx))

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async data => {
    if (submitting) return
    setSubmitting(true)
    try {
      // Primary image first; new files upload to Cloudinary only now, on save
      const ordered = images.length ? [images[primaryIdx] ?? images[0], ...images.filter((_, i) => i !== primaryIdx)] : []
      const uploaded = await uploadImages(ordered, 'dec-walls/products')
      const payload = toApiPayload(data, { collectionIds, variants, images: uploaded })
      if (product) {
        await updateProduct(product.id, payload)
        toast.success('Product updated')
        router.push(`/catalog/products/${product.id}`)
      } else {
        const created = await createProduct(payload)
        toast.success('Product created')
        router.push(`/catalog/products/${created.id}`)
      }
    } catch (err) {
      toast.error(apiError(err))
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>

        {/* ── LEFT COLUMN ── */}
        <Grid item xs={12} md={8}>

          {/* Basic Info */}
          <Card sx={{ mb: 6 }}>
            <CardHeader title={product ? 'Edit Product' : 'Add Product'} />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth>
                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label='Product Name *' error={Boolean(errors.name)} />
                      )}
                    />
                    {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='sku'
                      control={control}
                      render={({ field }) => <TextField {...field} fullWidth label='SKU *' error={Boolean(errors.sku)} />}
                    />
                    {errors.sku && <FormHelperText sx={{ color: 'error.main' }}>{errors.sku.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(errors.categoryId)}>
                    <InputLabel id='cat-label'>Category *</InputLabel>
                    <Controller
                      name='categoryId'
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label='Category *' labelId='cat-label'>
                          {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                        </Select>
                      )}
                    />
                    {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
                  </FormControl>
                </Grid>

                {/* Material / Fabric */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='material-label'>Material / Fabric</InputLabel>
                    <Controller
                      name='material'
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label='Material / Fabric' labelId='material-label'>
                          <MenuItem value=''>— Not specified</MenuItem>
                          {MATERIALS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Price fields */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='price'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field} type='number' fullWidth label='Price *'
                          error={Boolean(errors.price)}
                          InputProps={{ startAdornment: <InputAdornment position='start'>Rs.</InputAdornment> }}
                        />
                      )}
                    />
                    {errors.price && <FormHelperText sx={{ color: 'error.main' }}>{errors.price.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='comparePrice'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field} type='number' fullWidth label='Compare-at Price'
                          error={Boolean(errors.comparePrice)}
                          InputProps={{ startAdornment: <InputAdornment position='start'>Rs.</InputAdornment> }}
                        />
                      )}
                    />
                    {errors.comparePrice && <FormHelperText sx={{ color: 'error.main' }}>{errors.comparePrice.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name='stock'
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} type='number' fullWidth label='Stock Qty' error={Boolean(errors.stock)} />
                      )}
                    />
                    {errors.stock && <FormHelperText sx={{ color: 'error.main' }}>{errors.stock.message}</FormHelperText>}
                  </FormControl>
                </Grid>

                {/* Collections */}
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={collections}
                    getOptionLabel={o => o.name}
                    value={collections.filter(c => collectionIds.includes(c.id))}
                    onChange={(_, v) => setCollectionIds(v.map(x => x.id))}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => <Chip label={option.name} {...getTagProps({ index })} key={option.id} />)
                    }
                    renderInput={params => <TextField {...params} label='Collections' placeholder='Assign to collections' />}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='description'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field} multiline minRows={4} fullWidth label='Description *'
                          error={Boolean(errors.description)}
                        />
                      )}
                    />
                    {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── IMAGE GALLERY ── */}
          <Card sx={{ mb: 6 }}>
            <CardHeader
              title='Product Images'
              subheader='Drag to reorder · First image is the primary · Click thumbnail to set as primary'
            />
            <CardContent>
              {/* Thumbnails */}
              {images.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                  {images.map((img, idx) => (
                    <Tooltip key={idx} title={idx === primaryIdx ? 'Primary image' : 'Set as primary'}>
                      <ThumbBox
                        isPrimary={idx === primaryIdx}
                        draggable
                        onDragStart={() => { dragItem.current = idx }}
                        onDragEnter={() => { dragOverItem.current = idx }}
                        onDragEnd={handleDragSort}
                        onDragOver={e => e.preventDefault()}
                        onClick={() => setPrimaryIdx(idx)}
                      >
                        <Box
                          component='img'
                          src={img.url}
                          alt={`img-${idx}`}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {idx === primaryIdx && (
                          <Box sx={{
                            position: 'absolute', top: 0, left: 0, right: 0,
                            bgcolor: 'primary.main', py: 0.25, textAlign: 'center'
                          }}>
                            <Typography variant='caption' sx={{ color: 'white', fontSize: 10, fontWeight: 700 }}>PRIMARY</Typography>
                          </Box>
                        )}
                        <IconButton
                          size='small'
                          onClick={e => { e.stopPropagation(); removeImage(idx) }}
                          sx={{
                            position: 'absolute', bottom: 2, right: 2,
                            bgcolor: 'background.paper', p: 0.25,
                            '&:hover': { bgcolor: 'error.lighter' }
                          }}
                        >
                          <Icon icon='mdi:close' fontSize={14} />
                        </IconButton>
                      </ThumbBox>
                    </Tooltip>
                  ))}
                </Box>
              )}

              {/* Drop Zone */}
              <DropZone
                isDragOver={isDragOver}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
              >
                <Icon icon='mdi:cloud-upload-outline' fontSize={40} style={{ opacity: 0.4 }} />
                <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                  Drop images here or <strong>click to browse</strong>
                </Typography>
                <Typography variant='caption' color='text.disabled'>
                  PNG, JPG, WEBP · Multiple files supported · Drag thumbnails to reorder
                </Typography>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='image/*'
                  hidden
                  onChange={e => readFiles(e.target.files)}
                />
              </DropZone>
            </CardContent>
          </Card>

          {/* ── SIZE VARIANTS ── */}
          <Card>
            <CardHeader
              title='Size Variants'
              subheader='Add sizes with individual pricing and stock (e.g. A4, 24×36", Custom)'
              action={
                <Button size='small' variant='outlined' startIcon={<Icon icon='mdi:plus' />} onClick={addVariant}>
                  Add Size
                </Button>
              }
            />
            <CardContent>
              {variants.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
                  <Icon icon='mdi:ruler-square' fontSize={36} />
                  <Typography variant='body2' sx={{ mt: 1 }}>
                    No size variants yet. Click &quot;Add Size&quot; to set sizes with individual prices.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 130px 100px auto',
                    gap: 2,
                    px: 2,
                    pb: 1
                  }}>
                    <Typography variant='caption' color='text.secondary' fontWeight={600}>SIZE / LABEL</Typography>
                    <Typography variant='caption' color='text.secondary' fontWeight={600}>PRICE (Rs.)</Typography>
                    <Typography variant='caption' color='text.secondary' fontWeight={600}>STOCK</Typography>
                    <Box />
                  </Box>
                  {variants.map((v, idx) => (
                    <VariantRow key={idx}>
                      <Autocomplete
                        freeSolo
                        size='small'
                        options={SIZES}
                        value={v.size}
                        onInputChange={(_, val) => updateVariant(idx, 'size', val)}
                        renderInput={params => <TextField {...params} placeholder='e.g. A4 or 24×36"' />}
                      />
                      <TextField
                        size='small'
                        type='number'
                        value={v.price}
                        onChange={e => updateVariant(idx, 'price', e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position='start'>Rs.</InputAdornment> }}
                      />
                      <TextField
                        size='small'
                        type='number'
                        value={v.stock}
                        onChange={e => updateVariant(idx, 'stock', e.target.value)}
                      />
                      <Tooltip title='Remove'>
                        <IconButton size='small' color='error' onClick={() => removeVariant(idx)}>
                          <Icon icon='mdi:delete-outline' fontSize={18} />
                        </IconButton>
                      </Tooltip>
                    </VariantRow>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant='caption' color='text.disabled'>
                    💡 If no variants are set, the base Price &amp; Stock above apply to all orders.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── RIGHT COLUMN ── */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title='Organize' />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 5 }}>
                <InputLabel id='product-status'>Status</InputLabel>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label='Status' labelId='product-status'>
                      <MenuItem value='draft'>Draft</MenuItem>
                      <MenuItem value='published'>Published</MenuItem>
                      <MenuItem value='archived'>Archived</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Button type='submit' fullWidth variant='contained' disabled={submitting}>
                  {product ? 'Save Changes' : 'Create Product'}
                </Button>
                <Button
                  fullWidth variant='outlined' color='secondary'
                  onClick={() => router.push(product ? `/catalog/products/${product.id}` : '/catalog/products')}
                >
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}

export default ProductForm
