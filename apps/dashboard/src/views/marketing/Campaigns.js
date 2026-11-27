// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import TableContainer from '@mui/material/TableContainer'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from 'src/services/campaigns'

// ** Utils Import
import { formatKarachiDate } from 'src/@core/utils/format'

const emptyForm = { name: '', channel: 'email', status: 'draft', scheduledAt: new Date().toISOString().slice(0, 10) }

const statusColors = { draft: 'secondary', scheduled: 'warning', sent: 'success' }
const channelIcons = { email: 'mdi:email-outline', sms: 'mdi:message-text-outline', push: 'mdi:bell-ring-outline' }

/**
 * Campaigns screen: TableBasic + Dialog CRUD pattern, modeled loosely on the
 * email app's ComposePopup shell for the compose fields.
 */
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchCampaigns = useCallback(async () => {
    const data = await getCampaigns()
    setCampaigns(data.campaigns)
  }, [])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const handleOpenAdd = () => {
    setEditId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const handleOpenEdit = row => {
    setEditId(row.id)
    setForm({ ...row, scheduledAt: row.scheduledAt.slice(0, 10) })
    setOpen(true)
  }

  const handleSubmit = async () => {
    const payload = { ...form, scheduledAt: new Date(form.scheduledAt).toISOString() }
    if (editId) {
      await updateCampaign(editId, payload)
      toast.success('Campaign updated')
    } else {
      await createCampaign(payload)
      toast.success('Campaign created')
    }
    setOpen(false)
    fetchCampaigns()
  }

  const handleDelete = async row => {
    await deleteCampaign(row.id)
    toast.success('Campaign deleted')
    fetchCampaigns()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Campaigns'
            action={
              <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={handleOpenAdd}>
                New Campaign
              </Button>
            }
          />
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Channel</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Scheduled</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                        <Icon icon={channelIcons[row.channel]} fontSize={18} />
                        <Box sx={{ textTransform: 'uppercase' }}>{row.channel}</Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <CustomChip
                        size='small'
                        skin='light'
                        color={statusColors[row.status]}
                        label={row.status}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{formatKarachiDate(row.scheduledAt)}</TableCell>
                    <TableCell align='right'>
                      <IconButton size='small' onClick={() => handleOpenEdit(row)}>
                        <Icon icon='mdi:pencil-outline' fontSize={20} />
                      </IconButton>
                      <IconButton size='small' onClick={() => handleDelete(row)}>
                        <Icon icon='mdi:delete-outline' fontSize={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>

      <Dialog maxWidth='sm' fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? 'Edit Campaign' : 'New Campaign'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Campaign Name'
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  label='Channel'
                  value={form.channel}
                  onChange={e => setForm({ ...form, channel: e.target.value })}
                >
                  <MenuItem value='email'>Email</MenuItem>
                  <MenuItem value='sms'>SMS</MenuItem>
                  <MenuItem value='push'>Push</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label='Status' value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <MenuItem value='draft'>Draft</MenuItem>
                  <MenuItem value='scheduled'>Scheduled</MenuItem>
                  <MenuItem value='sent'>Sent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='date'
                label='Scheduled At'
                InputLabelProps={{ shrink: true }}
                value={form.scheduledAt}
                onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit} disabled={!form.name}>
            {editId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Campaigns
