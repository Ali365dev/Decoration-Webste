// Shared pieces for the Storefront settings screens.

// ** React Imports
import { createContext, useContext, useEffect, useId, useState } from 'react'

// ** Next Import
import Router from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { moveProps } from './a11y'
import { applyUpdate, collectionToLink } from './state'

// ** Services
import { getCollections } from 'src/services/collections'
import { uploadImage } from 'src/services/uploads'

export const UPLOAD_FOLDER = 'dec-walls/storefront'

// ── Storefront address, for previewing images stored as site paths like /home/hero-1.jpg ──

const StorefrontUrlContext = createContext('')

export const StorefrontUrlProvider = StorefrontUrlContext.Provider

export const useAssetUrl = () => {
  const base = useContext(StorefrontUrlContext)

  return src => (src && src.startsWith('/') && !src.startsWith('//') ? `${base.replace(/\/+$/, '')}${src}` : src || '')
}

// ── Links ──

export const isLink = value => /^(\/(?!\/)|https:\/\/)/.test((value || '').trim())

export const LinkField = ({ label, value, onChange, required = true, helperText, ...rest }) => {
  const [touched, setTouched] = useState(false)
  const empty = !(value || '').trim()
  const invalid = touched && ((required && empty) || (!empty && !isLink(value)))

  return (
    <TextField
      fullWidth
      size='small'
      label={label}
      value={value || ''}
      required={required}
      onChange={e => onChange(e.target.value)}
      onBlur={() => setTouched(true)}
      error={invalid}
      helperText={
        invalid
          ? empty
            ? 'Add a link'
            : 'Start with / for a page on the shop, or https:// for another site'
          : helperText || 'For example /collections/bedding'
      }
      {...rest}
    />
  )
}

// ── Collections ──

// `name` is the collection's own name; `label` is what pickers show.
const SPECIAL_COLLECTIONS = [
  { slug: 'new-in', name: 'New in', label: 'New in (products labelled NEW IN)' },
  { slug: 'sale', name: 'Sale', label: 'Sale (products with a sale price)' }
]

let collectionsPromise = null

export const useCollections = () => {
  const [options, setOptions] = useState(SPECIAL_COLLECTIONS)

  useEffect(() => {
    let active = true
    collectionsPromise = collectionsPromise || getCollections().catch(() => ({ allData: [] }))
    collectionsPromise.then(({ allData }) => {
      if (!active) return

      const real = allData
        .filter(c => !SPECIAL_COLLECTIONS.some(s => s.slug === c.slug))
        .map(c => ({
          slug: c.slug,
          name: c.name,
          label: `${c.name} (${c.productCount} ${c.productCount === 1 ? 'product' : 'products'})`
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
      setOptions([...SPECIAL_COLLECTIONS, ...real])
    })

    return () => {
      active = false
    }
  }, [])

  return options
}

export const CollectionSelect = ({ label, value, onChange, helperText }) => {
  const options = useCollections()
  const known = options.some(o => o.slug === value)

  return (
    <TextField
      select
      fullWidth
      size='small'
      label={label}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      helperText={helperText}
      SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 360 } } } }}
    >
      {!known && value ? <MenuItem value={value}>{value} (not found)</MenuItem> : null}
      {options.map(o => (
        <MenuItem key={o.slug} value={o.slug}>
          {o.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

// ── Menu links: suggest collections while typing ──

const matchCollections = (options, input) => {
  const text = (input || '')
    .trim()
    .toLowerCase()
    .replace(/^\/?(collections\/)?/, '')

  return options.filter(o => !text || o.name.toLowerCase().includes(text) || o.slug.includes(text)).slice(0, 8)
}

/**
 * The "Goes to" field of a menu link. Typing suggests collections; picking one fills both the
 * link and the name (via onPick). Any other link can still be typed by hand.
 */
export const MenuLinkField = ({ value, onChange, onPick, depth, helperText }) => {
  const options = useCollections()
  const [touched, setTouched] = useState(false)
  const empty = !(value || '').trim()
  const invalid = touched && (empty || !isLink(value))

  return (
    <Autocomplete
      freeSolo
      options={options}
      filterOptions={(opts, state) => matchCollections(opts, state.inputValue)}
      getOptionLabel={o => (typeof o === 'string' ? o : `/collections/${o.slug}`)}
      inputValue={value || ''}
      onInputChange={(_, next, reason) => {
        if (reason === 'input' || reason === 'clear') onChange(next)
      }}
      onChange={(_, picked) => {
        if (picked && typeof picked === 'object') onPick(collectionToLink(picked, depth))
      }}
      renderOption={(props, o) => (
        <li {...props} key={o.slug}>
          <Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {o.label}
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.secondary' }}>
              /collections/{o.slug}
            </Typography>
          </Box>
        </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          size='small'
          label='Goes to'
          required
          onBlur={() => setTouched(true)}
          error={invalid}
          helperText={
            invalid
              ? empty
                ? 'Add a link'
                : 'Start with / for a page on the shop, or https:// for another site'
              : helperText ?? 'Type a collection name to pick it, or any link'
          }
        />
      )}
    />
  )
}

// ── Images ──

const HiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1
})

export const ImageField = ({ label, value, onChange, ratio = '16 / 9' }) => {
  const id = useId()
  const asset = useAssetUrl()
  const [uploading, setUploading] = useState(false)

  const onFile = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const { url } = await uploadImage(file, UPLOAD_FOLDER)
      onChange(url)
    } catch (error) {
      toast.error(
        `Couldn't upload the image (${
          error.message || 'upload failed'
        }). Try again, or paste the image address instead.`
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '160px 1fr' }, gap: 3, alignItems: 'start' }}>
      <Box
        sx={{
          aspectRatio: ratio,
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'action.hover',
          border: theme => `1px solid ${theme.palette.divider}`,
          display: 'grid',
          placeItems: 'center'
        }}
      >
        {uploading ? (
          <CircularProgress size={20} />
        ) : value ? (
          <Box component='img' src={asset(value)} alt='' sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Icon icon='mdi:image-outline' fontSize='1.5rem' />
        )}
      </Box>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField
          fullWidth
          size='small'
          label={label}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          error={Boolean(value) && !isLink(value)}
          helperText={value && !isLink(value) ? 'Start with / or https://' : 'Upload an image, or paste its address'}
        />
        <Box>
          <Button
            component='label'
            htmlFor={id}
            size='small'
            variant='outlined'
            disabled={uploading}
            startIcon={<Icon icon='mdi:upload-outline' fontSize='1.125rem' />}
          >
            {uploading ? 'Uploading' : 'Upload image'}
          </Button>
          <HiddenInput id={id} type='file' accept='image/*' onChange={onFile} />
        </Box>
      </Box>
    </Box>
  )
}

