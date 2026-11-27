// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services
import { ConflictError, getMenu, saveMenu } from 'src/services/storefront'

import { moveProps } from './a11y'
import {
  MenuLinkField,
  SaveBar,
  ScreenLoading,
  humanizeError,
  moveItem,
  showSaveResult,
  useUnsavedChanges
} from './common'

const LEVEL_NAMES = ['Menu item', 'Column', 'Link']
const ADD_NAMES = ['Add menu item', 'Add column', 'Add link']

export const toPlainItems = items =>
  (items || []).map(i => ({ label: i.label, href: i.href, children: toPlainItems(i.children) }))

const trimItems = items =>
  items.map(i => ({ label: i.label.trim(), href: i.href.trim(), children: trimItems(i.children) }))

const countLinks = items => items.reduce((n, i) => n + 1 + countLinks(i.children), 0)

const ItemRow = ({ item, index, siblings, onChange, depth, maxDepth, path }) => {
  const name = `${LEVEL_NAMES[depth]} ${index + 1}${item.label ? ` (${item.label})` : ''}`
  const replace = next => onChange(siblings.map((s, i) => (i === index ? next : s)))

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Grid container spacing={3} alignItems='flex-start'>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            size='small'
            required
            label={LEVEL_NAMES[depth] === 'Link' ? 'Link text' : 'Name'}
            value={item.label}
            inputProps={{ maxLength: 60 }}
            error={!item.label.trim()}
            helperText={!item.label.trim() ? 'Add a name' : ' '}
            onChange={e => replace({ ...item, label: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <MenuLinkField
            value={item.href}
            depth={depth}
            onChange={href => replace({ ...item, href })}
            onPick={link => replace({ ...item, ...link })}
            helperText=' '
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={2}
          sx={{ display: 'flex', justifyContent: { sm: 'flex-end' }, pt: { sm: '20px !important' } }}
        >
          <IconButton
            size='small'
            {...moveProps({
              group: path,
              index,
              count: siblings.length,
              name,
              direction: 'up',
              onMove: (f, t) => onChange(moveItem(siblings, f, t))
            })}
          >
            <Icon icon='mdi:arrow-up' fontSize='1.125rem' />
          </IconButton>
          <IconButton
            size='small'
            {...moveProps({
              group: path,
              index,
              count: siblings.length,
              name,
              direction: 'down',
              onMove: (f, t) => onChange(moveItem(siblings, f, t))
            })}
          >
            <Icon icon='mdi:arrow-down' fontSize='1.125rem' />
          </IconButton>
          <IconButton
            size='small'
            aria-label={`Remove ${name}`}
            onClick={() => onChange(siblings.filter((_, i) => i !== index))}
          >
            <Icon icon='mdi:delete-outline' fontSize='1.125rem' />
          </IconButton>
        </Grid>
      </Grid>
      {depth + 1 < maxDepth ? (
        <Box sx={{ pl: 4, ml: 1, borderLeft: theme => `2px solid ${theme.palette.divider}` }}>
          <MenuItems
            items={item.children}
            onChange={children => replace({ ...item, children })}
            depth={depth + 1}
            maxDepth={maxDepth}
            path={`${path}.${index}`}
          />
        </Box>
      ) : null}
    </Box>
  )
}

export const MenuItems = ({ items, onChange, depth = 0, maxDepth, path = 'items' }) => (
  <Box sx={{ display: 'grid', gap: 3 }}>
    {items.map((item, index) => (
      <ItemRow
        key={`${path}.${index}`}
        item={item}
        index={index}
        siblings={items}
        onChange={onChange}
        depth={depth}
        maxDepth={maxDepth}
        path={path}
      />
    ))}
    <Box>
      <Button
        size='small'
        startIcon={<Icon icon='mdi:plus' fontSize='1.125rem' />}
        onClick={() => onChange([...items, { label: '', href: '/collections/', children: [] }])}
      >
        {ADD_NAMES[depth]}
      </Button>
    </Box>
  </Box>
)

/** Header menu: top items are collapsible cards; columns and links nest inside them. */
const HeaderMenu = () => {
  const [saved, setSaved] = useState(null)
  const [items, setItems] = useState(null)
  const [name, setName] = useState('Main menu')
  const [version, setVersion] = useState(null)
  const [open, setOpen] = useState(null)
  const [saving, setSaving] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const { data, version: v } = await getMenu('main')
      const plain = toPlainItems(data.items)
      setSaved(plain)
      setItems(plain)
      setName(data.name)
      setVersion(v)
      setConflict(false)
    } catch (error) {
      setLoadError(
        error?.response?.data?.error ||
          error.message ||
          "Couldn't load the menu. Check that the shop is running, then try again."
      )
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const dirty = useMemo(
    () => Boolean(saved && items) && JSON.stringify(saved) !== JSON.stringify(items),
    [saved, items]
  )
  useUnsavedChanges(dirty)

  const onSave = async () => {
    setSaving(true)
    try {
      const result = await saveMenu('main', { name, items: trimItems(items) }, version)
      const plain = toPlainItems(result.data.items)
      setSaved(plain)
      setItems(plain)
      setVersion(result.version)
      showSaveResult(result)
    } catch (error) {
      if (error instanceof ConflictError) setConflict(true)
      toast.error(error instanceof ConflictError ? error.message : humanizeError(error.message, 'Header menu'), {
        duration: 8000
      })
    } finally {
      setSaving(false)
    }
  }

  if (loadError)
    return (
      <Alert severity='error' action={<Button onClick={load}>Try again</Button>}>
        {loadError}
      </Alert>
    )
  if (!items) return <ScreenLoading />

  const replaceTop = (index, next) => setItems(items.map((it, i) => (i === index ? next : it)))

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant='h5' sx={{ mb: 1 }}>
          Header menu
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary', maxWidth: 640 }}>
          The menu across the top of every page. Each menu item can open a panel of columns, and each column holds
          links. {countLinks(items)} links in total.
        </Typography>
      </Box>

      {conflict ? (
        <Alert severity='warning' sx={{ mb: 4 }} action={<Button onClick={load}>Reload</Button>}>
          Someone else saved the menu while you were editing. Reload to see their changes; your unsaved edits will be
          lost.
        </Alert>
      ) : null}

      <Box
        component='ol'
        sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 3 }}
        aria-label='Menu items, in display order'
      >
        {items.map((item, index) => {
          const isOpen = open === index
          const label = item.label || `Menu item ${index + 1}`
          const panelId = `menu-panel-${index}`

          return (
            <Card component='li' key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 4, py: 2.5 }}>
                <Box
                  component='button'
                  type='button'
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? panelId : undefined}
                  onClick={() => setOpen(isOpen ? null : index)}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: 'left',
                    border: 0,
                    background: 'none',
                    p: 0,
                    cursor: 'pointer',
                    font: 'inherit',
                    color: 'inherit',
                    '&:focus-visible': {
                      outline: theme => `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: 4,
                      borderRadius: 1
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 500, color: 'text.primary' }}>{label}</Typography>
                  <Typography variant='body2' noWrap sx={{ color: 'text.secondary' }}>
                    {item.href} · {item.children.length} {item.children.length === 1 ? 'column' : 'columns'},{' '}
                    {countLinks(item.children) - item.children.length} links
                  </Typography>
                </Box>
                <IconButton
                  size='small'
                  {...moveProps({
                    group: 'menu',
                    index,
                    count: items.length,
                    name: label,
                    direction: 'up',
                    onMove: (f, t) => {
                      setItems(moveItem(items, f, t))
                      setOpen(null)
                    }
                  })}
                >
                  <Icon icon='mdi:arrow-up' fontSize='1.125rem' />
                </IconButton>
                <IconButton
                  size='small'
                  {...moveProps({
                    group: 'menu',
                    index,
                    count: items.length,
                    name: label,
                    direction: 'down',
                    onMove: (f, t) => {
                      setItems(moveItem(items, f, t))
                      setOpen(null)
                    }
                  })}
                >
                  <Icon icon='mdi:arrow-down' fontSize='1.125rem' />
                </IconButton>
                <IconButton
                  size='small'
                  aria-label={isOpen ? `Close ${label}` : `Edit ${label}`}
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? panelId : undefined}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <Icon icon={isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'} fontSize='1.25rem' />
                </IconButton>
              </Box>
              <Collapse in={isOpen} unmountOnExit>
                <Box
                  id={panelId}
                  sx={{
                    px: 5,
                    py: 5,
                    borderTop: theme => `1px solid ${theme.palette.divider}`,
                    display: 'grid',
                    gap: 5
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size='small'
                        required
                        label='Name'
                        value={item.label}
                        inputProps={{ maxLength: 60 }}
                        error={!item.label.trim()}
                        helperText={!item.label.trim() ? 'Add a name' : 'Shown in the menu bar'}
                        onChange={e => replaceTop(index, { ...item, label: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MenuLinkField
                        value={item.href}
                        depth={0}
                        onChange={href => replaceTop(index, { ...item, href })}
                        onPick={link => replaceTop(index, { ...item, ...link })}
                      />
                    </Grid>
                  </Grid>
                  <Box>
                    <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary', mb: 3 }}>
                      Columns in the menu panel
                    </Typography>
                    <MenuItems
                      items={item.children}
                      onChange={children => replaceTop(index, { ...item, children })}
                      depth={1}
                      maxDepth={3}
                      path={`items.${index}`}
                    />
                  </Box>
                  <Box>
                    <Button
                      color='error'
                      size='small'
                      startIcon={<Icon icon='mdi:delete-outline' fontSize='1.125rem' />}
                      onClick={() => {
                        setItems(items.filter((_, i) => i !== index))
                        setOpen(null)
                      }}
                    >
                      Remove {label} from the menu
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Card>
          )
        })}
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button
          startIcon={<Icon icon='mdi:plus' fontSize='1.125rem' />}
          onClick={() => {
            setItems([...items, { label: '', href: '/collections/', children: [] }])
            setOpen(items.length)
          }}
        >
          Add menu item
        </Button>
      </Box>

      <SaveBar dirty={dirty} saving={saving} onSave={onSave} onDiscard={() => setItems(saved)} />
    </Box>
  )
}

export default HeaderMenu
