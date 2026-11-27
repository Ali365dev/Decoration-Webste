// ** React Imports
import { useEffect, useState, useCallback, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Services Import
import { getCategories, createCategory, updateCategory, deleteCategory } from 'src/services/categories'
import { uploadImage } from 'src/services/uploads'

// ** Utils Import
import exportToCSV from 'src/@core/utils/exportCsv'

const statusColors = {
  published: 'success',
  draft: 'warning'
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const ImageUploadBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 160,
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  transition: 'border-color 0.2s',
  '&:hover': {
    borderColor: theme.palette.primary.main
  }
}))

const CategoryManager = () => {
  // ** State
  const [categories, setCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [editing, setEditing] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // Form state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState('')
  const [status, setStatus] = useState('published')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)

  // Inline new-parent state
  const [showNewParent, setShowNewParent] = useState(false)
  const [newParentName, setNewParentName] = useState('')
  const [savingParent, setSavingParent] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10)
    exportToCSV(`categories-${date}.csv`, categories, [
      { label: 'Name', value: r => r.name },
      { label: 'Slug', value: r => r.slug || autoSlug(r.name) },
      { label: 'Parent', value: r => allCategories.find(c => c.id === r.parentId)?.name ?? '' },
      { label: 'Products', value: r => r.productCount ?? 0 },
      { label: 'Status', value: r => r.status || 'published' }
    ])
  }

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories({ q: searchValue, status: statusFilter })
      setCategories(data.categories)
      setAllCategories(data.allData)
    } catch (err) {
      toast.error(err.message)
    }
  }, [searchValue, statusFilter])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleImageChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = e => {
    e.stopPropagation()
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const autoSlug = val => val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleNameChange = e => {
    const val = e.target.value
    setName(val)
    if (!editing) setSlug(autoSlug(val))
  }

  const openAddDialog = () => {
    setEditing(null)
    setName('')
    setSlug('')
    setParentId('')
    setStatus('published')
    setImagePreview(null)
    setImageFile(null)
    setShowNewParent(false)
    setNewParentName('')
    setDialogOpen(true)
  }

  const openEditDialog = category => {
    setEditing(category)
    setName(category.name)
    setSlug(category.slug || autoSlug(category.name))
    setParentId(category.parentId || '')
    setStatus(category.status || 'published')
    setImagePreview(category.image || null)
    setImageFile(null)
    setShowNewParent(false)
    setNewParentName('')
    setDialogOpen(true)
  }

  const handleCreateParent = async () => {
    if (!newParentName.trim()) {
      toast.error('Parent category name is required')

      return
    }

    setSavingParent(true)

    let created
    try {
      created = await createCategory({
        name: newParentName.trim(),
        slug: autoSlug(newParentName),
        parentId: null,
        status: 'published'
      })
    } catch (err) {
      toast.error(err.message)

      return
    } finally {
      setSavingParent(false)
    }
    toast.success(`"${newParentName.trim()}" created`)
    setNewParentName('')
    setShowNewParent(false)

    // Refresh list and auto-select the new parent
    await fetchCategories()
    if (created?.id) setParentId(created.id)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Category name is required')

      return
    }

    if (saving) return
    setSaving(true)
    try {
      // A new image uploads to Cloudinary only now, on save
      let image = { url: null, publicId: null }
      if (imageFile) image = await uploadImage(imageFile, 'dec-walls/categories')
      else if (imagePreview && editing) image = { url: editing.image ?? null, publicId: editing.imagePublicId ?? null }

      const payload = {
        name: name.trim(),
        slug: slug.trim() || autoSlug(name),
        parentId: parentId || null,
        status,
        imageUrl: image.url,
        imagePublicId: image.publicId
      }

      if (editing) {
        await updateCategory(editing.id, payload)
        toast.success('Category updated')
      } else {
        await createCategory(payload)
        toast.success('Category created')
      }
      setDialogOpen(false)
      fetchCategories()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = category => {
    setDeletingCategory(category)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    try {
      await deleteCategory(deletingCategory.id)
      toast.success(`"${deletingCategory.name}" deleted`)
      fetchCategories()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleteDialogOpen(false)
      setDeletingCategory(null)
    }
  }

  const columns = [
    {
      flex: 0.3,
      field: 'name',
      minWidth: 240,
      headerName: 'Category',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            src={row.image}
            variant='rounded'
            sx={{ mr: 3, width: 38, height: 38 }}
          >
            <Icon icon='mdi:tag-outline' />
          </CustomAvatar>
          <Box>
            <Typography noWrap variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
              {row.name}
            </Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
              /{row.slug || autoSlug(row.name)}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 160,
      field: 'parentId',
      headerName: 'Parent Category',
      renderCell: ({ row }) => {
        const parent = allCategories.find(c => c.id === row.parentId)

        return (
          <Typography variant='body2' sx={{ color: parent ? 'text.primary' : 'text.disabled' }}>
            {parent ? parent.name : '— Top level'}
          </Typography>
        )
      }
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'productCount',
      headerName: 'Products',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Typography variant='body2'>{row.productCount ?? 0}</Typography>
      )
    },
    {
      flex: 0.14,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <CustomChip
          rounded
          size='small'
          skin='light'
          label={row.status || 'published'}
          color={statusColors[row.status] || 'success'}
        />
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <IconButton size='small' onClick={() => openEditDialog(row)}>
              <Icon icon='mdi:pencil-outline' fontSize={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton size='small' onClick={() => confirmDelete(row)}>
              <Icon icon='mdi:delete-outline' fontSize={18} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      {/* Stats Row */}
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ p: 2.5, borderRadius: 1, bgcolor: 'primary.lighter', color: 'primary.main', display: 'flex' }}>
              <Icon icon='mdi:tag-multiple-outline' fontSize={28} />
            </Box>
            <Box>
              <Typography variant='h5' fontWeight={600}>{categories.length}</Typography>
              <Typography variant='body2' color='text.secondary'>Total Categories</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ p: 2.5, borderRadius: 1, bgcolor: 'success.lighter', color: 'success.main', display: 'flex' }}>
              <Icon icon='mdi:check-circle-outline' fontSize={28} />
            </Box>
            <Box>
              <Typography variant='h5' fontWeight={600}>{categories.filter(c => !c.parentId).length}</Typography>
              <Typography variant='body2' color='text.secondary'>Top-Level Categories</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ p: 2.5, borderRadius: 1, bgcolor: 'info.lighter', color: 'info.main', display: 'flex' }}>
              <Icon icon='mdi:sitemap-outline' fontSize={28} />
            </Box>
            <Box>
              <Typography variant='h5' fontWeight={600}>{categories.filter(c => !!c.parentId).length}</Typography>
              <Typography variant='body2' color='text.secondary'>Subcategories</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Table */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Categories'
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button size='small' color='secondary' variant='outlined' onClick={handleExport} startIcon={<Icon icon='mdi:download-outline' />}>
                  Export CSV
                </Button>
                <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={openAddDialog}>
                  Add Category
                </Button>
              </Box>
            }
          />
          {/* Filters */}
          <CardContent sx={{ pb: 0 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Search categories…'
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  InputProps={{ startAdornment: <Icon icon='mdi:magnify' style={{ marginRight: 8 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Status</InputLabel>
                  <Select label='Status' value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <MenuItem value=''>All</MenuItem>
                    <MenuItem value='published'>Published</MenuItem>
                    <MenuItem value='draft'>Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>

          <DataGrid
            autoHeight
            rows={categories}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }, border: 'none' }}
          />
        </Card>
      </Grid>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editing ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Grid container spacing={4}>
            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant='subtitle2' sx={{ mb: 1.5, fontWeight: 600 }}>
                Category Image
              </Typography>
              <ImageUploadBox onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                  <>
                    <Box
                      component='img'
                      src={imagePreview}
                      alt='preview'
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      size='small'
                      onClick={removeImage}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'error.lighter' }
                      }}
                    >
                      <Icon icon='mdi:close' fontSize={16} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Icon icon='mdi:cloud-upload-outline' fontSize={40} style={{ opacity: 0.4 }} />
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                      Click to upload image
                    </Typography>
                    <Typography variant='caption' color='text.disabled'>
                      PNG, JPG, WEBP up to 2MB
                    </Typography>
                  </>
                )}
                <VisuallyHiddenInput
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </ImageUploadBox>
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Category Name *'
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Men's Clothing"
              />
            </Grid>

            {/* Slug */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Slug'
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder='auto-generated from name'
                helperText='URL-friendly identifier. Auto-generated if left as-is.'
              />
            </Grid>

            {/* Parent Category */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  label='Parent Category'
                  value={parentId}
                  onChange={e => setParentId(e.target.value)}
                >
                  <MenuItem value=''>None (top-level)</MenuItem>
                  {allCategories
                    .filter(c => !c.parentId && c.id !== editing?.id)
                    .map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                size='small'
                startIcon={<Icon icon={showNewParent ? 'mdi:minus' : 'mdi:plus'} fontSize={14} />}
                onClick={() => { setShowNewParent(v => !v); setNewParentName('') }}
                sx={{ mt: 1.5, fontSize: '0.75rem', textTransform: 'none', p: 0, minWidth: 0 }}
              >
                {showNewParent ? 'Cancel' : 'Create new parent'}
              </Button>
            </Grid>

            {/* Inline new-parent creator */}
            <Grid item xs={12}>
              <Collapse in={showNewParent}>
                <Box
                  sx={{
                    p: 3,
                    border: '1px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 1,
                    bgcolor: 'action.hover'
                  }}
                >
                  <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    New Parent Category
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <TextField
                      size='small'
                      fullWidth
                      label='Parent Name *'
                      value={newParentName}
                      onChange={e => setNewParentName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleCreateParent() }}
                      placeholder="e.g. Electronics"
                      autoFocus
                    />
                    <Button
                      variant='contained'
                      size='small'
                      disabled={savingParent || !newParentName.trim()}
                      onClick={handleCreateParent}
                      sx={{ whiteSpace: 'nowrap', mt: 0.5 }}
                    >
                      {savingParent ? 'Saving…' : 'Add & Select'}
                    </Button>
                  </Box>
                  <Typography variant='caption' color='text.disabled' sx={{ mt: 1, display: 'block' }}>
                    Creates a top-level parent and automatically selects it.
                  </Typography>
                </Box>
              </Collapse>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label='Status' value={status} onChange={e => setStatus(e.target.value)}>
                  <MenuItem value='published'>Published</MenuItem>
                  <MenuItem value='draft'>Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 6, pb: 4 }}>
          <Button onClick={() => setDialogOpen(false)} color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSave}>
            {editing ? 'Save Changes' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deletingCategory?.name}</strong>?
            {deletingCategory?.productCount > 0 && (
              <Typography variant='body2' color='error' sx={{ mt: 2 }}>
                Warning: This category has {deletingCategory.productCount} product(s) assigned to it.
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color='secondary' variant='outlined'>
            Cancel
          </Button>
          <Button variant='contained' color='error' onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CategoryManager