// ── Repeating items (slides, tiles, links…) ──

const move = (list, from, to) => {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)

  return next
}

export const ListEditor = ({ items, onChange, renderItem, newItem, itemLabel, addLabel, min = 0, max = 50 }) => {
  const group = useId()
  const onMove = (from, to) => onChange(prev => move(prev || [], from, to))

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {items.map((item, index) => {
        const name = `${itemLabel} ${index + 1}`

        return (
          <Box
            key={index}
            role='group'
            aria-label={name}
            sx={{ border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary', mr: 'auto' }}>
                {name}
              </Typography>
              <IconButton
                size='small'
                {...moveProps({ group, index, count: items.length, name, direction: 'up', onMove })}
              >
                <Icon icon='mdi:arrow-up' fontSize='1.125rem' />
              </IconButton>
              <IconButton
                size='small'
                {...moveProps({ group, index, count: items.length, name, direction: 'down', onMove })}
              >
                <Icon icon='mdi:arrow-down' fontSize='1.125rem' />
              </IconButton>
              <IconButton
                size='small'
                aria-label={`Remove ${name}`}
                disabled={items.length <= min}
                onClick={() => onChange(prev => (prev || []).filter((_, i) => i !== index))}
              >
                <Icon icon='mdi:delete-outline' fontSize='1.125rem' />
              </IconButton>
            </Box>
            {renderItem(
              item,
              next => onChange(prev => (prev || []).map((it, i) => (i === index ? applyUpdate(it, next) : it))),
              index
            )}
          </Box>
        )
      })}
      {items.length < max ? (
        <Box>
          <Button
            size='small'
            startIcon={<Icon icon='mdi:plus' fontSize='1.125rem' />}
            onClick={() => onChange(prev => [...(prev || []), newItem()])}
          >
            {addLabel}
          </Button>
        </Box>
      ) : null}
    </Box>
  )
}

export const moveItem = move

// ── Unsaved changes ──

const LEAVE_MESSAGE = 'You have unsaved changes. Leave without saving?'

export const useUnsavedChanges = dirty => {
  useEffect(() => {
    if (!dirty) return

    const onBeforeUnload = event => {
      event.preventDefault()
      event.returnValue = LEAVE_MESSAGE
    }

    const onRouteChange = () => {
      if (!window.confirm(LEAVE_MESSAGE)) {
        Router.events.emit('routeChangeError')
        throw 'Route change cancelled because of unsaved changes'
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    Router.events.on('routeChangeStart', onRouteChange)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      Router.events.off('routeChangeStart', onRouteChange)
    }
  }, [dirty])
}

// ── Save bar ──

export const SaveBar = ({ dirty, saving, onSave, onDiscard }) => (
  <Card
    sx={{
      position: 'sticky',
      bottom: 16,
      zIndex: 2,
      mt: 6,
      pl: 5,
      pr: { xs: 5, sm: 18 }, // clear of the template's floating scroll-to-top button
      py: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      flexWrap: 'wrap'
    }}
  >
    <Typography variant='body2' role='status' sx={{ mr: 'auto' }}>
      {saving ? 'Saving' : dirty ? 'You have unsaved changes' : 'All changes saved'}
    </Typography>
    <Button variant='outlined' color='secondary' disabled={!dirty || saving} onClick={onDiscard}>
      Discard changes
    </Button>
    <Button variant='contained' disabled={!dirty || saving} onClick={onSave}>
      {saving ? 'Saving' : 'Save and publish'}
    </Button>
  </Card>
)

// ── Saving ──

export { humanizeError } from './errors'

/** Removes empty optional values ("" strings, then objects left empty) before saving. */
export const clean = value => {
  if (Array.isArray(value)) return value.map(clean)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, v] of Object.entries(value)) {
      if (v === '' || v === undefined || v === null) continue
      const c = clean(v)
      if (c && typeof c === 'object' && !Array.isArray(c) && !Object.keys(c).length) continue
      out[key] = c
    }

    return out
  }

  return typeof value === 'string' ? value.trim() : value
}

export const showSaveResult = ({ notice }) => {
  if (notice) toast(notice, { icon: <Icon icon='mdi:clock-outline' fontSize='1.25rem' />, duration: 6000 })
  else toast.success('Saved. The shop shows your changes now.')
}

export const ScreenLoading = () => (
  <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
    <CircularProgress />
  </Box>
)
