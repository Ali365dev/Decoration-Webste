// ** React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services
import { ConflictError, getContact, getMenu, saveContact, saveMenu } from 'src/services/storefront'

import { SaveBar, ScreenLoading, humanizeError, isLink, showSaveResult, useUnsavedChanges } from './common'
import { MenuItems, toPlainItems } from './MenuEditor'

const COLUMNS = [
  { key: 'footer-information', title: 'First link column' },
  { key: 'footer-customer-service', title: 'Second link column' }
]

const NETWORKS = [
  { network: 'facebook', label: 'Facebook', icon: 'mdi:facebook', placeholder: 'https://facebook.com/decwalls' },
  { network: 'instagram', label: 'Instagram', icon: 'mdi:instagram', placeholder: 'https://instagram.com/decwalls' },
  { network: 'youtube', label: 'YouTube', icon: 'mdi:youtube', placeholder: 'https://youtube.com/@decwalls' }
]

const toContactForm = c => ({
  address: c.address || '',
  email: c.email || '',
  phone: c.phone || '',
  social: Object.fromEntries(
    NETWORKS.map(({ network }) => [network, c.social?.find(s => s.network === network)?.href || ''])
  )
})

const fromContactForm = f => ({
  address: f.address.trim(),
  email: f.email.trim(),
  phone: f.phone.trim(),
  social: NETWORKS.filter(({ network }) => f.social[network].trim()).map(({ network }) => ({
    network,
    href: f.social[network].trim()
  }))
})

const trimItems = items => items.map(i => ({ label: i.label.trim(), href: i.href.trim(), children: [] }))

const FooterEditor = () => {
  const [saved, setSaved] = useState(null)
  const [form, setForm] = useState(null)
  const [versions, setVersions] = useState({})
  const [saving, setSaving] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const [info, service, contact] = await Promise.all([
        getMenu(COLUMNS[0].key),
        getMenu(COLUMNS[1].key),
        getContact()
      ])

      const next = {
        [COLUMNS[0].key]: { name: info.data.name, items: toPlainItems(info.data.items) },
        [COLUMNS[1].key]: { name: service.data.name, items: toPlainItems(service.data.items) },
        contact: toContactForm(contact.data)
      }
      setSaved(next)
      setForm(next)
      setVersions({ [COLUMNS[0].key]: info.version, [COLUMNS[1].key]: service.version, contact: contact.version })
      setConflict(false)
    } catch (error) {
      setLoadError(
        error?.response?.data?.error ||
          error.message ||
          "Couldn't load the footer. Check that the shop is running, then try again."
      )
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const changed = part => Boolean(saved && form) && JSON.stringify(saved[part]) !== JSON.stringify(form[part])
  const dirty = useMemo(() => Boolean(saved && form) && JSON.stringify(saved) !== JSON.stringify(form), [saved, form])
  useUnsavedChanges(dirty)

  const setPart = (part, value) => setForm(f => ({ ...f, [part]: value }))
  const setContact = (key, value) => setForm(f => ({ ...f, contact: { ...f.contact, [key]: value } }))

  // Saves only the parts that changed, one after another; each keeps its own version.
  const onSave = async () => {
    setSaving(true)
    let notice = null
    try {
      for (const { key } of COLUMNS) {
        if (!changed(key)) continue

        const result = await saveMenu(
          key,
          { name: form[key].name.trim(), items: trimItems(form[key].items) },
          versions[key]
        )
        const value = { name: result.data.name, items: toPlainItems(result.data.items) }
        setSaved(s => ({ ...s, [key]: value }))
        setForm(f => ({ ...f, [key]: value }))
        setVersions(v => ({ ...v, [key]: result.version }))
        notice = notice || result.notice
      }
      if (changed('contact')) {
        const result = await saveContact(fromContactForm(form.contact), versions.contact)
        const value = toContactForm(result.data)
        setSaved(s => ({ ...s, contact: value }))
        setForm(f => ({ ...f, contact: value }))
        setVersions(v => ({ ...v, contact: result.version }))
        notice = notice || result.notice
      }
      showSaveResult({ notice })
    } catch (error) {
      if (error instanceof ConflictError) setConflict(true)
      toast.error(error instanceof ConflictError ? error.message : humanizeError(error.message), { duration: 8000 })
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
  if (!form) return <ScreenLoading />

  const emailInvalid = form.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.email.trim())

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant='h5' sx={{ mb: 1 }}>
          Footer and contact details
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary', maxWidth: 640 }}>
          The links, contact details and social links at the bottom of every page.
        </Typography>
      </Box>

      {conflict ? (
        <Alert severity='warning' sx={{ mb: 4 }} action={<Button onClick={load}>Reload</Button>}>
          Someone else saved the footer while you were editing. Reload to see their changes; your unsaved edits will be
          lost.
        </Alert>
      ) : null}

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title='Contact details' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent sx={{ display: 'grid', gap: 4 }}>
              <TextField
                size='small'
                fullWidth
                required
                label='Address'
                value={form.contact.address}
                inputProps={{ maxLength: 200 }}
                onChange={e => setContact('address', e.target.value)}
              />
              <TextField
                size='small'
                fullWidth
                required
                type='email'
                label='Email'
                value={form.contact.email}
                error={Boolean(emailInvalid)}
                helperText={emailInvalid ? 'Enter a valid email address' : undefined}
                onChange={e => setContact('email', e.target.value)}
              />
              <TextField
                size='small'
                fullWidth
                required
                type='tel'
                label='Phone'
                value={form.contact.phone}
                inputProps={{ maxLength: 30 }}
                onChange={e => setContact('phone', e.target.value)}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title='Social links'
              subheader='Leave a link empty to hide that icon'
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent sx={{ display: 'grid', gap: 4 }}>
              {NETWORKS.map(({ network, label, icon, placeholder }) => {
                const value = form.contact.social[network]
                const invalid = value && (!isLink(value) || !value.trim().startsWith('https://'))

                return (
                  <Box key={network} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ pt: 2, color: 'text.secondary' }}>
                      <Icon icon={icon} fontSize='1.25rem' />
                    </Box>
                    <TextField
                      size='small'
                      fullWidth
                      label={label}
                      value={value}
                      placeholder={placeholder}
                      error={Boolean(invalid)}
                      helperText={invalid ? 'Paste the full address, starting with https://' : ' '}
                      onChange={e =>
                        setForm(f => ({
                          ...f,
                          contact: { ...f.contact, social: { ...f.contact.social, [network]: e.target.value } }
                        }))
                      }
                    />
                  </Box>
                )
              })}
            </CardContent>
          </Card>
        </Grid>
        {COLUMNS.map(({ key, title }) => (
          <Grid item xs={12} md={6} key={key}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} />
              <CardContent sx={{ display: 'grid', gap: 4 }}>
                <TextField
                  size='small'
                  fullWidth
                  required
                  label='Column heading'
                  value={form[key].name}
                  inputProps={{ maxLength: 60 }}
                  error={!form[key].name.trim()}
                  helperText={!form[key].name.trim() ? 'Add a heading' : 'Shown in capitals on the shop'}
                  onChange={e => setPart(key, { ...form[key], name: e.target.value })}
                />
                <MenuItems
                  items={form[key].items}
                  onChange={items => setPart(key, { ...form[key], items })}
                  depth={2}
                  maxDepth={3}
                  path={key}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <SaveBar dirty={dirty} saving={saving} onSave={onSave} onDiscard={() => setForm(saved)} />
    </Box>
  )
}

export default FooterEditor
