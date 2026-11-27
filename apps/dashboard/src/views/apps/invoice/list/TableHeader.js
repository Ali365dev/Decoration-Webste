// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const statusOptions = [
  { value: 'processing', label: 'Mark Processing' },
  { value: 'shipped', label: 'Mark Shipped' },
  { value: 'delivered', label: 'Mark Delivered' },
  { value: 'cancelled', label: 'Mark Cancelled' }
]

const TableHeader = props => {
  const { value, selectedRows, handleFilter, onBulkStatusChange, onExport } = props
  const count = selectedRows?.length ?? 0

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Select
          size='small'
          displayEmpty
          value=''
          disabled={count === 0}
          onChange={e => { if (e.target.value && onBulkStatusChange) onBulkStatusChange(e.target.value) }}
          renderValue={() => count > 0 ? `${count} selected` : 'Bulk Actions'}
          sx={{ minWidth: 160 }}
        >
          <MenuItem disabled>
            <Typography variant='caption'>Change status to…</Typography>
          </MenuItem>
          {statusOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
        {onExport && (
          <Button
            size='small'
            color='secondary'
            variant='outlined'
            onClick={onExport}
            startIcon={<Icon icon='mdi:download-outline' />}
          >
            Export CSV
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          placeholder='Search Order'
          sx={{ mr: 4, mb: 2, maxWidth: '180px' }}
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2 }} component={Link} variant='contained' href='/sales/orders/add'>
          Create Order
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
