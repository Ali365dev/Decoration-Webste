// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import DialogContentText from '@mui/material/DialogContentText'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Services Import
import { getCollections, createCollection, updateCollection, deleteCollection } from 'src/services/collections'
import { getProducts } from 'src/services/products'

/**
 * Collections screen: table + "create collection" dialog, modeled on the
 * DialogCreateApp.js shape (a dialog that collects a name/description and,
 * here, a multi-select of products to assign to the collection).
 */
const CollectionManager = () => {
  // ** State
  const [collections, setCollections] = useState([])
  const [products, setProducts] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingCollection, setDeletingCollection] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [productIds, setProductIds] = useState([])

  const fetchCollections = useCallback(async () => {
    const data = await getCollections({ q: searchValue })
    setCollections(data.collections)
  }, [searchValue])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  useEffect(() => {
    getProducts().then(data => setProducts(data.allData))
  }, [])

  const openAddDialog = () => {
    setEditing(null)
    setName('')
    setDescription('')
    setProductIds([])
    setDialogOpen(true)
  }

  const openEditDialog = collection => {
    setEditing(collection)
    setName(collection.name)
    setDescription(collection.description)
    setProductIds(collection.productIds)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Collection name is required')

      return
    }
    if (editing) {
      await updateCollection(editing.id, { name, description, productIds })
      toast.success('Collection updated')
    } else {
      await createCollection({ name, description, productIds, status: 'active' })
      toast.success('Collection created')
    }
    setDialogOpen(false)
    fetchCollections()
  }

  const handleDelete = collection => {
    setDeletingCollection(collection)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingCollection) return
    await deleteCollection(deletingCollection.id)
    toast.success(`${deletingCollection.name} deleted`)
    setDeleteDialogOpen(false)
    setDeletingCollection(null)
    fetchCollections()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Collections'
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={openAddDialog}>
                Create Collection
              </Button>
            }
          />
          <Box sx={{ px: 5, pb: 4 }}>
            <TextField
              size='small'
              placeholder='Search collections…'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='mdi:magnify' fontSize={20} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align='right'>Products</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collections.map(collection => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CustomAvatar
                          src={collection.thumbnailUrl}
                          variant='rounded'
                          sx={{ width: 38, height: 38, flexShrink: 0 }}
                        >
                          <Icon icon='mdi:folder-multiple-image' />
                        </CustomAvatar>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {collection.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>{collection.description}</TableCell>
                    <TableCell align='right'>{collection.productCount ?? collection.productIds?.length ?? 0}</TableCell>
                    <TableCell>
                      <CustomChip
                        size='small'
                        skin='light'
                        color={collection.status === 'active' ? 'success' : 'secondary'}
                        label={collection.status}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton size='small' onClick={() => openEditDialog(collection)}>
                        <Icon icon='mdi:pencil-outline' fontSize={18} />
                      </IconButton>
                      <IconButton size='small' onClick={() => handleDelete(collection)}>
                        <Icon icon='mdi:delete-outline' fontSize={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>{editing ? 'Edit Collection' : 'Create Collection'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            label='Collection Name'
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ mb: 4, mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            label='Description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            sx={{ mb: 4 }}
          />
          <Autocomplete
            multiple
            options={products}
            getOptionLabel={option => option.name}
            value={products.filter(p => productIds.includes(p.id))}
            onChange={(e, newValue) => setProductIds(newValue.map(v => v.id))}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => <Chip label={option.name} {...getTagProps({ index })} key={option.id} />)
            }
            renderInput={params => <TextField {...params} label='Products' placeholder='Assign products' />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color='secondary'>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Delete Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{deletingCollection?.name}</strong>? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color='secondary'>
            Cancel
          </Button>
          <Button variant='contained' color='error' onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CollectionManager
