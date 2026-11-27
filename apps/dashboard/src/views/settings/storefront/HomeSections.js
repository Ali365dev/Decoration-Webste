// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services
import { ConflictError, getHomeContent, saveHomeContent } from 'src/services/storefront'

import { SaveBar, ScreenLoading, clean, humanizeError, moveItem, showSaveResult, useUnsavedChanges } from './common'
import { SECTIONS } from './SectionForms'
import { moveProps } from './a11y'
import { MAX_SHOWCASES, SHOWCASE_TYPE, addShowcase, removeSection, safely, updateSectionById } from './state'
import { announce } from './a11y'

const toWorking = data => ({
  seoTitle: data.seoTitle || '',
  seoDescription: data.seoDescription || '',
  sections: data.sections.map(s => ({ id: s.id, type: s.type, hidden: s.hidden, data: s.data }))
})

const sectionName = section => {
  const meta = SECTIONS[section.type]
  if (!meta) return section.type
  if (section.type === 'category_showcase')
    return section.data?.heading && typeof section.data.heading === 'string'
      ? `${meta.name}: ${section.data.heading}`
      : `${meta.name} (new)`

  return meta.name
}

/** "sections.3 (hero) slides.0.heading: This field is required." → { index: 3, detail: "slides.0.heading: …" } */
const parseSectionError = message => {
  const match = /^sections\.(\d+) \([a-z_]+\) (.*)$/.exec(message || '')

  return match ? { index: Number(match[1]), detail: match[2] } : null
}

