// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getSubscribers, updateSubscriber, deleteSubscriber, sendNewsletter } from 'src/services/newsletter'

// ** Utils Import
import { formatKarachiDate } from 'src/@core/utils/format'

/**
 * Newsletter screen: TableBasic-style subscriber list (views/table/mui/TableBasic.js
 * shape) plus a simple compose/send form. Sending is a stub - no real email
 * delivery - it just records a Campaign-like entry via the Newsletter service.
 */
const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const fetchSubscribers = useCallback(async () => {
    const data = await getSubscribers()
    setSubscribers(data.subscribers)
  }, [])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const handleToggleActive = async row => {
    await updateSubscriber(row.id, { isActive: !row.isActive })
    toast.success(`Subscriber ${row.isActive ? 'unsubscribed' : 'resubscribed'}`)
    fetchSubscribers()
  }

  const handleDelete = async row => {
    await deleteSubscriber(row.id)
    toast.success('Subscriber removed')
    fetchSubscribers()
  }

  const handleSend = async () => {
    setSending(true)
    try {
      await sendNewsletter({ subject, body })
      toast.success(`Newsletter sent to ${subscribers.filter(s => s.isActive).length} subscribers`)
      setSubject('')
      setBody('')
    } finally {
      setSending(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5}>
        <Card>
          <CardHeader title='Compose Newsletter' subheader='Stub - creates a campaign record, no real email is sent' />
          <CardContent>
            <TextField
              fullWidth
              label='Subject'
              sx={{ mb: 4 }}
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={6}
              label='Message'
              sx={{ mb: 4 }}
              value={body}
              onChange={e => setBody(e.target.value)}
            />
            <Button
              fullWidth
              variant='contained'
              disabled={!subject || !body || sending}
              startIcon={<Icon icon='mdi:send-outline' />}
              onClick={handleSend}
            >
              Send to Subscribers
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card>
          <CardHeader title={`Subscribers (${subscribers.length})`} />
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Subscribed</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscribers.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Typography variant='body2'>{row.email}</Typography>
                    </TableCell>
                    <TableCell>{formatKarachiDate(row.subscribedAt)}</TableCell>
                    <TableCell>
                      <CustomChip
                        size='small'
                        skin='light'
                        color={row.isActive ? 'success' : 'secondary'}
                        label={row.isActive ? 'Active' : 'Unsubscribed'}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Switch size='small' checked={row.isActive} onChange={() => handleToggleActive(row)} />
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
    </Grid>
  )
}

export default Newsletter