const HomeSections = () => {
  const [saved, setSaved] = useState(null)
  const [working, setWorking] = useState(null)
  const [version, setVersion] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [saving, setSaving] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [removing, setRemoving] = useState(null)

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const { data, version: v } = await getHomeContent()
      const w = toWorking(data)
      setSaved(w)
      setWorking(w)
      setVersion(v)
      setConflict(false)
    } catch (error) {
      setLoadError(
        error?.response?.data?.error ||
          error.message ||
          "Couldn't load the home page. Check that the shop is running, then try again."
      )
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const dirty = useMemo(
    () => Boolean(saved && working) && JSON.stringify(saved) !== JSON.stringify(working),
    [saved, working]
  )
  useUnsavedChanges(dirty)

  const updateSection = (id, patch) => setWorking(w => updateSectionById(w, id, patch))

  const moveSection = (from, to) => setWorking(w => ({ ...w, sections: moveItem(w.sections, from, to) }))

  const onSave = async () => {
    setSaving(true)
    try {
      const payload = {
        seoTitle: working.seoTitle,
        seoDescription: working.seoDescription,
        sections: working.sections.map(s => ({
          id: s.id,
          ...(s.isNew ? { type: s.type } : {}),
          hidden: s.hidden,
          data: clean(s.data)
        }))
      }
      const result = await saveHomeContent(payload, version)
      const w = toWorking(result.data)
      setSaved(w)
      setWorking(w)
      setVersion(result.version)
      showSaveResult(result)
    } catch (error) {
      if (error instanceof ConflictError) {
        setConflict(true)
        toast.error(error.message)
      } else {
        const parsed = parseSectionError(error.message)
        if (parsed && working.sections[parsed.index]) {
          setExpanded(working.sections[parsed.index].id)
          toast.error(humanizeError(parsed.detail, sectionName(working.sections[parsed.index])), { duration: 8000 })
        } else {
          toast.error(humanizeError(error.message), { duration: 8000 })
        }
      }
    } finally {
      setSaving(false)
    }
  }

  if (loadError) {
    return (
      <Alert severity='error' action={<Button onClick={load}>Try again</Button>}>
        {loadError}
      </Alert>
    )
  }
  if (!working) return <ScreenLoading />

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant='h5' sx={{ mb: 1 }}>
          Home page
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary', maxWidth: 640 }}>
          Change what each section of the shop's home page shows, hide sections, and change their order. Saving updates
          the shop straight away.
        </Typography>
      </Box>

      {conflict ? (
        <Alert severity='warning' sx={{ mb: 4 }} action={<Button onClick={load}>Reload</Button>}>
          Someone else saved the home page while you were editing. Reload to see their changes; your unsaved edits will
          be lost.
        </Alert>
      ) : null}

      <Box
        component='ol'
        sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 3 }}
        aria-label='Home page sections, in display order'
      >
        {working.sections.map((section, index) => {
          const meta = SECTIONS[section.type]
          const name = sectionName(section)
          const open = expanded === section.id
          const panelId = `section-panel-${section.id}`

          return (
            <Card component='li' key={section.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 4, py: 2.5 }}>
                <Typography
                  variant='body2'
                  sx={{ width: 20, textAlign: 'right', color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}
                >
                  {index + 1}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    color: 'text.secondary',
                    flex: '0 0 auto'
                  }}
                >
                  <Icon icon={meta?.icon || 'mdi:shape-outline'} fontSize='1.25rem' />
                </Box>
                <Box
                  component='button'
                  type='button'
                  aria-expanded={open}
                  aria-controls={open ? panelId : undefined}
                  onClick={() => setExpanded(open ? null : section.id)}
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
                  <Typography sx={{ fontWeight: 500, color: 'text.primary' }}>{name}</Typography>
                  <Typography variant='body2' noWrap sx={{ color: 'text.secondary' }}>
                    {section.hidden
                      ? 'Hidden from the shop'
                      : section.isNew
                      ? 'New. Fill in the details, then save'
                      : safely(() => meta?.summary(section.data), '')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch
                    checked={!section.hidden}
                    onChange={e => updateSection(section.id, { hidden: !e.target.checked })}
                    inputProps={{ 'aria-label': `Show ${name} on the shop` }}
                  />
                  <IconButton
                    size='small'
                    {...moveProps({
                      group: 'sections',
                      index,
                      count: working.sections.length,
                      name,
                      direction: 'up',
                      onMove: moveSection
                    })}
                  >
                    <Icon icon='mdi:arrow-up' fontSize='1.125rem' />
                  </IconButton>
                  <IconButton
                    size='small'
                    {...moveProps({
                      group: 'sections',
                      index,
                      count: working.sections.length,
                      name,
                      direction: 'down',
                      onMove: moveSection
                    })}
                  >
                    <Icon icon='mdi:arrow-down' fontSize='1.125rem' />
                  </IconButton>
                  <IconButton
                    size='small'
                    aria-label={open ? `Close ${name}` : `Edit ${name}`}
                    aria-expanded={open}
                    aria-controls={open ? panelId : undefined}
                    onClick={() => setExpanded(open ? null : section.id)}
                  >
                    <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} fontSize='1.25rem' />
                  </IconButton>
                </Box>
              </Box>
              <Collapse in={open} unmountOnExit>
                <CardContent id={panelId} sx={{ borderTop: theme => `1px solid ${theme.palette.divider}`, pt: 5 }}>
                  {meta ? (
                    <meta.Form data={section.data} onChange={update => updateSection(section.id, { data: update })} />
                  ) : (
                    <Typography variant='body2'>This section can't be edited here.</Typography>
                  )}
                  {section.type === SHOWCASE_TYPE ? (
                    <Box sx={{ mt: 5, pt: 4, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
                      <Button
                        color='error'
                        size='small'
                        startIcon={<Icon icon='mdi:delete-outline' fontSize='1.125rem' />}
                        onClick={() => setRemoving(section)}
                      >
                        Remove this showcase
                      </Button>
                    </Box>
                  ) : null}
                </CardContent>
              </Collapse>
            </Card>
          )
        })}
      </Box>

      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Button
          variant='outlined'
          startIcon={<Icon icon='mdi:plus' fontSize='1.125rem' />}
          disabled={working.sections.filter(s => s.type === SHOWCASE_TYPE).length >= MAX_SHOWCASES}
          onClick={() => {
            const id = `new-${Date.now()}`
            setWorking(w => addShowcase(w, id))
            setExpanded(id)
            announce('New category showcase added after the last one. Fill in its details, then save.')
          }}
        >
          Add category showcase
        </Button>
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {working.sections.filter(s => s.type === SHOWCASE_TYPE).length >= MAX_SHOWCASES
            ? `The home page has the most showcases it can hold (${MAX_SHOWCASES})`
            : `A banner with a list of collections. Up to ${MAX_SHOWCASES}.`}
        </Typography>
      </Box>

      <Dialog open={Boolean(removing)} onClose={() => setRemoving(null)} aria-labelledby='remove-showcase-title'>
        <DialogTitle id='remove-showcase-title'>
          Remove {removing ? sectionName(removing) : ''} from the home page?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            It disappears from the shop when you save. You can't undo this after saving.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoving(null)}>Keep showcase</Button>
          <Button
            color='error'
            variant='contained'
            onClick={() => {
              const name = sectionName(removing)
              setWorking(w => removeSection(w, removing.id))
              setExpanded(null)
              setRemoving(null)
              announce(`${name} removed. Save to update the shop.`)
            }}
          >
            Remove showcase
          </Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ mt: 6 }}>
        <CardHeader
          title='Search engines'
          subheader='How the home page appears in Google results'
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size='small'
                label='Page title'
                value={working.seoTitle}
                inputProps={{ maxLength: 70 }}
                helperText={`${working.seoTitle.length} of 70 characters`}
                onChange={e => setWorking(w => ({ ...w, seoTitle: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                size='small'
                label='Description'
                value={working.seoDescription}
                inputProps={{ maxLength: 160 }}
                helperText={`${working.seoDescription.length} of 160 characters`}
                onChange={e => setWorking(w => ({ ...w, seoDescription: e.target.value }))}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <SaveBar dirty={dirty} saving={saving} onSave={onSave} onDiscard={() => setWorking(saved)} />
    </Box>
  )
}

export default HomeSections
